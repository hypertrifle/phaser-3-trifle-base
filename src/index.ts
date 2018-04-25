/**
 * @author       Hypertrifle <ricardo.searle@gmail.com>
 * @copyright    2018 Hypertrifle
 * @description  Phaser3 Boilerplate
 * @license      Hypertrifle
 */

import "phaser";
import Boot from "./scenes/Boot";

// main game configuration
const config: GameConfig = {
  title: "Game",
  url: "https://github.com/hypertrifle/phaser3-template.git",
  version: "1.0",
  width: 800,
  height: 600,
  zoom: 1,
  type: Phaser.WEBGL,
  parent: "game",
  scene: [Boot],
  input: {
    keyboard: true,
    mouse: true,
    touch: false,
    gamepad: false
  },
  backgroundColor: "#aaaaaa",
  pixelArt: false,
  antialias: true
};

// when the page is loaded, create our game instance
window.onload = () => {
  
  var game = new Phaser.Game(config);
};