import DataController from "../controllers/DataController";
import TrackingController from "../controllers/TrackingController";
import HTMLController from "../controllers/HTMLController";

export default class Spene extends Phaser.Scene {

   _data:DataController;
   _tracking:TrackingController;
   _html:HTMLController;

   constructor(config:any){
      super(config);

      //save out global helper classes
      this._data = DataController.Instance;
      this._tracking = TrackingController.Instance;
      this._html = HTMLController.Instance;
   
   }


}