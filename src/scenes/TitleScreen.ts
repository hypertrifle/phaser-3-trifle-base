import TitleScreenModel from '../models/TitleScreenModel';
import GameData from '../plugins/global/GameData';
import Sponge from '../plugins/global/Sponge';


export default class
 TitleScreen extends Phaser.Scene {

    /**
     * data model for this class, define so everything is in order.
     *
     * @type {TitleScreenModel}
     * @memberof TitleScreen
     */
    sceneDataModel: TitleScreenModel;

    /**
     * reference to our spong tools.
     *
     * @type {SpongeUtils}
     * @memberof TitleScreen
     */
    sponge: Sponge;


    constructor() {
        super({
            key: 'TitleScreen', active: true
        });
        console.log('TitleSceeen::constructor');
    }

    preload() {
        console.log('titleScene::preload');
        // grab our utils
        this.sponge = this.sys.plugins.get('sponge') as Sponge; // cas
    }

    /**
 *a layer for background objects, remember these can still be sorted as well
 *
 * @type {Phaser.GameObjects.Container}
 * @memberof TitleScreen
 */
    backgroundLayer: Phaser.GameObjects.Container;

    create() {
        // grab our data for this model.
        this.sceneDataModel = this.sponge.data.getDataFor('titleScene') as TitleScreenModel; // cast

        // create a background layer for objects that exist in BG.
        this.backgroundLayer = new Phaser.GameObjects.Container(this);

        // create a sprite that we can apply our pipline to.
        let g: Phaser.GameObjects.Graphics = this.make.graphics({ x: 0, y: 0, add: false });
        g.fillStyle(0x000000, 1);
        g.fillRect(0, 0, this.sponge.scale.percentX(100), this.sponge.scale.percentY(100));
        g.generateTexture('titlescreen_texture');

        let background: Phaser.GameObjects.Image = this.add.image(0, 0, 'titlescreen_texture');
        // background.setPipeline("custom_background");
        background.x = 0;
        background.setOrigin(0, 0);

    }


    update(time:number, delta:number) {
        super.update(time, delta);


    }

    shutdown() {

    }

}
