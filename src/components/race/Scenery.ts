import DriveScene from "../../scenes/Drive";

 interface SceneryConfig extends GameObjectConfig {
   frame: string;
   offset: Phaser.Geom.Point;
   isLeft?: boolean;
   totalBands: number;
   owner:DriveScene;
}

export default class Scenery extends Phaser.GameObjects.Image {

   offset: Phaser.Geom.Point;
   isLeft: boolean;
   frameName: string;
   totalBands: number;
   owner:DriveScene;


   constructor(scene: Phaser.Scene,config: SceneryConfig) {
     super(scene,500,20,config.frame);
 
     this.totalBands = config.totalBands;

     this.owner = config.owner;
 
     this.isLeft = config.isLeft || false;
     if (this.isLeft) {
       this.setOrigin(0,0.5);
     }
     if (!this.isLeft) {
       this.setOrigin(1,0.5);
     }
 
 
     // now what
 
     this.offset = config.offset;
     this.frameName = config.frame;
 
     scene.add.existing(this);
 
   }
  
   setWordX(){
 
   }
  
 
   positionScale(j: number, total: number): number {
     return 0;
   }
 
   updatePosition(time: number, delta: number) {
 
     // this.alpha = Math.max(0, (this.y/20),Math.min(1));
 
     this.flipX = (this.frameName === "palm") && !this.isLeft;
     this.flipY = true;
 
     let center = (this.isLeft) ? 320 : 320;
 
     let j = this.y - 360;
 
     // let roadScale:number = 0.5 * (this.totalBands/(j*2));
     let roadScale: number = 1 - ( (j / (this.totalBands * 1.05 )) * -1 );
 
         // console.log(roadScale);
         this.setScale(roadScale * 2, -roadScale * 4);
         if (this.isLeft) {
           this.x = 300 - (roadScale * 1000) - this.offset.x;
 
         } else {
           this.x = 320 + (roadScale * 1000) + this.offset.x;
 
         }
 
 
         //  if(this.isLeft){
         //   this.x = 320 + (roadScale*500 - this.offset.x);
         //  }else{
           // this.x = 320 + (roadScale*500 + this.offset.x);
       //  }
       //   }
   }
 }