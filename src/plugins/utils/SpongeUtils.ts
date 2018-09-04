import GameData from '../global/GameData';
import HTMLUtils from '../global/HTMLUtils';
import ScaleManager from '../global/ScaleManager';
import Utils from './Utils';

export default class SpongeUtils extends Phaser.Plugins.BasePlugin {
   /**
      * @constructor Creates an instance of the SpongeUtils plugin that just has easy access to all our custom plugins.
      * @param {Phaser.Plugins.PluginManager} pluginManager
      * @memberof GameData
      */
   constructor(pluginManager: Phaser.Plugins.PluginManager) {

    super(pluginManager);
       console.log('SpongeUtils::constructor');

       // just link references to all our regularly accessed stuff.
       this.data = pluginManager.get('_data') as GameData;
       this.html = pluginManager.get('_html') as HTMLUtils;
       this.scale = pluginManager.get('_utils') as ScaleManager;
       this.utils = pluginManager.get('_scale') as Utils;
    }

    /**
     * access to data and tracking functions
     *
     * @type {GameData}
     * @memberof SpongeUtils
     */
    public data: GameData;
    /**
     * access to HTML, popups and forms
     *
     * @type {HTMLUtils}
     * @memberof SpongeUtils
     */
    public html: HTMLUtils;

    /**
     * access to scaling and positional options
     *
     * @type {ScaleManager}
     * @memberof SpongeUtils
     */
    public scale: ScaleManager;

    /**
     * access to utils.
     *
     * @type {Utils}
     * @memberof SpongeUtils
     */
    public utils: Utils;
}
