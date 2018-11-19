import MathUtils from "./MathUtils";
import DataUtils from "./DataUtils";
import DisplayUtils from "./DisplayUtils";
import { DataUtls } from "../../utils/DataUtls";





export default class Utils extends Phaser.Plugins.BasePlugin {
  /**
   * @constructor Creates an instance of the Utils plugin (just some common functionallity that is handly to have in a nice place.).
   * @param {Phaser.Plugins.PluginManager} pluginManager
   * @memberof GameData
   */
  constructor(pluginManager: Phaser.Plugins.PluginManager) {
    // attach ourself to the global plugin manager.
    super(pluginManager);
    console.log("Utils::constructor");

    this.data = new DataUtls();
    this.math = new MathUtils();
    this.display = new DisplayUtils();


    // used for future scale factors (we re-rendereing ).
    Utils.scaleFactor = 1;
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


  /**
   * the scale factor used when converting with StaticFnctions;
   *
   * @type {number}
   * @memberof Utils
   */
  public static scaleFactor: number;

  /* I Will define other static functions hear just because of the noce namesapce access */




  //

  /* we can still define util functions here if they don't belong anywhere specific.*/

  static test(): string {
    return "test";
  }

}