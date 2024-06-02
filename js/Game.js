import Track from './Track.js';
import Player from './Player.js';

export default class MainGame extends Phaser.Scene
{
    constructor ()
    {
        super('MainGame');

        this.player;
        this.tracks;

        this.score = 0;
        this.highscore = 0;
        this.infoPanel;

        this.scoreText;
        this.highscoreText;
    }

    create ()
    {
        this.score = 0;
        this.highscore = this.registry.get('highscore');

        this.add.image(512, 384, 'background');

        this.tracks = [
            new Track(this, 0, 196),
            new Track(this, 1, 376),
            new Track(this, 2, 536),
            new Track(this, 3, 700)
        ];

        // Cambiar el track inicial del personaje a track 3
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
    }

    start ()
    {
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
        this.tracks[1].start(300, 600); //Track 1 
        this.tracks[2].start(5000, 9000);
        this.tracks[3].start(2700, 6000); //Track 2

        // Ajustar la lógica de puntuación según los golpes dados a los snowmen
        this.scoreText.setText(this.score);
    }

    // Método para manejar la puntuación basada en golpes a snowmen
    hitSnowman(size)
    {
        if (size === 'Small')
        {
            this.score += 1;
        }
        else if (size === 'Large')
        {
            this.score += 2;
        }
        this.scoreText.setText(this.score);
    }

    gameOver ()
    {
        this.infoPanel.setTexture('gameover');

        this.tweens.add({
            targets: this.infoPanel,
            y: 384,
            alpha: 1,
            duration: 500,
            ease: 'Power2'
        });

        this.tracks.forEach((track) => {
            track.stop();
        });

        this.sound.stopAll();
        this.sound.play('gameover');

        this.player.stop();

        if (this.score > this.highscore)
        {
            this.highscoreText.setText('NEW!');

            this.registry.set('highscore', this.score);
        }

        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.start('MainMenu');
        }, this);

        this.input.once('pointerdown', () => {
            this.scene.start('MainMenu');
        }, this);
    }
}
