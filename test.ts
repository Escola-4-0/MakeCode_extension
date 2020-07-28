// tests go here; this will not be compiled when this package is used as a library
Escola4ponto0.motorRun(EscolaMotorPick.MotorA, 50)
Escola4ponto0.motorRun(EscolaMotorPick.MotorB, 50)
basic.pause(3000)
Escola4ponto0.motorStop(EscolaMotorPick.MotorA)
Escola4ponto0.motorStop(EscolaMotorPick.MotorB)
basic.pause(1000)
Escola4ponto0.motorRunAB(40, 70, 2, EscolaMoveUnit.Rotations)
Escola4ponto0.motorRunAB(50, 50, 3, EscolaMoveUnit.Seconds)
