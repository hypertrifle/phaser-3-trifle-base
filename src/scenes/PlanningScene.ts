import Splene from "./Splene";
import { SpyGameplayController, SpyGant, SpyMap } from "../components/SpyComponents";

export default class Controller extends Splene {

   private _map:SpyMap;
   private _gant:SpyGant;
   private _playController:SpyGameplayController;


   constructor(config:any){
      super(config);


   }

   preload(){

      //we can populate our models here, our data controller shold have loaded our data in by now.


      
   }

   create(){
      console.log("Planning Scene:: Create");



      this._map = new SpyMap(this,{});
      this._gant = new SpyGant(this,{});
      this._playController = new SpyGameplayController(this,{});

      this.events.emit("spy.recalculate");
      this.events.emit("spy.redraw");


   }

   update(){

   }

}
