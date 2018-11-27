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
     super(scene,0,-1000,"atlas.png",config.frame);

   //   Object.assign(this,config);

     this.totalBands = config.totalBands;
     this.owner = config.owner;
     this.roadPosition = config.roadPosition;
     this.frameName = config.frame;

     scene.add.existing(this);

     this.active = false;
     this.visible = false;

   }


 }