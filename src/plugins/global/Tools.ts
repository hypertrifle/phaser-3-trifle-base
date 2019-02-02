import GameData from "./GameData";
import HTMLUtils from "./HTMLUtils";
import ScaleManager from "./ScaleManager";
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
    this.data = pluginManager.get("_data") as GameData;

    // boot up out HTMLUtils plugin and make it accessible, this is used for popups, forms as well as other non canvas / webGL content.
    pluginManager.install("_html", HTMLUtils, true, "_html");
    this.html = pluginManager.get("_html") as HTMLUtils;

    // boot up out generic utilitty classes
    pluginManager.install("_utils", Utils, true, "_utls");
    this.utils = pluginManager.get("_utils") as Utils;

    // // boot our scale helpers, not sure what to do with these yet, but will take the games zoom a (scalr of the designed document).
    pluginManager.install("_scale", ScaleManager, true, "_scale", {
      scale: this.game.config.zoom
    });
    this.scale = pluginManager.get("_scale") as ScaleManager;
  }

  public postBoot(bootState: Boot) {
    this._boot = bootState;

    if(DEBUG){
      console.log("setting up debug related tools");
      this.debugGUI = new GUI();
    }


    // this is called when all states and systems are loaded.

  }

  private _hightlightOriginalParent: Phaser.GameObjects.Container;
  private _hightlightBlackout: Phaser.GameObjects.Graphics;
  private _highlightContainer: Phaser.GameObjects.Container;
  private _highlightItem: Phaser.GameObjects.GameObject;
  private _highlightScene: Phaser.Scene;
  private _highlightTTText: Phaser.GameObjects.Text;

  public game: Phaser.Game;

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
   * access to scaling and positional options
   *
   * @type {ScaleManager}
   * @memberof Sponge
   */
  public scale: ScaleManager;

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
