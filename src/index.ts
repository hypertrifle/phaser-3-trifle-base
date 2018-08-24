/**
 * @author       Hypertrifle <ricardo.searle@gmail.com>
 * @copyright    2018 Hypertrifle
 * @description  Phaser3 Boilerplate
 * @license      Hypertrifle
 */

import "phaser";
import Boot from "./scenes/Boot";
import GlobalGameData from "./plugins/GlobalGameData";
import TitleScreen from "./scenes/TitleScreen";

var game: Phaser.Game;

// main game configuration // I would hope that this would rarely change.

const config: any = {
  title: "Game", //apart from this
  version: "1.0",
  width: 800,
  height: 600,
  zoom: 1,
  type: Phaser.AUTO, 
  parent: "content", //this div to be loaded into
  scene: [Boot], //list all states required here, unfortunatly we need to load any that may be required here.
  plugins: {
    global: [
      { key: "_data", plugin: GlobalGameData, start:true, mapping:"_data"}
    ]
  },


  //these are some custom callbacks that you can define for phaser, we will use this to initilised run functionallity from out plugins.
  callbacks: {
    postBoot: () => {
      //enable our scale manager.

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