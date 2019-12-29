enum HUDFeatures {
  /**
   * Toggle Sound button if availible
   */
  ToggleSound = 0, // commone features first to keep in same postition when launching.
  /**
   * toggle music button if availible
   */
  ToggleMusic,
  /**
   * show return to menu button if avaailible.
   */
  ReturnToMenu,
  /**
   * show restart level button if avalible.
   */
  RestartLevel,
  /**
   * show launch settings button if avalible.
   */
  LaunchSettings
}

/**
 * Data that is used for the title screen.
 *
 * @export
 * @interface HUDModel
 */
export class HUDModel {
  /**
   * Should the game always show a pause / menu button
   *
   * @type {boolean}
   * @memberof HUDModel
   */
  enabled: boolean;

  menuPostion: Phaser.Geom.Point;

  popOutOnHover: boolean; // mobile will need to be considered.

  /**
   * A list of features to disaply on menus, events will be set up to be listened for, unnessicery features will be ommited.
   *
   * @type {Array<HUDFeatures>}
   * @memberof HUDModel
   */
  avalibleFeatures: Array<HUDFeatures>;

  /**
   * The assets folder you are using for any assets related the the HUD Component.
   *
   * @type {string}
   * @memberof HUDModel
   */
  assetPrefix: string = "HUD";
}

export default HUDModel;
