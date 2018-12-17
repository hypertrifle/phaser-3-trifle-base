import DriveScene from "../../scenes/Drive";
import Drive2Scene from "../../scenes/Drive2";

 interface PickUpConfig extends GameObjectConfig {

}

export default class PickUp extends Phaser.GameObjects.Sprite {

   offset: Phaser.Geom.Point;
   isLeft: boolean;
   frameName: string;
   totalBands: number;
   owner: Drive2Scene;
   roadPosition: number;

   animation:any;
   hasBeenUsed:boolean = false;

   constructor(scene: Phaser.Scene,config: PickUpConfig) {



     super(scene,0,-1000,"pickup");

   //   Object.assign(this,config);

      console.log("added pickup");

      this.owner = scene as Drive2Scene;

      this.x = this.owner.dimensions.x/2;
      this.y = this.owner.dimensions.y/2;
 

   //   this.anims.
   //TODO: add animation
   




     scene.add.existing(this);

    //  this.active = false;
    //  this.visible = false;

    this.play("pickup-animation");



   }

  


 }