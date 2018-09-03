/**
 * @author       Hypertrifle <ricardo.searle@gmail.com>
 * @copyright    2018 Hypertrifle
 * @description  Phaser3 Boilerplate
 * @license      Hypertrifle
 */

import 'phaser';
import Boot from './scenes/Boot';

console.clear();

// main game configuration, maybe these should be moved to one of the callbacks.


// what the designer artboard was sized to
const designDimensions = {
  width: 960,
  height: 540
};

// what size we want to render the game at (note that we can still zoom the canvas),
// but this is the dimensions that the textures are rendererd at.
const renderDimensions = {
  width: 1280,
  height: 800
};

// work out some ratio stuff.
let ratio_w = renderDimensions.width / designDimensions.width;
let ratio_h = renderDimensions.height / designDimensions.height;

// TODO: we should workout

if (ratio_w !== ratio_h) {
  console.warn('Design and render dimension have mismatching ratio, prioritising width ratio');
}

let ratio = ratio_w;

const config: GameConfig = {
  title: 'Game', // apart from this
  version: '1.0',
  width: designDimensions.width,
  height: designDimensions.height,
  zoom: ratio,
  resolution: ratio,
  type: Phaser.WEBGL,
  parent: 'phaser-content', // this div to be loaded into
  scene: Boot, // we are going to use boot as our main controller, we can add / control scenes from within there.
  // these are some custom callbacks that you can define for phaser, we will use this to initilised run functionallity from out plugins.
  callbacks: {
    postBoot: () => {
      console.warn('post callback', this);
    },

  },
  // input: {
  //   keyboard: true,
  //   mouse: true,
  //   touch: false,
  //   gamepad: false
  // },
  backgroundColor: '#aaaaaa',
  // pixelArt: false,
  // antialias: true
};

// when the page is loaded, create our game instance (entry point, this is what will change per tech)
window.onload = () => {

  // before we load the game into the page we are going to setup some items
  // that we are going to need to intergrate a Phaser3 game into various HTML based tech.
  // depending on the tech, we may wish to have these DOM elements in different locations or orders.
  // I'm hoping this is the section we can re-write to embed games into different techs.

  let containingDivID: string = 'somthingUnique';
  let domContainer: Element = document.getElementById(containingDivID); // the #ID of the container we wish to put the game into.

  // create our content container.
  let c: Element = document.createElement('div');
  c.setAttribute('id', 'phaser-content'); // IF THESE CHANGE THIS WILL EFFECT THE SCALE MANAGER

  // create our overlay container.
  let o: Element = document.createElement('div');
  o.setAttribute('id', 'phaser-overlay'); // IF THESE CHANGE THIS WILL EFFECT THE SCALE MANAGER

  // append both to the domContainer that was defined above
  domContainer.appendChild(c);
  domContainer.appendChild(o);

  // boot the game.
  let game: Phaser.Game = new Phaser.Game(config); // finally launch our game.
};