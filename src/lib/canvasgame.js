/**
 * @type {PIXI}
 */
window.PIXI = require('phaser/build/custom/pixi');
/**
 * @type {World}
 */
window.p2 = require('phaser/build/custom/p2');
/**
 * @type {Phaser}
 */
window.Phaser = require('phaser/build/custom/phaser-split');

const Shake = require('shake.js');

module.exports = class CanvasGame {

    constructor(id) {
        this.height = window.innerHeight;
        this.width = window.innerWidth;
        this.game = new Phaser.Game(this.width, this.height, Phaser.AUTO, id, {
            preload: this._preload.bind(this),
            create: this._create.bind(this),
            update: this._update.bind(this)
        });
        this.user = null;
        this.shaking = 0;
        this.shakeEvent = new Shake({
            threshold: 15, // optional shake strength threshold
            timeout: 100
        });
        this.cheers = [
            "ZEIG ES IHNEN",
            "WEITER SO",
            "LOS GEHTS",
            "SCHNELLER",
            "BOOOOOO"
        ];
    }

    setUser(user) {
        this.user = user;
    }

    _preload() {
        this.game.load.image('background', 'img/background.jpg');
        this.game.load.spritesheet('animation', 'img/animation.png', 640, 506, 4);
        this.game.load.bitmapFont('font1', 'font/LiquorstoreJazz.png', 'font/LiquorstoreJazz.fnt');

        this.game.load.audio('level_1', 'sound/Boo.mp3');
        this.game.load.audio('level_2', 'sound/kuhglocke.mp3');
        this.game.load.audio('level_3', 'sound/Rassel.mp3');
        this.game.load.audio('level_4', 'sound/schellen.mp3');
        this.game.load.audio('level_5', 'sound/Trillerpfeife.mp3');

        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    }

    setScale(img) {
        let factorWidth = this.width / img.width;

        img.scale.setTo(factorWidth, factorWidth);
    }

    _showRandomText() {
        let text = this.cheers[Math.floor(Math.random() * this.cheers.length)];
        this._showText(text);
    }

    getRandom(start, end) {
        return Math.floor(Math.random() * end) + start;
    }

    _showText(text) {
        if (this.currText) {
            return;
        }

        this.currText = this.game.add.bitmapText(0, 0, "font1", text, 60);
        this.currText.align = 'center';
        this.currText.x = this.game.width / 2 - this.currText.textWidth / 2;
        this.currText.y = this.getRandom(0, 200);
        this.currText.angle = this.getRandom(0, 45);

        setTimeout(() => {
            this.game.add.tween(this.currText).to({alpha: 0}, 2000, Phaser.Easing.Linear.None, true).onComplete.add(() => {
                this.currText = null;
            });
        }, 500);
    }

    _create() {
        this.background = this.game.add.sprite(0, 0, 'background');
        this.animation = this.game.add.sprite((this.width / 100) * 0, (this.height / 100) * 46, 'animation');

        this.introText = this.game.add.bitmapText(0, 0, "font1", "SHAKE\nIT\nHARD", 124);
        this.introText.align = 'center';
        this.introText.x = this.game.width / 2 - this.introText.textWidth / 2;

        this.sounds = {
            "level_1": this.game.add.audio('level_1'),
            "level_2": this.game.add.audio('level_2'),
            "level_3": this.game.add.audio('level_3'),
            "level_4": this.game.add.audio('level_4'),
            "level_5": this.game.add.audio('level_5')
        };

        //this.animation.alpha = 0.3;
        //this.shaking = 20;
        //this.onShake();

        this.setScale(this.animation);
        this.setScale(this.background);

        this.animation.animations.add('shake');


        this.shakeEvent.start();
        window.addEventListener('shake', () => {
            this.onShake();
        }, false);
    }

    onShake() {
        if (this.introText.alpha === 1) {
            this.game.add.tween(this.introText).to({alpha: 0}, 1500, Phaser.Easing.Linear.None, true);
        }
        this.onShakePlus();

        if (this.shakingTimeout) {
            clearInterval(this.shakingTimeout);
        }

        this.shakingTimeout = setInterval(() => {
            this.onShakeMinus();
        }, 200);
    }

    onShakeMinus() {
        this.shaking--;
        this.shakeUpdate();
    }

    onShakePlus() {
        this.shaking++;
        this.shakeUpdate();
    }

    shakeUpdate() {
        if (this.shaking > 25) {
            this.shaking = 25;
        } else if (this.shaking < 0) {
            this.shaking = 0;
            if (this.shakingTimeout) {
                clearInterval(this.shakingTimeout);
            }
        }

        if (this.shaking % 5 === 0) {
            this._showRandomText();
        }

        if (this.shaking === 20) {
            this.sounds.level_5.loopFull(0.3);
            this.animation.animations.stop('shake');
            this.animation.animations.play('shake', 30, true);
        } else if (this.shaking === 15) {
            this.sounds.level_4.loopFull();
            this.animation.animations.stop('shake');
            this.animation.animations.play('shake', 15, true);
        } else if (this.shaking === 10) {
            this.sounds.level_3.loopFull();
            this.animation.animations.stop('shake');
            this.animation.animations.play('shake', 13, true);
        } else if (this.shaking === 5) {
            this.sounds.level_2.loopFull();
            this.animation.animations.stop('shake');
            this.animation.animations.play('shake', 7, true);
        } else if (this.shaking === 1) {
            this.sounds.level_1.loopFull();
            this.animation.animations.play('shake', 3, true);
        } else if (this.shaking === 0) {
            this.animation.animations.stop('shake');
            this.sounds.level_1.fadeOut(4000);
            this.sounds.level_2.fadeOut(3000);
            this.sounds.level_3.fadeOut(2000);
            this.sounds.level_4.fadeOut(1000);
            this.sounds.level_5.fadeOut(500);
        }
    }

    _update() {

    }
}