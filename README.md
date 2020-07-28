# Escola 4.0

Esta é a biblioteca de blocos do projeto [Escola 4.0](https://www.escola4pontozero.com.br/). Com ela você pode realizar as atividades propostas no curso e dar vida aos projetos montados com nossos kits.

## Controlando motores

Para ligar motores individualmente, use o bloco `|girar motor|`. Selecione o motor e defina a velocidade de rotação entre `-100%` e `100%`. Velocidades negativas fazem o motor girar no sentido oposto ao de velocidades positivas.

```blocks
Escola4ponto0.motorRun(EscolaMotorPick.MotorA, 50)
```

Clicando em `|+|` é possível limitar o giro do motor por uma quantidade de tempo ou rotações.

```blocks
Escola4ponto0.motorRun(EscolaMotorPick.MotorA, 50, 3, EscolaMoveUnit.Seconds)
```

O bloco `|girar motores A+B|` permite ligar os dois motores ao mesmo tempo, com velocidades independentes. Também é possível definir a duração do movimento, e se a limitação for dada em rotações, esta será a quantidade de voltas realizadas pelo motor A.

```blocks
Escola4ponto0.motorRunAB(50, 50)
Escola4ponto0.motorRun(50, 50, 3, EscolaMoveUnit.Rotations)
```

Para fazer um motor parar, basta usar o bloco `|parar motor|`.

```blocks
Escola4ponto0.motorStop(EscolaMotorPick.MotorA)
```

## Supported targets

* for PXT/microbit

