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
        this.height = 800;
        this.width = 600;
        this.game = new Phaser.Game(this.height, this.width, Phaser.AUTO, id, {
            preload: this._preload.bind(this),
            create: this._create.bind(this),
            update: this._update.bind(this)
        });
        this.user = null;
        this.shakeEvent = new Shake({
            threshold: 15, // optional shake strength threshold
            timeout: 1000
        });
    }

    setUser(user) {
        this.user = user;
    }

    _preload() {
        this.game.load.image('background', 'img/background.png');
        this.game.load.spritesheet('animation', 'img/animation.png', 1651, 1307, 4);
    }

    _create() {
        this.animation = this.game.add.sprite(0, 0, 'animation');
        this.animation.width = this.width;
        this.animation.height = this.height;
        this.animation.animations.add('shake');

        this.shakeEvent.start();
        window.addEventListener('shake', () => {
            this.onShake();
        }, false);
    }

    onShake() {
        console.log("SHAKE");
        console.log(arguments);
        this.animation.animations.play('shake', 3, true);
    }

    _update() {

    }
}