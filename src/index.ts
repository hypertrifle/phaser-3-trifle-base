/**
 * @author       Hypertrifle <ricardo.searle@gmail.com>
 * @copyright    2018 Hypertrifle
 * @description  Phaser3 Boilerplate
 * @license      Hypertrifle
 */

import "phaser";
import Boot from "./scenes/Boot";

console.clear();

var game: Phaser.Game;

// main game configuration, maybe these should be moved to one of the callbacks.


// what the designer artboard was sized to
const designDimensions = {
  width:960,
  height:540
}

// what size we want to render the game at (note that we can still zoom the canvas), 
// but this is the dimensions that the textures are rendererd at.
const renderDimensions = {
  width: 1280,
  height: 800
}

// work out some ratio stuff.
let ratio_w = renderDimensions.width / designDimensions.width;
let ratio_h = renderDimensions.height / designDimensions.height;

// TODO: we should workout 

if(ratio_w != ratio_h){
  console.warn("Design and render dimension have mismatching ratio, prioritising width ratio");
}


let ratio = ratio_w;


const config: GameConfig = {
  title: "", //apart from this
  version: "1.0",
  width:designDimensions.width,
  height: designDimensions.height,
  zoom:ratio,
  resolution: ratio,
  type: Phaser.WEBGL, 
  parent: "content", //this div to be loaded into
  scene: Boot, //we are going to use boot as our main controller, we can add / control scenes from within there.
  //these are some custom callbacks that you can define for phaser, we will use this to initilised run functionallity from out plugins.
  callbacks: {
    postBoot: () => {
      //any functions to call post this is after out 'Boot'

      console.warn("post callback", this);


    },

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

  
  this.game = new Phaser.Game(config); //finally launch our game.
};