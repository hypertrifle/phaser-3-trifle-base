enum HUDFeatures {

   ToggleSound = 0, // commone features first to keep in same postition when launching.
   ToggleMusic,
   ReturnToMenu,
   RestartLevel,
   LaunchSettings

}

/**
 * Data that is used for the title screen.
 *
 * @export
 * @interface HUDModel
 */
class HUDModel {
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
   assetPrefix: string = 'HUD';


}

export default HUDModel;