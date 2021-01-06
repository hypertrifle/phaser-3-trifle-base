import GameData from "./GameData";
import Boot from "../../scenes/Boot";
import { GUI } from "dat.gui";
import { DEBUG } from "../../index";


export default class HyperToolsPlugin extends Phaser.Plugins.BasePlugin {
  /**
   * @constructor Creates an instance of the Generic tools now use for general game development..
   * @param {Phaser.Plugins.PluginManager} pluginManager
   * @memberof GameData
   */
  constructor(pluginManager: Phaser.Plugins.PluginManager) {
    super(pluginManager);

    this.game = pluginManager.game;

    console.log("Tools::constructor");

    // we might need this in the boot / controller class.
    pluginManager.install("_data", GameData, true, "_data");
    this.data = pluginManager.get("_data") as GameData;

  }

  public postBoot(bootState: Boot) {
    this._boot = bootState;

    if (DEBUG) {
      console.log("setting up debug related tools");
      this.debugGUI = new GUI();
    }


    // this is called when all states and systems are loaded.

  }


  public game: Phaser.Game;


  public dimensions: Phaser.Geom.Point;

  /**
   * access to data and tracking functions
   *
   * @type {GameData}
   * @memberof Sponge
   */
  public data: GameData;

  /**
   * a reference to dat.GUI - TODO: conditional inclusion only on debug mode.
   *
   * @type {(dat.GUI | null)}
   * @memberof Sponge
   */
  public debugGUI: dat.GUI | null = null;

  // private stats: Stat;

  public test: boolean = false;

  private _boot: Boot;
}
