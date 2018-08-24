import TitleScreen from "./TitleScreen";
import GameData from "../plugins/global/GameData";


// this is sort of an bootstate, there probably is a more elegant way that this,
// its sort of a settings mediator, validation and initilisation of content. again could be done elsewhere. - maybe plugin?
export default class Boot extends Phaser.Scene {

    private svg: Phaser.GameObjects.Image;
    private _data: GameData;

    constructor() {
        //active true means the state always runs. :D#
        super(
            { key: 'Boot', active: true }
        );
        console.log(this);

    }

    preload() {
        console.log("Boot::preload");

        //a graphics element to track our load progress.
        const progress = this.add.graphics();

        // Register a load progress event to show a load bar
        this.load.on('progress', (value:number) => {
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
        this.load.json("content", "assets/json/content.json");
        this.load.image("avatar.png", "assets/img/avatar.png");

    }

    create() {
        console.log("Boot::create", this);


        /* ------------------------------------------------------ */
        //lets let up our global plugins that we use across scenes.
        /* ------------------------------------------------------ */

        //install out data controller, this is going to be both data models, and anything to do with Learning Content Tracking.
        this.sys.plugins.install("_data", GameData, true, "_data");

        //load it with the data from our content.json
        (this.sys.plugins.get("_data") as GameData).loadData(this.cache.json.get("content"));
            

        //add all our scenes, due to the importation approach to this new boilerplate, we will manually need to add these from now on...
        this.scene.add("TitleScreen", TitleScreen, false);
        


        this.scene.start('TitleScene');

    }

    update(t: integer, dt: number) {
        //this is run every frame, regardless of loaded scene.

    }

    testSVG(): void {
        console.log("testing svg featureset");

        this.svg = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'test');
        this.svg.setScale(2, 2);
        console.log(this.svg);
    }

}
