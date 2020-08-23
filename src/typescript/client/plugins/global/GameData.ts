import ContentModel from "../../models/ContentModel";
import SaveModel from "../../models/SaveModel";
import UIModel, { ScalingModel } from "../../models/UIModels";

/**
 * An ENUM to keep track of different Tracking modes that we can connect to.
 *
 * @enum {number}
 */
export enum TrackingMode {
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

  trackingMode: TrackingMode = TrackingMode.Off;

  save: SaveModel = new SaveModel();
  scaling: ScalingModel = new ScalingModel();
  ui: UIModel = new UIModel();

  content: ContentModel = new ContentModel();

  constructor(pluginManager: Phaser.Plugins.PluginManager) {
    super(pluginManager);
    console.log("GameData::constructor");

  }
  /**
   * any unitilise function
   *
   * @memberof GameData
   */
  public init(): void {
    this.persistantStorageLoad();


  }



  loadFromCache(): void {
    const content = this.game.cache.json.get('content');
    const settings = this.game.cache.json.get('settings');

    if (content) {
      console.log("dataPlugin::loadJSONContent", content);

      Object.assign(this.content, content);
    }

    if (settings) {
      console.log("dataPlugin::LoadJSONSettings", settings);
      Object.assign(this, settings);
    }

  }
  /**
    * loads persistent save data from current tracking system.
    *
    * @memberof GameData
    */
  private persistantStorageLoad() {
    let raw = "";

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
    const serilized =
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
