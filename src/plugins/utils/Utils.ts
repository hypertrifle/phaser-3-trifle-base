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

  static test(): string {
    return "test";
  }


  // TODO: this will currently only work with 1 string.
  private _newHackString: string;
  private _hackProgress: number = 0;
  private _hackTarget: Phaser.GameObjects.Text;
  private _hackertimer: Phaser.Time.TimerEvent;

  public hackerText(scene: Phaser.Scene, textGameObjectToSet: Phaser.GameObjects.Text, targetString: string, timeForReveal?: number) {
    // TODO: asset

    this._hackProgress = 0;
    this._newHackString = targetString;
    this._hackTarget = textGameObjectToSet;

    this._hackertimer = scene.time.addEvent({
      delay: 1000 / 30,
      callback: this.updateHackerText,
      callbackScope: this,
      repeat: this._newHackString.length * HACK_TEXT_SPEED
    });
  }



  public updateHackerText() {
    let newString =  "";
    let progress: number = this._hackertimer.repeat - this._hackertimer.repeatCount;

    for (let i = 0; i < this._newHackString.length; i++) {
      newString += (i * HACK_TEXT_SPEED < progress) ? this._newHackString[i] :  LETTERS[Math.floor(Math.random() * LETTERS.length)];
    }

    this._hackTarget.text = newString;



  }
}

const HACK_TEXT_SPEED: number = 3;
const LETTERS: string[] = "QWERTYUIOPASDFGHJKLZXCVBNM!£$%^&*()#@?".split("");