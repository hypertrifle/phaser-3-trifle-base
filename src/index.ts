/**
 * @author       Hypertrifle <ricardo.searle@gmail.com>
 * @copyright    2018 Hypertrifle
 * @description  Phaser3 Boilerplate
 * @license      Hypertrifle
 */

import "phaser";
import Boot from "./scenes/Boot";
import ScaleManager from './Plugins/ScaleManager';

var game: Phaser.Game;
// main game configuration
const config: GameConfig = {
  title: "Game",
  url: "https://github.com/hypertrifle/phaser3-template.git",
  version: "1.0",
  width: 800,
  height: 600,
  zoom: 1,
  type: Phaser.WEBGL,
  parent: "content",
  scene: [Boot],
  callbacks: {
    postBoot: () => {
      console.log(this.game.canvas);
      new ScaleManager(this.game.canvas, (!this.game.device.os.windows && !this.game.device.os.linux && !this.game.device.os.macOs), true);
    }
  },
  // input: {
  //   keyboard: true,
  //   mouse: true,
  //   touch: false,
  //   gamepad: false
  // },
  backgroundColor: "#aaaaaa",
  // pixelArt: false,
  // antialias: true
};

// when the page is loaded, create our game instance
window.onload = () => {
  this.game = new Phaser.Game(config);
};