import BaseEffect from "./BaseEffect";
// @ts-ignore
const SOURCE = require('../../../assets/glsl/text.glsl');
// @ts-ignore
const SOURCE_VERTEX = require('../../../assets/glsl/text_vert.glsl');
// @ts-ignore
const glsl = require('glslify');

  // @ts-ignore
  // import SHENE from 'raw-loader!glslify-loader!../../assets/glsl/shene.glsl';
  // const glsl = require('glslify');

export default class RetroTextEffect extends BaseEffect {

    private _speed: number = 1;


    set speed(i: number) {
      this._speed = i;
      this.setFloat1("speed", this._speed);
    }

    get speed(): number {
      return this._speed;
    }

  

     constructor(game: Phaser.Game,id: string, config?: {size: number,speed: number,delay: number}) {
      super(game, id, glsl(SOURCE),undefined, glsl(SOURCE_VERTEX) );
         // init uniforms
         this.speed = (config) ? config.speed : 1;
        //  this.renderer.resize(847/2,1279/2)
        console.log("render", this.renderer.height, this.renderer.width);
     }


  }
