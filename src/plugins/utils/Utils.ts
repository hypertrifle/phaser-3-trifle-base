import MathUtils from './MathUtils';
import DataUtils from './DataUtils';
import DisplayUtils from './DisplayUtils';
import { DataUtls } from '../../utils/DataUtls';

export default class Utils extends Phaser.Plugins.BasePlugin {
   /**
      * @constructor Creates an instance of the Utils plugin (just some common functionallity that is handly to have in a nice place.).
      * @param {Phaser.Plugins.PluginManager} pluginManager
      * @memberof GameData
      */
   constructor(pluginManager: Phaser.Plugins.PluginManager) {
      // attach ourself to the global plugin manager.
       super(pluginManager);
       console.log('Utils::constructor');

       this.data = new DataUtls();
       this.math = new MathUtils();
       this.display = new DisplayUtils();


   }


   /**
    * reference to our math utilities
    *
    * @type {MathUtils}
    * @memberof Utils
    */
   public math: MathUtils;
   /**
    * referencfe to our Data utilities
    *
    * @type {DataUtils}
    * @memberof Utils
    */
   public data: DataUtils;


   /**
    * refrernce to out display utilities
    *
    * @type {DisplayUtils}
    * @memberof Utils
    */
   public display: DisplayUtils;


   /* we can still define util functions here if they don't belong anywhere specific.*/

   static poop(): string {
      return 'poop';
   }

}


