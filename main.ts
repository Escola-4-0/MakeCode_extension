enum EscolaMotorPick {
    //% block="A"
    MotorA,
    //% block="B"
    MotorB
}

enum EscolaMoveUnit {
    //% block="segundos"
    Seconds,
    //% block="rotações"
    Rotations
}

//% color="#2695b5" weight=100 icon="\uf1b0" block="Escola 4.0"
//% groups=['Motores']
namespace Escola4ponto0 {
    
    class Motor {
        pwm: AnalogPin;
        in1: DigitalPin;
        in2: DigitalPin;
        sensor1: DigitalPin;
        sensor2: DigitalPin;

        constructor(motor: EscolaMotorPick) {
            if (motor == EscolaMotorPick.MotorA) {
                this.pwm = AnalogPin.P8
                this.in1 = DigitalPin.P2
                this.in2 = DigitalPin.P11
                this.sensor1 = DigitalPin.P15
                this.sensor2 = DigitalPin.P16
            } else {
                this.pwm = AnalogPin.P0
                this.in1 = DigitalPin.P1
                this.in2 = DigitalPin.P5            
                this.sensor1 = DigitalPin.P13
                this.sensor2 = DigitalPin.P14
            }
        }

        runDirect(): void {
            pins.digitalWritePin(this.in1, 0)
            pins.digitalWritePin(this.in2, 1)
        }

        runReverse(): void {
            pins.digitalWritePin(this.in1, 1)
            pins.digitalWritePin(this.in2, 0)
        }

        speed(value: number): void {
            pins.analogWritePin(this.pwm, Math.map(value, 0, 100, 0, 1000))
        }

        stop(): void {
            pins.digitalWritePin(this.in1, 1)
            pins.digitalWritePin(this.in2, 1)
            pins.analogWritePin(this.pwm, 1023)
        }

        encoderEnable(): void {
            pins.setEvents(this.sensor1, PinEventType.Edge)
            pins.setEvents(this.sensor2, PinEventType.Edge)
            pins.setPull(this.sensor1, PinPullMode.PullUp)
            pins.setPull(this.sensor2, PinPullMode.PullUp)
        }

        encoderDisable(): void {
            pins.setEvents(this.sensor1, PinEventType.None)
            pins.setEvents(this.sensor2, PinEventType.None)
        }

        stepCounter(value:number): void{
            let counter=0
            let read=0
            pins.setPull(this.sensor1, PinPullMode.PullUp)
            pins.setPull(this.sensor2, PinPullMode.PullUp)
            let state1=pins.digitalReadPin(this.sensor1)
            let state2=pins.digitalReadPin(this.sensor2)
            while(true){
                read=pins.digitalReadPin(this.sensor1)
                if(state1!=read){
                    counter+=1
                    if(counter>=value){
                        break
                    }
                    state1=read
                }
                read=pins.digitalReadPin(this.sensor2)
                if(state2!=read){
                    counter+=1
                    if(counter>=value){
                        break
                    }
                    state2=read
                }
            }

        }
    }

    
    /**
     * Gira o motor em uma dada velocidade por determinado tempo ou quantidade de rotações.
     * Se a velocidade for positiva, o motor gira em um sentido, se for negativa, o motor gira no sentido inverso.
     */
    //% block="girar motor %motor com velocidade %speed\\% || por %duration %unit"
    //% group='Motores' weight=100 blockGap=8
    //% expandableArgumentMode="toggle"    inlineInputMode=inline
    //% speed.shadow="speedPicker"
    //% duration.min=0
    export function motorRun(motor: EscolaMotorPick, speed: number, duration?: number, unit?: EscolaMoveUnit) {
        let myMotor = new Motor(motor)
        myMotor.speed(Math.abs(speed))
        if (speed > 0) {
            myMotor.runDirect()
        } else {
            myMotor.runReverse()
        }
        if (duration) {
            switch(unit) {
                case EscolaMoveUnit.Seconds:
                    basic.pause(duration * 1000)
                    break;
                case EscolaMoveUnit.Rotations:
                    myMotor.stepCounter(duration*40)
                    break;
            }
            myMotor.stop()
        }
    }

    /**
     * Gira os motores A e B ao mesmo tempo, com velocidades independentes.
     * Se definida, a quantidade de rotações é realizada pelo motor A.
     */
    //% block="girar motores A+B com velocidades A:%speedA\\% e B:%speedB\\% || por %duration %unit"
    //% group='Motores' weight=90 blockGap=8
    //% expandableArgumentMode="toggle"    inlineInputMode=inline
    //% speedA.shadow="speedPicker" speedB.shadow="speedPicker"
    //% duration.min=0
    export function motorRunAB(speedA: number, speedB: number, duration?: number, unit?:EscolaMoveUnit) {
        motorRun(EscolaMotorPick.MotorB, speedB)
        motorRun(EscolaMotorPick.MotorA, speedA, duration, unit)
        if(duration){
            motorStop(EscolaMotorPick.MotorB)
        }
    }

    /**
     * Altera a velocidade do motor para um valor entre 0 e 100%, sem alterar o sentido de rotação.
     */
    //% block="velocidade do motor %motor em %speed\\%"
    //% group='Motores' weight=50 blockGap=8
    //% speed.min=0 speed.max=100
    export function motorSpeed(motor: EscolaMotorPick, speed: number) {
        let myMotor = new Motor(motor)
        myMotor.speed(Math.abs(speed))
    }

    /**
     * Interrompe a rotação do motor.
     */
    //% block="parar motor %motor"
    //% group='Motores' weight=0 blockGap=8
    export function motorStop(motor: EscolaMotorPick) {
        let myMotor = new Motor(motor)
        myMotor.stop()
    }
}