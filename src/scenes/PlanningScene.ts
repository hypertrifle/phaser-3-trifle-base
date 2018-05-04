import Splene from "./Splene";
import { SpyGameplayController, SpyGant, SpyMap } from "../components/SpyComponents";
import { Button } from "../utils/UI";
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

      let test = new Button(this, {
         x:150,
         y:100,
         label: "\uf028", 
         font: {
          fontFamily: "Font Awesome 5 Free"
         },

         roundedCorners: { sw: true },
         width:200,
         height: 100,
         color:[0xFF0000, 0xee0000, 0xaa0000],
         onClick:"ui.buttons.action",
         radius:10,
        //  shadow: {
        //      x:5,
        //      y:10,
        //      color:0x000000,
        //      opacity:0.4
        //  }
      });


      // this._map = new SpyMap(this, {});
    //   this._gant = new SpyGant(this, {});
    //   this._playController = new SpyGameplayController(this, {
    //      members: [0, 1, 2, 3, 4],
    //      level: 0
    //   });

      this.events.emit("spy.recalculate", {test:true});
      this.events.emit("spy.redraw");

      console.log("test", UISettings.radius);
   }



   update() {

   }

}
