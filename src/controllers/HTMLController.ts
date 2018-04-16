export default class HTMLController {

    //this allows this class to act as a singleton.
    private static _instance: HTMLController;
    public static get Instance()
    {
        // Do you need arguments? Make it a regular method instead.
        return this._instance || (this._instance = new this());
    }
    //end singlton functionality.

   constructor() {
      console.log("HTMLController::constructor");

   }
   destroy() {

   }

}