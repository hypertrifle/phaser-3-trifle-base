import BaseEffect from "./BaseEffect";
// @ts-ignore
const SOURCE = require('../../../../assets/glsl/shene.glsl');
// @ts-ignore
const glsl = require('glslify');

export interface Vec3 {
   r: number;g: number;b: number;
}

export default class SheneEffect extends BaseEffect {

    private _speed: number = 1;
    private _size: number = 0.02;
    private _delay: number = 2;
    private _colour: Vec3;


    set colour(i: Vec3) {


      this._colour = i;
      this.setFloat3("colour", this._colour.r / 256,this._colour.g / 256,this._colour.b / 256);
    }

    get colour(): Vec3 {

      let c = {
        r: this._colour.r * 256,
        g: this._colour.g * 256,
        b: this._colour.b * 256,
      };
      return this._colour;
    }

    set speed(i: number) {
      this._speed = i;
      this.setFloat1("speed", this._speed);
    }

    get speed(): number {
      return this._speed;
    }

    set size(i: number) {
      this._size = i;
      this.setFloat1("size", this._size);
    }

    get size(): number {
      return this._size;
    }

    set delay(i: number) {
      this._delay = i;
      this.setFloat1("delay", this._delay);
    }

    get delay(): number {
      return this._delay;
    }


     constructor(game: Phaser.Game,id: string, config?: {size: number,speed: number,delay: number, colour: Vec3}) {


       super(game, id, glsl(SOURCE) );
       // init uniforms
         this.size = (config) ? config.size : 0.02;
         this.speed = (config) ? config.speed : 1.5;
         this.delay = (config) ? config.delay : 2;
         this.colour = (config) ? config.colour : {r: 255,g: 255,b: 255};


     }

  }
