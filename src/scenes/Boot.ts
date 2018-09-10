import TitleScreen from './TitleScreen';
import GameData from '../plugins/global/GameData';
import HTMLUtils from '../plugins/global/HTMLUtils';
import HUDOverlay from './HUDOverlay';
import Utils from '../plugins/utils/Utils';
import ScaleManger from '../plugins/global/ScaleManager';
import ScaleManager from '../plugins/global/ScaleManager';
import SpongeUtils from '../plugins/utils/SpongeUtils';
import GameModel from '../models/GameModel';
import TestScene from './TestScene';


// this is sort of an bootstate, there probably is a more elegant way that this,
// its sort of a settings mediator, validation and initilisation of content. again could be done elsewhere. - maybe plugin?
export default class Boot extends Phaser.Scene {

    private svg: Phaser.GameObjects.Image;
    private svgScalar: Phaser.Loader.FileTypes.SVGSizeConfig;
    private _data: GameData;


    /**
     * because of importing and typescripts, heres where we will manually add states,
     * we can still add configuration to the setting.json but this is to produce nice ol bundles.
     *
     * @memberof Boot
     */
    private loadStates() {
        // add all our scenes, we are going to have to do this pragmatically now with webpack and ts,
        // it means better bundle size but requuires a re-compile on changing orders.


        this.scene.add('TitleScreen', TitleScreen, false); // false is to stop it launching now we'll choose to launch it when we need.


        if(this._data.getDataFor("gobal.debugMode")){
            console.warn("!!! GLOBAL DEBUG MODE IS ACTIVE !!!");
            this.scene.add('debug', TestScene, true);
        }
        

        // finallly add our on top / HUD layer.
        this.scene.add('HUD', HUDOverlay, true); // true as we always want that badboy running in the forground.
    }

    private loadPlugins() {
        /* ------------------------------------------------------
               lets boot up our global plugins that we use across scenes.
               We are going to do this in the create state as we daependant
               on a lot of the settings from json files which are now availible.
               ------------------------------------------------------ */

        // first install out data controller, this is going to be both data models, and anything to do with content Tracking.
        this.sys.plugins.install('_data', GameData, true, '_data');
        
        //we might need this in the boot / controller class.
        this._data = this.sys.plugins.get("_data") as GameData;

        // boot up out HTMLUtils plugin and make it accessible, this is used for popups, forms as well as other non canvas / webGL content.
        this.sys.plugins.install('_html', HTMLUtils, true, '_html');

        // boot up out generic utilitty classes
        this.sys.plugins.install('_utils', Utils, true, '_utls');

        // boot our scale helpers, not sure what to do with these yet, but will take the games zoom a (scalr of the designed document).
        this.sys.plugins.install('_scale', ScaleManger, true, '_scale', { scale: this.game.config.zoom });

        // finally add our sponge helper class - this allows us access to all the above.
        this.sys.plugins.install('sponge', SpongeUtils, true, 'sponge');


    }

    constructor() {
        // active true means the state always runs. :D#
        super(
            { key: 'Boot', active: true }
        );
    }

    preload() {
        if (!this.game.device.browser.ie) {
            let args = [
                '%c %c %c Sponge UK - Luigi 1.0.1 %c %c ',
                'font-size: 12px; background: #d8dd0b;',
                'font-size: 12px; background: #0044ff;',
                'color: #fff; font-size: 12px; background: #45b245;',
                'font-size: 12px; background: #0044ff;',
                'font-size: 12px; background: #d8dd0b;'
            ];

            console.log.apply(console, args);

        }

        //we are going to colapse any log messages here unitl we are fully booted.
        console.groupCollapsed('BOOT DATA');
        console.log('Boot::preload::start');

        // a graphics element to track our load progress.
        const progress = this.add.graphics();

        // Register a load progress event to show a load bar
        this.load.on('progress', (value: number) => {
            progress.clear();
            progress.fillStyle(0xffffff, 1);

            // 'as number' - this counts as casting as game config accepts strings for these props.
            progress.fillRect(0, this.sys.game.config.height as number / 2, this.sys.game.config.width as number * value, 60);
        });

        // Register a load complete event to launch the title screen when all files are loaded
        this.load.on('complete', () => {
            progress.destroy();
        });

        // load content.
        this.load.json('content', 'assets/json/content.json'); //required

        // settings.
        this.load.json('settings', 'assets/json/settings.json'); // required

        // image files //TODO: how are we to load image assets. (Maybe perstate from now on?)
        // this.load.image("avatar.png", "assets/img/avatar.png");



        /* with SVGs we now want to start thinking about making games that we can scale up if required. *
         * to start, we can determine a scale for SVG assets, this way when converted to textures they are enlarged / reduced based on our game size
         * note - this doesn't redraw on resize, its calculated from gameconfig width / height at entry.
         * as we change the resolution, we change the zoom as well keeping fededlity.
         */

        // we now have an SVGScale
        this.load.svg({
            key: 'test.svg',
            url: 'assets/svg/test.svg',
            svgConfig: {scale: this.game.config.zoom}
        });

        console.log('Boot::preload::end');  // and our scale manager


    }

    create() {
        console.log('Boot::create::start');

        this.loadPlugins();
        console.log('Boot::Initilising all required states');

        this.loadStates();
        console.log('Boot::create::end');

        console.groupEnd();

        //TODO: Entry Point.
        this.testSVG();
    }

    update(t: number, dt: number) {
        // this is run every frame, regardless of loaded scene.

    }

    testSVG(): void {
        console.log('testing svg featureset');

        // so can we resize SVGs and generate games at differnet resolutions dependand on device?
        this.svg = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'test.svg');
        // this.svg.setScale((1/this.game.config.zoom));
    }

}
