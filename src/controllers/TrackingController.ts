
import {SaveModel} from '../models/Global';

enum TrackingMode {
   Offline = 1,
   Scorm,
   Adapt,
   Off,
}

class TrackingController {

   private _save:SaveModel;

   constructor() {
      console.log("TrackingController::constructor");
   }

   loadModel(save_model:any){

      try {
         this._save = save_model;
      } catch(e){
         console.log("error loading save model", e);
      }
      
   }


   destroy() {

   }

}

//export
export { TrackingController as default }