import Drive2Scene from "../../scenes/Drive2";

 interface ObstacleConfig extends GameObjectConfig {
   frame: string;
   lane: number;
   totalBands: number;
   owner: Drive2Scene;
   roadPosition: number;

}

export default class Obstacle extends Phaser.GameObjects.Image {

   offset: Phaser.Geom.Point;
   isLeft: boolean;
   frameName: string;
   totalBands: number;
   owner: Drive2Scene;
   roadPosition: number;


   constructor(scene: Phaser.Scene,config: ObstacleConfig) {
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

     this.active = false;
     this.visible = false;




   }

  


 }