
export interface CarConfig extends SpriteConfig {
   positionFromBottom:number;
}


export default class Car extends Phaser.GameObjects.Sprite {


   constructor(scene:Phaser.Scene, config:CarConfig){
      super(scene, 0,0, "car");
   }

}