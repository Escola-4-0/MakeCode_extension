# Escola 4.0
Esta é a biblioteca de blocos do projeto [Escola 4.0](https://www.escola4pontozero.com.br/). Com ela você pode realizar as atividades propostas no curso e dar vida aos projetos montados com nossos kits.

## Ligando motores
Para ligar motores individualmente, use o bloco `girar motor`. Selecione o motor e defina a velocidade de rotação entre `-100%` e `100%`. Velocidades negativas fazem o motor girar no sentido oposto ao de velocidades positivas. Clicando em `+` é possível limitar o giro do motor por uma quantidade de tempo ou rotações.

```blocks
Escola4ponto0.motorRun(EscolaMotorPick.MotorA, 50)
Escola4ponto0.motorRun(EscolaMotorPick.MotorA, 50, 3, EscolaMoveUnit.Seconds)
```

O bloco `girar motores A+B` permite ligar os dois motores ao mesmo tempo, com velocidades independentes. Também é possível definir a duração do movimento, sendo que ao limitar por número de rotações, esta quantidade será válida para o motor A.

```blocks
Escola4ponto0.motorRunAB(50, 50)
Escola4ponto0.motorRun(50, 50, 3, EscolaMoveUnit.Rotations)
```

## TODO

- [ ] Add a reference for your blocks here
- [ ] Add "- beta" to the GitHub project description if you are still iterating it.
- [ ] Turn on your automated build on https://travis-ci.org
- [ ] Use "pxt bump" to create a tagged release on GitHub
- [ ] Get your package reviewed and approved https://makecode.microbit.org/extensions/approval

Read more at https://makecode.microbit.org/extensions

## Supported targets

* for PXT/microbit

