/**
 * @author       Hypertrifle <ricardo.searle@gmail.com>
 * @copyright    2019 Hypertrifle
 * @description  Phaser3 Boilerplate
 * @license      UNLICENCED
 */

//@ts-ignore
const SpineWebGLPlugin = require("./plugins/external/SpineWebGLPlugin.js");

import "phaser";
import Boot from "./scenes/Boot";
import TitleScreen from "./scenes/TitleScene";

// import PostEffectTestsScene from "./scenes/PostEffectTests";
// import PersistentScene from "./scenes/PersistentScene";
// import HyperTrifleHomeScene from "./scenes/HyperTrifleHomeScene";

import Tools from "./plugins/global/HyperToolsPlugin";
import PingScene from "./scenes/PingScene";


export const DEBUG = false;

// when the page is loaded, create our game instance (entry point, this is what will change per tech)
window.onload = () => {

  // some development options, this console.clear resets a developer console on webpack refresh which I find handy.
console.clear();
const DEBUG: boolean = true;


const config: Phaser.Types.Core.GameConfig = {
  title: "Game", // apart from this
  version: "1.0",
  scale: {
    mode: Phaser.Scale.FIT,
    parent: 'container',
    width: 1280,
    height: 720
},
// resolution: 1/window.devicePixelRatio,
fps: {
    min: 30,
    target: 60
  },

  render: {
    antialias: false,
    roundPixels: true

  },

  type: Phaser.WEBGL,
  width: window.innerWidth,
  height: window.innerHeight,
  scene: [new Boot, new PingScene], // we are going to use boot as our main controller, then an other states ew require after that.
  plugins: {
    global: [
        { key: 'tools', plugin: Tools, start: true},
    ],
    scene: [
      {
        key: 'SpineWebGLPlugin',
        plugin: SpineWebGLPlugin,
        start: true,
        sceneKey: 'spine'
      }
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
      capture: true
    },
    gamepad:true
  },
  physics: {
    default : "arcade",
    arcade : {
      debug:true,
      gravity: {
        y:8000,
      }
  
    }
  },
  backgroundColor: 0xb21313,

};
  // before we load the game into the page we are going to setup some items
  // that we are going to need to intergrate a Phaser3 game into various HTML based tech.
  // depending on the tech, we may wish to have these DOM elements in different locations or orders.
  // I'm hoping this is the section we can re-write to embed games into different techs.


  let container = document.getElementById("container");
  // container.style.transform = "scale("+(1/window.devicePixelRatio)+")";
  container.style.zoom = "" + (1 / window.devicePixelRatio); // holy dpi batman



  if (DEBUG)
  console.log("final game config",config);



  new Phaser.Game(config); // finally launch our game.
};
