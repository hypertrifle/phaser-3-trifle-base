import DriveScene from "../../scenes/Drive";

 interface SceneryConfig extends GameObjectConfig {
   frame: string;
   offset: Phaser.Geom.Point;
   isLeft?: boolean;
   totalBands: number;
   owner: DriveScene;
}

export default class Scenery extends Phaser.GameObjects.Image {

   offset: Phaser.Geom.Point;
   isLeft: boolean;
   frameName: string;
   totalBands: number;
   owner: DriveScene;


   constructor(scene: Phaser.Scene,config: SceneryConfig) {
     super(scene,500,20,"atlas.png", config.frame);

     this.totalBands = config.totalBands;

     this.owner = config.owner;

     this.isLeft = config.isLeft || false;
     if (this.isLeft) {
       this.setOrigin(0,0);
     }
     if (!this.isLeft) {
       this.setOrigin(1,0);
     }


     // now what

     this.offset = config.offset;
     this.frameName = config.frame;

     scene.add.existing(this);

   }



   moveAndReset(distanceToMove: number) {
     this.y += distanceToMove;
     if (this.y - this.height > this.owner.dimensions.y) {
      this.y -= (this.owner.dimensions.y - this.owner.viewPort.horizonHeight + this.height);
     }
   }

 }