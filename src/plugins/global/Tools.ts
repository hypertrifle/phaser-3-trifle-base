import GameData from "./GameData";
import HTMLUtils from "./HTMLUtils";
import Utils from "../utils/Utils";
import Boot from "../../scenes/Boot";
import { GameObjects } from "phaser";
import { GUI } from "dat.gui";
import { DEBUG } from "../..";


export default class Tools extends Phaser.Plugins.BasePlugin {
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

    // boot up out HTMLUtils plugin and make it accessible, this is used for popups, forms as well as other non canvas / webGL content.
    pluginManager.install("_html", HTMLUtils, true, "_html");
    this.html = pluginManager.get("_html") as HTMLUtils;

    // boot up out generic utilitty classes
    pluginManager.install("_utils", Utils, true, "_utls");
    this.utils = pluginManager.get("_utils") as Utils;


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
   * access to HTML, popups and forms
   *
   * @type {HTMLUtils}
   * @memberof Sponge
   */
  public html: HTMLUtils;


  /**
   * access to utils.
   *
   * @type {Utils}
   * @memberof Sponge
   */
  public utils: Utils;

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
