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
    //%block="45°"
    d45 = 1,
    //%block="90°"
    d90 = 2,
    //%block="135°"
    d135 = 3,
    //%block="180°"
    d180 = 4,
    //%block="225°"
    d225 = 5,
    //%block="270°"
    d270 = 6,
    //%block="315°"
    d315 = 7,
    //%block="360°"
    d60 = 8
}

//% color="#3f84af" weight=100 icon="\uf1b0" block="Escola 4.0"
//% groups=['Motores', 'Servo Motor']
namespace Carrinho {
    let stepCounter=0, stepMax=0, stepCounterA = 0, stepMaxA = 0, stepCounterB = 0, stepMaxB = 0;

    export function runMotor(motor: MotorPick, direction: MotorDirection) {
        if (motor == MotorPick.MotorA) {
            if (direction == MotorDirection.Clockwise) {
                pins.digitalWritePin(DigitalPin.P8, 0)
                pins.digitalWritePin(DigitalPin.P1, 1)
            } else {
                pins.digitalWritePin(DigitalPin.P8, 1)
                pins.digitalWritePin(DigitalPin.P1, 0)
            }
        } else {
            if (direction == MotorDirection.Clockwise) {
                pins.digitalWritePin(DigitalPin.P5, 0)
                pins.digitalWritePin(DigitalPin.P0, 1)
            } else {
                pins.digitalWritePin(DigitalPin.P5, 1)
                pins.digitalWritePin(DigitalPin.P0, 0)
            }
        }
    }

    export function setServoSensor(motor: MotorPick) {
        if (motor == MotorPick.MotorA) {
            //pins.setPull(DigitalPin.P15, PinPullMode.PullNone)
            pins.setPull(DigitalPin.P16, PinPullMode.PullNone)
            //pins.setEvents(DigitalPin.P15, PinEventType.Edge)
            pins.setEvents(DigitalPin.P16, PinEventType.Edge)
        } else {
            pins.setPull(DigitalPin.P13, PinPullMode.PullNone)
            //pins.setPull(DigitalPin.P14, PinPullMode.PullNone)
            pins.setEvents(DigitalPin.P13, PinEventType.Edge)
            //pins.setEvents(DigitalPin.P14, PinEventType.Edge)
        }
    }

    control.onEvent(EventBusSource.MICROBIT_ID_IO_P16, EventBusValue.MICROBIT_PIN_EVT_RISE, function () {
        stepCounter += 1
        if (stepCounter >= stepMax) {
            //pins.setEvents(DigitalPin.P15, PinEventType.None)
            pins.setEvents(DigitalPin.P16, PinEventType.None)
            stopMotor(MotorPick.MotorA)
        }
    })
    control.onEvent(EventBusSource.MICROBIT_ID_IO_P16, EventBusValue.MICROBIT_PIN_EVT_FALL, function () {
        stepCounter += 1
        if (stepCounter >= stepMax) {
            //pins.setEvents(DigitalPin.P15, PinEventType.None)
            pins.setEvents(DigitalPin.P16, PinEventType.None)
            stopMotor(MotorPick.MotorA)
        }
    })

    control.onEvent(EventBusSource.MICROBIT_ID_IO_P13, EventBusValue.MICROBIT_PIN_EVT_RISE, function () {
        stepCounter += 1
        if (stepCounter >= stepMax) {
            pins.setEvents(DigitalPin.P13, PinEventType.None)
            //pins.setEvents(DigitalPin.P14, PinEventType.None)
            stopMotor(MotorPick.MotorB)
        }
    })

    control.onEvent(EventBusSource.MICROBIT_ID_IO_P13, EventBusValue.MICROBIT_PIN_EVT_FALL, function () {
        stepCounter += 1
        if (stepCounter >= stepMax) {
            pins.setEvents(DigitalPin.P13, PinEventType.None)
            //pins.setEvents(DigitalPin.P14, PinEventType.None)
            stopMotor(MotorPick.MotorB)
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
    export function runContMotor(motor: MotorPick, speed: number, duration: number = 0) {
        motorSpeed(motor, Math.abs(speed))
        if (speed > 0) {
            runMotor(motor, MotorDirection.Clockwise)
        } else {
            runMotor(motor, MotorDirection.CounterClockwise)
        }
        if (duration != 0) {
            basic.pause(duration * 1000)
            stopMotor(motor)
        }
    }

    /**
     * Interrompe a rotação do motor
     */
    //% block="parar motor %motor"
    //% group='Motores'      weight=50
    export function stopMotor(motor: MotorPick) {
        if (motor == MotorPick.MotorA) {
            pins.digitalWritePin(DigitalPin.P1, 1)
            pins.digitalWritePin(DigitalPin.P8, 1)
            pins.digitalWritePin(DigitalPin.P11, 1)
        }
        else {
            pins.digitalWritePin(DigitalPin.P0, 1)
            pins.digitalWritePin(DigitalPin.P5, 1)
            pins.digitalWritePin(DigitalPin.P2, 1)
        }
    }
    /**
     * Altera a velocidade do motor para um valor entre 0 e 100% (sem alterar o sentido de rotação)
     */
    // block="velocidade do motor %motor em %velocidade\\%"
    //% group='Motores'      weight=0
    //% velocidade.min=0 velocidade.max=100
    export function motorSpeed(motor: MotorPick, velocidade: number) {
        if (motor == MotorPick.MotorA) {
            pins.analogWritePin(AnalogPin.P11, 10 * velocidade)
        } else {
            pins.analogWritePin(AnalogPin.P2, 10 * velocidade)
        }
    }

    /**
     * Gira o servo motor por uma quantidade limitada de rotações
     */
    //% block="girar servo motor %motor por %value rotações com velocidade %speed\\%"
    //% group='Servo Motor'     weight=100
    //% expandableArgumentMode="toggle"     inlineInputMode=inline
    //% speed.shadow="speedPicker"
    export function runServoMotor(motor: MotorPick, value: number = 0, speed: number) {
        setServoSensor(motor)
        let direction
        if (speed > 0) {
            direction = MotorDirection.Clockwise
        } else {
            direction = MotorDirection.CounterClockwise
        }
        stepCounter = 0
        stepMax = value * 40
        motorSpeed(motor, Math.abs(speed))
        runMotor(motor, direction)
        while (stepCounter < stepMax) {
            basic.pause(1)
        }
        stopMotor(motor)
    }
    /**
     * Gira o servo motor por uma quantidade limitada de graus
     */
    //%block="girar servo motor %motor %degrees com velocidade %speed\\%"
    //%group='Servo Motor'
    //%speed.shadow="speedPicker"
    export function runServoDegrees(motor: MotorPick, degrees: ServoDegrees, speed: number) {

    }

}
