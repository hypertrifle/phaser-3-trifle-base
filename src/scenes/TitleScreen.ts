import TitleScreenModel from '../models/TitleScreenModel';
import GameData from '../plugins/global/GameData';
import Sponge from '../plugins/global/Sponge';


class StaticOverlayPipeline extends Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline {

    constructor(game:Phaser.Game) {
        
        super({
            game: game,
            renderer: game.renderer,
            fragShader: `
            precision mediump float;

            uniform sampler2D uMainSampler;
            uniform float time;
            uniform vec2 uResolution;

            varying vec2 outTexCoord;
            varying vec4 outTint;

            #define SPEED 10.0

            void main(void)
            {
                float c = cos(time * SPEED);
                float s = sin(time * SPEED);

                vec4 pixel = texture2D(uMainSampler, outTexCoord);

                gl_FragColor = pixel;
            }
            `
        });


         
    
}

    
}



export interface TestInterface {
    one: number,
    two: boolean,
    three?: string
    missing:number
}

export class TestClass {
    one: number;
    two: boolean;
    three?: string;
    missing: number = 5;
}

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
        //grab our utils
        this.sponge = this.sys.plugins.get("sponge") as Sponge; //cas
    }

    /**
 *a layer for background objects, remember these can still be sorted as well
 *
 * @type {Phaser.GameObjects.Container}
 * @memberof TitleScreen
 */
    backgroundLayer: Phaser.GameObjects.Container;

    /**
     * our GLSL frag slader pipeline for this game instance.
     *
     * @type {Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline}
     * @memberof TitleScreen
     */
    backgroundPipeline: Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline;

    create() {

        //set up out pipline from the able frag class.
        this.backgroundPipeline = (this.game.renderer as Phaser.Renderer.WebGL.WebGLRenderer).addPipeline("custom_background", new StaticOverlayPipeline(this.game)) as Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline;
        //set our uResolution. - usful for 2d fragment shaders to scale values to canvas size.
        this.backgroundPipeline.setFloat2('uResolution', this.sponge.scale.percentX(100), this.sponge.scale.percentX(100));
       

        console.warn(this.sponge);
        
        //grab our data for this model.
        this.sceneDataModel = this.sponge.data.getDataFor("titleScene") as TitleScreenModel; //cast

        //create a background layer for objects that exist in BG.
        this.backgroundLayer = new Phaser.GameObjects.Container(this);


        //create a sprite that we can apply our pipline to.
        let g: Phaser.GameObjects.Graphics = this.make.graphics({ x: 0, y: 0, add: false });
        g.fillStyle(0x00ff00, 1);
        g.fillRect(0, 0, this.sponge.scale.percentX(90), this.sponge.scale.percentY(50));
        g.generateTexture('titlescreen_texture');

        let background: Phaser.GameObjects.Image = this.add.image(0, 0, "titlescreen_texture");
        // background.setPipeline("custom_background");
        background.x = this.sponge.scale.percentX(40);
        background.setOrigin(0, 0);


    }


    update() {
        this.backgroundPipeline.setFloat1('uTime', this.time.now);
    }

    shutdown() {

    }

}
