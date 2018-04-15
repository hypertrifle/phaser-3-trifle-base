import 'phaser';
import Controller from './scenes/Controller.js'

var config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    parent: 'game-container',
    scene: [ Controller ]
};

var game = new Phaser.Game(config);
