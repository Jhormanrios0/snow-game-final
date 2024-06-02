# Snowman-Game
## Jhorman David Rodriguez Rios

## Descripción del Juego

Snowgame es un juego desarrollado con `Phaser` y `JavaScript` en el que los jugadores deben golpear a snowmen para obtener puntos. El juego cuenta con varias características y configuraciones que se pueden modificar para ajustar la dificultad y la experiencia del jugador.

## Cambios Realizados

### 1. Cambiar la Velocidad de Aparición de los Enemigos

Para hacer el juego más difícil, se ha ajustado la velocidad de aparición de los enemigos en los tracks 1 y 3. Estos cambios se realizaron en el archivo `Game.js`.

#### Código Modificado

```javascript
start() {
    this.input.keyboard.removeAllListeners();

    this.tweens.add({
        targets: this.infoPanel,
        y: 700,
        alpha: 0,
        duration: 500,
        ease: 'Power2'
    });

    this.player.start();

    
    this.tracks[0].start(4000, 8000);
    this.tracks[1].start(300, 600); // Track 1
    this.tracks[2].start(5000, 9000);
    this.tracks[3].start(2700, 6000); // Track 3

   
    this.scoreText.setText(this.score);
}

```

### 2. Cambiar el Mensaje de Inicio
En la pantalla de inicio, se ha cambiado el mensaje de "Click to start" para que aparezca el nombre del desarrollador. Este cambio se realizó en el archivo `Preloader.js`.


#### Código Modificado
```javascript
if (this.sound.locked)
        {
            
            this.loadText.setText('Jhorman David\nRodriguez Rios');


            this.input.once('pointerdown', () => {

                this.scene.start('MainMenu');

            });
        }
        else
        {
            this.scene.start('MainMenu');
        }
    

```

### 3. Cambiar el Track Inicial del Personaje

El personaje ahora inicia en un track diferente. Este cambio se realizó en el archivo `Game.js`.

#### Código Modificado
```javascript
 this.player = new Player(this, this.tracks[3]);

        this.add.image(0, 0, 'overlay').setOrigin(0);

        this.add.image(16, 0, 'sprites', 'panel-score').setOrigin(0);
        this.add.image(1024-16, 0, 'sprites', 'panel-best').setOrigin(1, 0);

        this.infoPanel = this.add.image(512, 384, 'sprites', 'controls');
        this.scoreText = this.add.text(140, 2, this.score, { fontFamily: 'Arial', fontSize: 32, color: '#ffffff' });
        this.highscoreText = this.add.text(820, 2, this.highscore, { fontFamily: 'Arial', fontSize: 32, color: '#ffffff' });

        this.input.keyboard.once('keydown-SPACE', this.start, this);
        this.input.keyboard.once('keydown-UP', this.start, this);
        this.input.keyboard.once('keydown-DOWN', this.start, this);
    
```

### 4. Cambiar el Sistema de Puntuación
El sistema de puntuación se ha modificado para que los puntos se otorguen según los golpes dados a los snowmen: 1 punto por snowman pequeño y 2 puntos por snowman grande. Este cambio se realizó en los archivos `Game.js` y `Snowman.js`.

#### Código Modificado en `game.js`

```javascript
hitSnowman(size) {
    if (size === 'Small') {
        this.score += 1;
    } else if (size === 'Large') {
        this.score += 2;
    }
    this.scoreText.setText(this.score);
}

```

#### Código Modificado en `snowman.js`
```javascript
hit() {
    if (this.chooseEvent) {
        this.chooseEvent.remove();
    }

    this.isAlive = false;
    this.previousAction = -1;

    this.play('snowmanDie' + this.size);

    this.sound.play('hit-snowman');

    this.body.stop();

    this.body.enable = false;

    const knockback = '-=' + Phaser.Math.Between(100, 200).toString();

    this.scene.tweens.add({
        targets: this,
        x: knockback,
        ease: 'sine.out',
        duration: 1000,
        onComplete: () => {
            if (this.x < -100) {
                this.x = -100;
            }
        }
    });


    this.scene.hitSnowman(this.size);

    this.chooseEvent = this.time.delayedCall(Phaser.Math.Between(1000, 3000), this.chooseAction, [], this);
}

```