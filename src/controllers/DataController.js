class DataController {

   constructor() {
      console.log("DataController::constructor");

      this._data = {};
   }

   loadModel(model){
      if(model && model !== undefined && model !== null){
         this._data = model;
         this.save = JSON.parse(JSON.stringify(this._data.save));
         
      } else {
         console.warn("error loading the the model passed to the DataController", model);
      }


   }

   get(key, clone) {
      shouldClone = clone || true;
      obb = this._data;

      if (key !== undefined) {
         parts = key.split(".");
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

//export
export { DataController as default }