import TestSceneModel from '../models/TestSceneModel';
import GameData from '../plugins/global/GameData';
import SpongeUtils from '../plugins/global/Sponge';

export default class TestScene extends Phaser.Scene {

    private testSceneModel: TestSceneModel;
    private sponge: SpongeUtils;

    constructor() {
        super({
            key: 'TestScene', active: true
        });
        console.log('TitleSceeen::constructor');

        
    }

    preload() {
        console.log('titleScene::preload');

    }

    create() {
        //grab our utils
        this.sponge = this.sys.plugins.get("sponge") as SpongeUtils; //cast

        //grab our data for this model.
        this.testSceneModel = this.sponge.data.getDataFor("testScene") as TestSceneModel; //cast



    }

    update() {

        this.events.emit('spy.update');
    }

    shutdown() {
        //drop references to anything we have in create
        this.sponge = null; 
        this.testSceneModel = null;

    }

}
