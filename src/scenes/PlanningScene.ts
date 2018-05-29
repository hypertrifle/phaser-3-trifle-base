import Splene from "./Splene";
import { SpyGameplayController, SpyGant, SpyMap } from "../components/SpyComponents";
import { Button, CanvasTools } from "../utils/UI";
import { UISettings } from "../models/Global";

export default class Controller extends Splene {

   private _map: SpyMap;
   private _gant: SpyGant;
   private _playController: SpyGameplayController;


   constructor(config: any) {
      super(config);


   }

   preload() {

    //we can populate our models here, our data controller shold have loaded our data in by now.
      this.load.image('tiles', 'assets/img/tiles.png');
      this.load.tilemapTiledJSON('map', 'assets/json/map.json');

   }



   create() {
      console.log("Planning Scene:: Create");

      

      this._map = new SpyMap(this, {x: 10, y:10, height:600-15, width:790});
      this._gant = new SpyGant(this, {x: 10, y:400+5, height:200-15, width:780});


      //some test data
      this._gant.model.members.push(this._data.members[1]);
      this._gant.model.members.push(this._data.members[12]);
      this._gant.model.members.push(this._data.members[8]);


      // this._gant.model.members.push(this._data.members[0]);
     

    //   this._playController = new SpyGameplayController(this, {
    //      members: [0, 1, 2, 3, 4],
    //      level: 0
    //   });

      this.events.emit("spy.recalculate", {test:true});
      this.events.emit("spy.redraw");

      console.log("test", UISettings.radius);
   }



   update() {

     this.events.emit("spy.update");
   }

   shutdown(){
     
   }

}
