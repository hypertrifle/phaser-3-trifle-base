import {SaveModel} from '../models/Global';

export default class DataController {

   private _data:any; //we really dont want to ever use any but for ease of use lets do this.
   save:SaveModel;
   
   //this allows this class to act as a singleton.
   private static _instance: DataController;
   public static get Instance()
   {
       // Do you need arguments? Make it a regular method instead.
       return this._instance || (this._instance = new this());
   }
   //end singlton functionality.
   

   constructor() {
      console.log("DataController::constructor");
      this._data = {};
   }

   


   loadModel(model:Object){
      if(model && model !== undefined && model !== null){
         this._data = model;
         this.save = JSON.parse(JSON.stringify(this._data.save));
         
      } else {
         console.warn("error loading the the model passed to the DataController", model);
      }


   }

   get(key:String, clone:Boolean) {
      let shouldClone = clone || true;
      var obb:any = this._data;

      if (key !== undefined) {
         let parts = key.split(".");
         for (var i = 0; i < parts.length; i++) {
            obb = obb[parts[i]];

            if (obb === undefined) {
               var errObj = parts.length = i;
               console.warn("game.data.get, tried to request key of: " + key + " but failed at getting: ", errObj);
               return null;
            }
         };
      }


      if (obb === undefined) {
         console.warn("game.data.get, key of: " + key + " is not set");
         return null;
      }

      return (shouldClone) ? JSON.parse(JSON.stringify(obb)) : obb;


   }

   destroy() {

   }

}
