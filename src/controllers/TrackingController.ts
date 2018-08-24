import GameModel from "../models/GameModel";

enum TrackingMode {
   Offline = 1,
   Scorm,
   Adapt,
   Off,
}

class TrackingController {
   //this allows this class to act as a singleton.
   private static _instance: TrackingController;
   public static get Instance() {
      // Do you need arguments? Make it a regular method instead.
      return this._instance || (this._instance = new this());
   }
   //end singlton functionality.


   private _save: GameModel;

   constructor() {
      console.log("TrackingController::constructor");
   }

   loadModel(save_model: any) {

      try {
         this._save = save_model;
      } catch (e) {
         console.log("error loading save model", e);
      }

   }


   destroy() {

   }

}

//export
export { TrackingController as default }