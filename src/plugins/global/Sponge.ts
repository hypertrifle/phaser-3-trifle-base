import GameData from './GameData';
import HTMLUtils from './HTMLUtils';
import ScaleManager from './ScaleManager';
import Utils from '../utils/Utils';

export default class Sponge extends Phaser.Plugins.BasePlugin {
   /**
      * @constructor Creates an instance of the Sponge plugin that just has easy access to all our custom plugins.
      * @param {Phaser.Plugins.PluginManager} pluginManager
      * @memberof GameData
      */
    constructor(pluginManager: Phaser.Plugins.PluginManager) {

        super(pluginManager);
        console.log('Sponge::constructor');

        //we might need this in the boot / controller class.
        this.data = pluginManager.get("_data") as GameData;

        // boot up out HTMLUtils plugin and make it accessible, this is used for popups, forms as well as other non canvas / webGL content.
        pluginManager.install('_html', HTMLUtils, true, '_html');
        this.html = pluginManager.get("_html") as HTMLUtils;

        // boot up out generic utilitty classes
        pluginManager.install('_utils', Utils, true, '_utls');
        this.utils = pluginManager.get("_utils") as Utils;


        // boot our scale helpers, not sure what to do with these yet, but will take the games zoom a (scalr of the designed document).
        pluginManager.install('_scale', ScaleManager, true, '_scale', { scale: this.game.config.zoom });
        this.scale = pluginManager.get("_scale") as ScaleManager;

    }

    public boot() {
        console.log("SPONGE::BOOT");

        /* ------------------------------------------------------
            lets boot up our global plugins that we use across scenes.
            We are going to do this in the create state as we daependant
            on a lot of the settings from json files which are now availible.
            ------------------------------------------------------ */

    }

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
}
