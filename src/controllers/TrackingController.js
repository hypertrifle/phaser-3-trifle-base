
const TRACK_MODE = Object.freeze({
   OFFLINE_STORAGE:   Symbol("OfflineStorage"),
   SCORM:  Symbol("Scorm"),
   ADAPT: Symbol("Adapt")
});

class TrackingController {

   constructor() {
      console.log("TrackingController::constructor");
   }

   loadModel(save_model){
      
   }


   destroy() {

   }

}

//export
export { TrackingController as default }