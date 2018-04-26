import Splene from "./Splene";
import { SpyGameplayController, SpyGant, SpyMap } from "../components/SpyComponents";
import { Button } from "../utils/UI";

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

      let test = new Button(this, {
         x:0,
         y:0,
         label: "\f01", 
         roundedCorners: { sw: true },
         width:300,
         height: 50,
         colour:"#ff00a",
         onClick:"buttonclick"
      });


      this._map = new SpyMap(this, {});
      this._gant = new SpyGant(this, {});
      this._playController = new SpyGameplayController(this, {
         members: [0, 1, 2, 3, 4],
         level: 0
      });

      this.events.emit("spy.recalculate");
      this.events.emit("spy.redraw");


   }

   update() {

   }

}
