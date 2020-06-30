class Motor {
    pwm: AnalogPin;
    in1: DigitalPin;
    in2: DigitalPin;
    sensor1: DigitalPin;
    sensor2: DigitalPin;

    constructor(motor: MotorPick) {
        if (motor == MotorPick.MotorA) {
            this.in1 = DigitalPin.P1
            this.in2 = DigitalPin.P8
            this.pwm = AnalogPin.P11
            this.sensor1 = DigitalPin.P15
            this.sensor2 = DigitalPin.P16
        } else {
            this.in1 = DigitalPin.P0
            this.in2 = DigitalPin.P5
            this.pwm = AnalogPin.P2
            this.sensor1 = DigitalPin.P13
            this.sensor2 = DigitalPin.P14
        }
    }

    girarHorario(): void {
        pins.digitalWritePin(this.in1, 0)
        pins.digitalWritePin(this.in2, 1)
    }

    girarAntiHorario(): void {
        pins.digitalWritePin(this.in1, 1)
        pins.digitalWritePin(this.in2, 0)
    }

    velocidade(valor: number): void {
        pins.analogWritePin(this.pwm, valor)
    }

    parar(): void {
        pins.digitalWritePin(this.in1, 1)
        pins.digitalWritePin(this.in2, 1)
        pins.analogWritePin(this.pwm, 1023)
    }

    ligarEncoder(): void {
        pins.setEvents(this.sensor1, PinEventType.Edge)
        pins.setEvents(this.sensor2, PinEventType.Edge)
    }

    desligarEncoder(): void {
        pins.setEvents(this.sensor1, PinEventType.None)
        pins.setEvents(this.sensor2, PinEventType.None)
    }
}

enum MotorDirection {
    //% block="direto"
    Clockwise,
    //% block="inverso"
    CounterClockwise
}
enum MotorPick {
    //% block="A"
    MotorA,
    //% block="B"
    MotorB
}
enum MoveUnit {
    //% block="rotações"
    Rotations,
    //% block="segundos"
    Seconds
}
enum ServoDegrees {
    //%block="90°"
    d90 = 1,
    //%block="180°"
    d180 = 2,
    //%block="270°"
    d270 = 3,
    //%block="360°"
    d60 = 4
}

//% color="#2695b5" weight=100 icon="\uf1b0" block="Escola 4.0"
//% groups=['Motores', 'Servo Motor']
namespace Escola4_0 {
    let stepCounter = 0, stepMax = 0, stepCounterA = 0, stepMaxA = 0, stepCounterB = 0, stepMaxB = 0;
    let flag = false

    pins.setPull(DigitalPin.P13, PinPullMode.PullUp)
    pins.setPull(DigitalPin.P16, PinPullMode.PullUp)

    control.onEvent(EventBusSource.MICROBIT_ID_IO_P16, EventBusValue.MICROBIT_PIN_EVT_RISE, function () {
        if (flag) {
            stepCounter += 1
            if (stepCounter >= stepMax) {
                flag = false
                motorStop(MotorPick.MotorA)
            }
        }
    })
    control.onEvent(EventBusSource.MICROBIT_ID_IO_P16, EventBusValue.MICROBIT_PIN_EVT_FALL, function () {
        if (flag) {
            stepCounter += 1
            if (stepCounter >= stepMax) {
                flag = false
                motorStop(MotorPick.MotorA)
            }
        }
    })

    control.onEvent(EventBusSource.MICROBIT_ID_IO_P13, EventBusValue.MICROBIT_PIN_EVT_RISE, function () {
        if (flag) {
            stepCounter += 1
            if (stepCounter >= stepMax) {
                flag = false
                motorStop(MotorPick.MotorA)
            }
        }
    })

    control.onEvent(EventBusSource.MICROBIT_ID_IO_P13, EventBusValue.MICROBIT_PIN_EVT_FALL, function () {
        if (flag) {
            stepCounter += 1
            if (stepCounter >= stepMax) {
                flag = false
                motorStop(MotorPick.MotorA)
            }
        }
    })

    /**
     * Gira o motor em uma dada velocidade por um tempo limitado (opcional). Se a velocidade for positiva,
     * o motor gira em um sentido, se for negativa, o motor gira no sentido inverso
     */
    //% block="girar motor %motor com velocidade %speed\\% || por %duration segundos"
    //% group='Motores'      weight=100
    //% expandableArgumentMode="enabled"    inlineInputMode=inline
    //% speed.shadow="speedPicker"
    //% duration.min=0
    export function motorContinuous(motor: MotorPick, speed: number, duration: number = 0) {
        let motorTest = new Motor(motor)
        motorTest.velocidade(Math.abs(speed))
        if (speed > 0) {
            motorTest.girarHorario()
        } else {
            motorTest.girarAntiHorario()
        }
        if (duration != 0) {
            basic.pause(duration * 1000)
            motorTest.parar()
        }
    }

    /**
     * Interrompe a rotação do motor
     */
    //% block="parar motor %motor"
    //% group='Motores'      weight=50
    export function motorStop(motor: MotorPick) {
        let motorTest = new Motor(motor)
        motorTest.parar()
    }
    /**
     * Altera a velocidade do motor para um valor entre 0 e 100% (sem alterar o sentido de rotação)
     */
    //% block="velocidade do motor %motor em %velocidade\\%"
    //% group='Motores'      weight=0
    //% velocidade.min=0 velocidade.max=100
    export function motorSpeed(motor: MotorPick, velocidade: number) {
        let motorTest = new Motor(motor)
        motorTest.velocidade(Math.abs(velocidade))
    }

    /**
     * Gira o servo motor por uma quantidade limitada de rotações
     */
    //% block="girar servo motor %motor por %value rotações com velocidade %speed\\%"
    //% group='Servo Motor'     weight=100
    //% expandableArgumentMode="toggle"     inlineInputMode=inline
    //% speed.shadow="speedPicker"
    export function motorRotations(motor: MotorPick, value: number = 0, speed: number) {
        stepCounter = 0
        stepMax = value * 40
        flag = true
        let motorTest = new Motor(motor)
        motorTest.ligarEncoder()
        motorTest.velocidade(Math.abs(speed))
        if (speed > 0) {
            motorTest.girarHorario()
        } else {
            motorTest.girarAntiHorario()
        }
        while (flag) {
            basic.pause(1)
        }
        motorTest.parar()
        motorTest.desligarEncoder()
    }
    /**
     * Gira o servo motor por uma quantidade limitada de graus
    
    //block="girar servo motor %motor %degrees com velocidade %speed\\%"
    //%group='Servo Motor'
    //%speed.shadow="speedPicker"
    export function motorDegrees(motor: MotorPick, degrees: ServoDegrees, speed: number) {
        stepCounter = 0
        stepMax = degrees * 10 - 4
        flag = true
        pins.setEvents(DigitalPin.P16, PinEventType.Edge)
        pins.setEvents(DigitalPin.P13, PinEventType.Edge)
        motorSpeed(motor, Math.abs(speed) / 2)
        runMotor(motor, direction)
        while (flag) {
            //pass
        }
        stopMotor(motor)
        pins.setEvents(DigitalPin.P16, PinEventType.None)
        pins.setEvents(DigitalPin.P13, PinEventType.None)

    }*/

}
