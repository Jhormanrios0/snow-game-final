export default class Snowman extends Phaser.Physics.Arcade.Sprite
{
    constructor (scene, track, size)
    {
        const frame = (size === 'Small') ? 'snowman-small-idle0' : 'snowman-big-idle0';
        const x = (size === 'Small') ? 80 : -100;

        super(scene, x, track.y, 'sprites', frame);

        this.setOrigin(0.5, 1);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        if (size === 'Small')
        {
            this.body.setSize(100, 100);
            this.body.setOffset(20, 40);
        }
        else
        {
            this.body.setSize(100, 120);
            this.body.setOffset(50, 50);
        }

        this.time = scene.time;
        this.sound = scene.sound;

        this.isAlive = true;
        this.isThrowing = false;

        this.size = size;
        this.speed = 50;

        this.previousAction = 0;

        this.currentTrack = track;

        this.play('snowmanIdle' + this.size);
    }

    start ()
    {
        this.isAlive = true;
        this.isThrowing = false;
        this.previousAction = 0;

        this.y = this.currentTrack.y;

        this.on('animationcomplete-snowmanThrowStart' + this.size, this.releaseSnowball, this);
        this.on('animationcomplete-snowmanThrowEnd' + this.size, this.throwComplete, this);

        this.setActive(true);
        this.setVisible(true);

        this.play('snowmanWalk' + this.size);

        this.setVelocityX(this.speed);

        this.chooseEvent = this.time.delayedCall(Phaser.Math.Between(3000, 6000), this.chooseAction, [], this);
    }

    chooseAction ()
    {
        this.isAlive = true;
        this.body.enable = true;

        this.setVelocityX(0);

        const t = Phaser.Math.Between(0, 100);

        if (t < 50)
        {
            if (this.previousAction === 2)
            {
                this.walk();
            }
            else
            {
                this.throw();
            }
        }
        else if (t > 60)
        {
            this.walk();
        }
        else
        {
            if (this.previousAction === 1)
            {
                if (t > 55)
                {
                    this.walk();
                }
                else
                {
                    this.throw();
                }
            }
            else
            {
                this.goIdle();
            }
        }
    }

    walk ()
    {
        this.previousAction = 0;

        this.play('snowmanWalk' + this.size, true);

        this.setVelocityX(this.speed);

        this.chooseEvent = this.time.delayedCall(Phaser.Math.Between(3000, 6000), this.chooseAction, [], this);
    }

    goIdle ()
    {
        this.previousAction = 1;

        this.play('snowmanIdle' + this.size, true);

        this.chooseEvent = this.time.delayedCall(Phaser.Math.Between(2000, 4000), this.chooseAction, [], this);
    }

    throw ()
    {
        this.previousAction = 2;

        this.isThrowing = true;

        this.play('snowmanThrowStart' + this.size);
    }

    releaseSnowball ()
    {
        if (!this.isAlive)
        {
            return;
        }

        this.play('snowmanThrowEnd' + this.size);

        this.currentTrack.throwEnemySnowball(this.x);
    }

    throwComplete ()
    {
        if (!this.isAlive)
        {
            return;
        }

        this.isThrowing = false;

        this.play('snowmanIdle' + this.size);

        this.chooseEvent = this.time.delayedCall(Phaser.Math.Between(2000, 4000), this.chooseAction, [], this);
    }

    hit ()
    {
        if (this.chooseEvent)
        {
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
                if (this.x < -100)
                {
                    this.x = -100;
                }
            }
        });

        // Llamar al método hitSnowman en la escena principal para incrementar el puntaje
        this.scene.hitSnowman(this.size);

        this.chooseEvent = this.time.delayedCall(Phaser.Math.Between(1000, 3000), this.chooseAction, [], this);
    }

    stop ()
    {
        if (this.chooseEvent)
        {
            this.chooseEvent.remove();
        }

        this.isAlive = false;

        this.play('snowmanIdle'+ this.size);

        this.setVelocityX(0);
    }

    preUpdate (time, delta)
    {
        super.preUpdate(time, delta);

        if (this.x >= 880)
        {
            this.stop();

            this.scene.gameOver();
        }
    }
}
