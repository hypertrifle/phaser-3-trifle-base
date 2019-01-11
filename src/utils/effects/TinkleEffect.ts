import BaseEffect from "./BaseEffect";
//@ts-ignore
const SOURCE = require('../../../assets/glsl/shene.glsl');

  //@ts-ignore
  // import SHENE from 'raw-loader!glslify-loader!../../assets/glsl/shene.glsl';  
  // const glsl = require('glslify');
  
export default class TwinkleEffect extends BaseEffect {
    
    private _speed:number = 1;
    private _size:number = 0.02;
    private _delay:number = 2;
  
   
    set speed(i:number){
      this._speed = i;
      this.setFloat1("speed", this._speed);
    }

    get speed():number{
      return this._speed;
    }
  
    set size(i:number){
      this._size = i;
      this.setFloat1("size", this._size);
    }

    get size():number{
      return this._size;
    }
  
    set delay(i:number){
      this._delay = i;
      this.setFloat1("delay", this._delay);
    }

    get delay():number{
      return this._delay;
    }
  
  
     constructor(game: Phaser.Game,id:string, config?:{size:number,speed:number,delay:number}) {
  
  
         super(game, id, SOURCE );

         //init uniforms
         this.size = (config)? config.size :0.02;
         this.speed = (config)? config.speed :1;
         this.delay = (config)? config.delay :2;
  
     }
  
  }
  