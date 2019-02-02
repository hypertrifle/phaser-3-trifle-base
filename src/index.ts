/**
 * @author       Hypertrifle <ricardo.searle@gmail.com>
 * @copyright    2019 Hypertrifle
 * @description  Phaser3 Boilerplate
 * @license      UNLICENCED
 */

import "phaser";
import Boot from "./scenes/Boot";
import PostEffectTestsScene from "./scenes/PostEffectTests";
import TitleScreen from "./scenes/TitleScene";
import PersistentScene from "./scenes/PersistentScene";
import Tools from "./plugins/global/Tools";



export const DEBUG = true;

// when the page is loaded, create our game instance (entry point, this is what will change per tech)
window.onload = () => {

  // some development options, this console.clear resets a developer console on webpack refresh which I find handy.
console.clear();
const DEBUG: boolean = true;

// @ts-ignore
const config: GameConfig = {
  title: "Game", // apart from this
  version: "1.0",
    width: 10,
    height: 10,
  resolution: 1,  // this this works with sprites and omage but not with bitmap font
  fps: {
    min: 30,
    target: 60
  },

  render: {
    antialias: true,

  },
  type: Phaser.WEBGL,
  parent: "container", // this div to be loaded into - LEAVE AS IS!
  scene: [Boot, PostEffectTestsScene, PersistentScene], // we are going to use boot as our main controller, then an other states ew require after that.
  plugins: {
    global: [
        { key: 'tools', plugin: Tools, start: true}
    ]
},
  // these are some custom callbacks that you can define for phaser, we will use this to initilised run functionallity from out plugins.
  callbacks: {
    postBoot: () => {
      // console.warn('post callback', this);
    }
  },
  input: {
    keyboard: true,
    mouse: true,
    touch: {
      target: document.getElementById("container"), // this allows us to capture all input regardless if on page or the game canvas.
      capture: true
    }
  },
  backgroundColor: 0x111111,

};
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
