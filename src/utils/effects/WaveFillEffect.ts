import BaseEffect from "./BaseEffect";
// @ts-ignore
const SOURCE = require('../../../assets/glsl/waveFill.glsl');
// @ts-ignore
const glsl = require('glslify');

export interface Vec3 {
   r: number;g: number;b: number;
}
export interface Vec2 {
   x: number;y:number;
}

export default class WaveFillEffect extends BaseEffect {

    private _speed: number = 1;
    private _size: number = 0.02;
    private _colour: Vec3;


     _upperSplitPosition: Vec2;
     _lowerSplitPosition: Vec2;

    set upperSplitPosition(i: Vec2){
        this._upperSplitPosition = i;
      this.setFloat2("upperSplitPosition",this._upperSplitPosition.x,this._upperSplitPosition.y);

    }
    get upperSplitPosition():Vec2{
      console.log("get",this._upperSplitPosition);
      return this._upperSplitPosition;
    }

    set lowerSplitPosition(i: Vec2){
        this._lowerSplitPosition = i;
      this.setFloat2("lowerSplitPosition",this._lowerSplitPosition.x,this._lowerSplitPosition.y);

    }
    get lowerSplitPosition():Vec2{
      return this._lowerSplitPosition;
    }


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


     constructor(game: Phaser.Game,id: string, config?: {size: number,speed: number,delay: number, colour: Vec3}) {


       super(game, id, glsl(SOURCE) );
       // init uniforms
         this.size = (config) ? config.size : 0.02;
         this.speed = (config) ? config.speed : 1.5;
         this.colour = (config) ? config.colour : {r: 255,g: 255,b: 255};

         this.upperSplitPosition = {x:0.4, y:0.275 };
         this.lowerSplitPosition = {x:0.66, y:0.82 };


     }

  }
