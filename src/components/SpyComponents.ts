import { Scene } from "phaser";

export class SpyMap {
   scene:Scene;

   constructor(owner:Scene, config:any){
      this.scene = owner;
   }
}

export class SpyGant {
   scene:Scene;

   constructor(owner:Scene, config:any){
      this.scene = owner;
   }
}

export class SpyGameplayController {
   scene:Scene;

   constructor(owner:Scene, config:any){
      this.scene = owner;

      this.resgisterEvents();
   }


   resgisterEvents(){
      this.scene.events.on("spy.recalculate", this.recalculate, this);
   }

   recalculate(e:any){
      console.log(e);
   }
}