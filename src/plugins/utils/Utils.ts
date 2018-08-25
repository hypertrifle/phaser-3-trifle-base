import MathUtils from "./MathUtils";
import DataUtils from "./DataUtils";

export default class Utils extends Phaser.Plugins.BasePlugin {
   /**
      * @constructor Creates an instance of the Utils plugin (just some common functionallity that is handly to have in a nice place.).
      * @param {Phaser.Plugins.PluginManager} pluginManager
      * @memberof GameData
      */
   constructor(pluginManager: Phaser.Plugins.PluginManager) {
      //attach ourself to the global plugin manager.
       super(pluginManager);
       console.log("Utils::constructor");


   }

   public math : MathUtils;
   public data : DataUtils;


   /* we can still define util functions here if they don't belong anywhere specific.*/

   static poop():string {
      return "poop";
   }

}


