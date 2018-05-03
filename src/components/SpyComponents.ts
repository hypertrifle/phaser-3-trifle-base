import { Scene } from "phaser";

export class SpyMap {
   scene:Scene;


   constructor(owner:Scene, config:any){
      this.scene = owner;

      var map = this.scene.make.tilemap({ key: 'map' });

      // The first parameter is the name of the tileset in Tiled and the second parameter is the key
      // of the tileset image used when loading the file in preload.
      var tiles = map.addTilesetImage('tiles', 'tiles');
  
      // You can load a layer from the map using the layer name from Tiled, or by using the layer
      // index (0 in this case).
      var layer = map.createStaticLayer(0, tiles, 0, 0);

      layer.setScale(0.25,0.25);
      layer.setPosition(140,0);



   }
}

export class SpyGant {
   scene:Scene;

   constructor(owner:Scene, config:any){
      this.scene = owner;
   }
}


export interface SpyGameControllerSettings {
    members:number[],
    level:number
}

export class SpyGameplayController {
   scene:Scene;

   constructor(owner:Scene, config:SpyGameControllerSettings){
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