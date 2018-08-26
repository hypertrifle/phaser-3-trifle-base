/**
 * @author       Hypertrifle <ricardo.searle@gmail.com>
 * @copyright    2018 Hypertrifle
 * @description  Phaser3 Boilerplate
 * @license      Hypertrifle
 */

import "phaser";
import Boot from "./scenes/Boot";
var game: Phaser.Game;

// main game configuration // I would hope that this would rarely change.


const config: GameConfig = {
  title: "", //apart from this
  version: "1.0",
  width: 800,
  height: 600,
  zoom: 1,
  type: Phaser.WEBGL, 
  parent: "content", //this div to be loaded into
  scene: Boot, //list all states required here, unfortunatly we need to load any that may be required here.
  

  //these are some custom callbacks that you can define for phaser, we will use this to initilised run functionallity from out plugins.
  callbacks: {
    postBoot: () => {
      //any functions to call post boot?.
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