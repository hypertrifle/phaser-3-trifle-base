import PlanningScene from "./PlanningScene";
import Splene from "./Splene";
import { StateModel } from "../models/Global";


// this is sort of an bootstate, there probably is a more elegant way that this, but I cannot keep up with all this hipster code
// its sort of a settings mediator, validation and initilisation of content. again could be done elsewhere.

export default class Controller extends Splene {

    private svg: Phaser.GameObjects.Image;

    constructor() {

        super({ key: 'controller' });
        console.log(this);

    }

    preload() {
        // this.load.svg('test', 'assets/svg/test.svg');
        this.load.json("content", "assets/json/content.json");

    }

    create() {
        //now that we have assets avalilible we can load the settings files
        this._data.loadModel(this.cache.json.get("content"));

        //see if we have any save data
        try {
            this._tracking.loadModel(this._data.save);
        } catch (e) {
            console.warn("error initilising tracking controller");
        }

        //here we may eventually load our scenes, or figure our a better / more pragmatic way to load the states.


        //add our planning scene and auto start.
        this.scene.add("PlanningScene", PlanningScene, true);
    }

    update(t: integer, dt: number) {
        //I would really like an update even if this /scene/ is paused.

    }

    testSVG(): void {
        console.log("testing svg featureset");

        this.svg = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'test');
        this.svg.setScale(2, 2);
        console.log(this.svg);
    }

}
