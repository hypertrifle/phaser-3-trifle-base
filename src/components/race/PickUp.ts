import DriveScene from "../../scenes/Drive";

 interface PickUpConfig extends GameObjectConfig {
   frame: string;
   lane: number;
   totalBands: number;
   owner: DriveScene;
   roadPosition: number;

}

export default class PickUp extends Phaser.GameObjects.Image {

   offset: Phaser.Geom.Point;
   isLeft: boolean;
   frameName: string;
   totalBands: number;
   owner: DriveScene;
   roadPosition: number;


   constructor(scene: Phaser.Scene,config: PickUpConfig) {
     super(scene,0,-1000,"atlas.png","test-sprite.png");

   //   Object.assign(this,config);

      console.log("added pickup");
      this.owner = config.owner;

      this.x = this.owner.dimensions.x/2;
      this.y = this.owner.dimensions.y/2;
 

     this.totalBands = config.totalBands;

     this.roadPosition = config.roadPosition;
     this.frameName = config.frame;

     scene.add.existing(this);

   //   this.active = false;
   //   this.visible = false;

   }


 }