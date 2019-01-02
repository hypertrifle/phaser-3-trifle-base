/**
 * @author       Hypertrifle <ricardo.searle@gmail.com>
 * @copyright    2018 Hypertrifle
 * @description  Phaser3 Boilerplate
 * @license      UNLICENCED
 */

import "phaser";
import Boot from "./scenes/Boot";

// some development options, this console.clear resets a developer console on webpack refresh which I find handy.
console.clear();
const DEBUG: boolean = true;

// @ts-ignore
const config: GameConfig = {
  title: "Game", // apart from this
  version: "1.0",
// @ts-ignore
    width: 800,
    height: 600,
  zoom: 1,
  render: {
    pixelArt: true,
    antialias: false,

  },
  type: Phaser.WEBGL,
  parent: "container", // this div to be loaded into - LEAVE AS IS!
  scene: Boot, // we are going to use boot as our main controller, we can add / control scenes from within there.
  // these are some custom callbacks that you can define for phaser, we will use this to initilised run functionallity from out plugins.
  callbacks: {
    postBoot: () => {
      // console.warn('post callback', this);
    }
  },
  // input: {
  //   keyboard: true,
  //   mouse: true,
  //   touch: false,
  //   gamepad: false
  // },
  backgroundColor: 0x450710,

};

// when the page is loaded, create our game instance (entry point, this is what will change per tech)
window.onload = () => {
  // before we load the game into the page we are going to setup some items
  // that we are going to need to intergrate a Phaser3 game into various HTML based tech.
  // depending on the tech, we may wish to have these DOM elements in different locations or orders.
  // I'm hoping this is the section we can re-write to embed games into different techs.


  let container = document.getElementById("container");

  /// this works for now, fills our game to it's container, will work with scaling, centering and other optins within the scale amanager
  config.width = container.clientWidth;
  config.height = container.clientHeight;

  if (DEBUG)
  console.log("final game config",config);

  let game = new Phaser.Game(config); // finally launch our game.
};
