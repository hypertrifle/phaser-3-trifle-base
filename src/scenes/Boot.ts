import TitleScreen from "./TitleScreen";
import GameData from "../plugins/global/GameData";
import HTMLUtils from "../plugins/global/HTMLUtils";
import HUDOverlay from "./HUDOverlay";
import Utils from "../plugins/utils/Utils";
import ScaleManger from "../plugins/global/ScaleManager";


// this is sort of an bootstate, there probably is a more elegant way that this,
// its sort of a settings mediator, validation and initilisation of content. again could be done elsewhere. - maybe plugin?
export default class Boot extends Phaser.Scene {

    private svg: Phaser.GameObjects.Image;

    constructor() {
        //active true means the state always runs. :D#
        super(
            { key: 'Boot', active: true }
        );
    }

    preload() {
        console.group();
        console.log("Boot::preload::start");

        //a graphics element to track our load progress.
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

        //load content.
        this.load.json("content", "assets/json/content.jsonc");

        //settings.
        this.load.json("settings", "assets/json/settings.jsonc");




        /* Test stuff below here */


        this.load.image("avatar.png", "assets/img/avatar.png");
        // this.load.svg("test.svg", "assets/svg/test.svg");

        this.load.svg({
            key: 'test.svg',
            url: 'assets/svg/test.svg',
            svgConfig: {
                width: 100,
                height: 100
            }
        });

        console.log("Boot::preload::end");


    }

    create() {
        console.log("Boot::create::start");


        /* ------------------------------------------------------ */
        //lets boot up our global plugins that we use across scenes.
        /* ------------------------------------------------------ */

        //install out data controller, this is going to be both data models, and anything to do with Learning Content Tracking.
        this.sys.plugins.install("_data", GameData, true, "_data");

        //boot up out HTMLUtils plugin and make it accessible, this is used for popups, forms as well as other non canvas / webGL content.
        this.sys.plugins.install("_html", HTMLUtils, true, "_html");

        //boot up out generic utilitty classes
        this.sys.plugins.install("_utils", Utils, true, "_utls");

        //and our scale manager
        this.sys.plugins.install("_scale", ScaleManger, true, "_scale");



        // add all our scenes, we are going to have to do this pragmatically now with webpack and ts, 
        // it means better bundle size but requuires a re-compile on changing orders.

        console.log("Boot::Initilising all required states");
        this.scene.add("TitleScreen", TitleScreen, false); //false is to stop it launching now (but init will be called I think!)

        //load out first state, hopefully always a title screen.
        // this.scene.start('TitleScene');

        //finallly add our on top / HUD layer.
        this.scene.add("HUD", HUDOverlay, true); //true as we always want that badboy running in the forground.

        //lets just do some tests.
        this.testSVG();

        console.log("Boot::create::end");
        console.groupEnd();        
    }

    update(t: integer, dt: number) {
        //this is run every frame, regardless of loaded scene.

    }

    testSVG(): void {
        console.log("testing svg featureset");

        //so can we resize SVGs and generate games at differnet resolutions dependand on device?

        console.log(this.cache);

        // (this.sys.plugins.get("_utils") as Utils).display.resizeSVGAsset((this.cache.


        this.svg = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'test.svg');
        this.svg.setScale(1, 1);
        console.log(this.svg);
    }

}
