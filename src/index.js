import 'phaser';

var TemplateScene = require("./scenes/TemplateScene");
var Controller = require("./scenes/Controller");

var config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    parent: 'game-container',
    scene: [ Controller ]
};

var game = new Phaser.Game(config);
