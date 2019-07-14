import { ContentModel } from "../../models/GameModel";
import SaveModel from "../../models/SaveModel";
import UIModel, { ScalingModel } from "../../models/UIModels";

/**
 * An ENUM to keep track of different Tracking modes that we can connect to.
 *
 * @enum {number}
 */
enum TrackingMode {
  Off = 0,
  OfflineStoage
}

/*
 * A Plugin that handles common Data models for spronge projects,
 * these are automatically loaded from json files and typed cast on boot.
 *
 * @export
 * @class GameData
 * @extends {Phaser.Plugins.BasePlugin}
 */

export default class GameData extends Phaser.Plugins.BasePlugin {

  save: SaveModel;
  trackingMode: TrackingMode = TrackingMode.Off;
  scaling: ScalingModel = new ScalingModel();
  userInterface: UIModel = new UIModel();

  fonts: Array<Phaser.GameObjects.TextStyle>;


  content: ContentModel;

  constructor(pluginManager: Phaser.Plugins.PluginManager) {
    super(pluginManager);
    console.log("GameData::constructor");

    // just define your content or settings here, preferbly as classes, remember the pros of using getters and setters, inheritance and interfaces.
    this.content = new ContentModel();

  }
  /**
   * any unitilise function
   *
   * @memberof GameData
   */
  public init() {
    this.persistantStorageLoad();
  }


 /**
   * loads persistent save data from current tracking system.
   *
   * @memberof GameData
   */
  private persistantStorageLoad() {
    let raw: string = "";

    switch (this.trackingMode) {
      case TrackingMode.Off:
        console.warn(
          "ommititing load of persistent storage as we have it disabled"
        );
        return;
      case TrackingMode.OfflineStoage:
        raw = localStorage.getItem(this.save.identifier);
        break;
      default:
        break;
    }

    // convert to a Javascript Object and do any error checking required.
    let rawObj;
    try {
      rawObj = JSON.parse(raw);
    } catch (e) {
      console.warn(
        "error trying to parse load, bu wit suspend data object, errors, roaw strong loaded: ",
        raw
      );
    }

    // finally assign to our global save.
    console.log("Loading from persistent storage: ", rawObj);

    if (rawObj !== null) {
      this.save = rawObj;

    }

  }

  /**
   * save persistent save data into current tracking system
   *
   * @memberof GameData
   */
  private persistantStorageSave() {
    let serilized =
      this.trackingMode === TrackingMode.Off ? "" : JSON.stringify(this.save);

    switch (this.trackingMode) {
      case TrackingMode.Off:
        console.warn(
          "ommititing save of persistent storage as we have it disabled"
        );
        return;

      case TrackingMode.OfflineStoage:
        // set the loacal storage item.
        localStorage.setItem(this.save.identifier, serilized);
        break;

      default:
        console.warn(
          "Attempting to persist storage but no tracking system selected"
        );
        break;
    }
  }
}
