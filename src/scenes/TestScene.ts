import TestSceneModel from '../models/TestSceneModel';
import GameData from '../plugins/global/GameData';
import SpongeUtils from '../plugins/utils/SpongeUtils';

export default class TestScene extends Phaser.Scene {

    private testSceneModel: TestSceneModel;
    private sponge: SpongeUtils;

    constructor() {
        super({
            key: 'TestScene', active: true
        });
        console.log('TitleSceeen::constructor');

        //grab our utils
        this.sponge = this.sys.plugins.get("sponge") as SpongeUtils; //cast

        //grab our data for this model.
        this.testSceneModel = this.sponge.data.getDataFor("testScene") as TestSceneModel; //cast

        
    }

    preload() {
        console.log('titleScene::preload');

    }

    create() {

    }

    update() {

        this.events.emit('spy.update');
    }

    shutdown() {

    }

}
