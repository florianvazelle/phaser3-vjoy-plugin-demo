import 'phaser';
import VJoyPlugin from 'phaser3-vjoy-plugin';
import * as dat from 'dat.gui';

const gamePlayState = new Phaser.Class({
    Extends: Phaser.Scene,

    initialize: function GamePlay() {
        Phaser.Scene.call(this, {
            key: 'GamePlay'
        });
    },

    preload: function() {
        this.load.image('player', 'assets/player.png');

        this.load.image('vjoy_base', 'assets/base.png');
        this.load.image('vjoy_body', 'assets/body.png');
        this.load.image('vjoy_cap', 'assets/cap.png');

        this.plugins.installScenePlugin('VJoyPlugin', VJoyPlugin, 'vjoy', this);

        // and from within the scene :
        this.sys.VJoyPlugin; // key value
        this.vjoy; // mapping value
    },

    create: function() {
        this.sprite = this.physics.add.sprite(300, 300, 'player').setVelocity(0);

        this.joystick = this.add.joystick({
            sprites: {
                base: 'vjoy_base',
                body: 'vjoy_body',
                cap: 'vjoy_cap'
            },
            singleDirection: false,
            maxDistanceInPixels: 200,
            device: 0 // 0 for mouse pointer (computer), 1 for touch pointer (mobile)
        });

        this.input.on('pointerdown', this.joystick.create, this.joystick);
        this.input.on('pointerup', this.joystick.remove, this.joystick);

        const gui = new dat.GUI();
        gui.add(this.joystick.settings, 'singleDirection');
        gui.add(this.joystick.settings, 'maxDistanceInPixels');
        gui.add(this.joystick.settings, 'device', { Computer: 0, Mobile: 1 });
    },

    update: function() {
        const cursors = this.joystick.getCursors();
        const speed = 0.2;

        this.sprite.body.velocity.set(cursors.deltaX * speed, cursors.deltaY * speed);
    },
});

// Create game config
const config = {
    type: Phaser.AUTO,
    width: 640,
    height: 480,
    physics: {
        default: 'arcade',
        arcade: { debug: false }
    },
    scene: [gamePlayState]
};

// Instantiate the game with the config
new Phaser.Game(config);
