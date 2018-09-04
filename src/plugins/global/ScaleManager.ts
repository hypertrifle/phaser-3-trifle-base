import GameData from './GameData';
import 'phaser';

/**
 * the scale manager handles any in-game scaling and positioning, booth zooming within the game and resizing of SVG cotnent for better fedelity
 * please note that the game scaling after being initilised and rendered will essentiallity zoomed, which can lose clarity.
 *
 * @export
 * @class ScaleManager
 * @extends {Phaser.Plugins.BasePlugin}
 */
export default class ScaleManager extends Phaser.Plugins.BasePlugin {
    /**
       * @constructor Creates an instance of the ScaleManager plugin (that handles resizing, and density options)
       * the idea behind this scale manager is not only will it resize the content but aslo be able to apply scaling to SVG content so we can either imporvie visual fedlity, or performance.
       *
       * @param {Phaser.Plugins.PluginManager} pluginManager
       * @memberof GameData
       */

    /**
     * the custom scale we are using for this width / height setup of the game, this can be used to tweak performance for lower machines, to render svgs at
     * smaller textures, its a ratio of dimension chnages from the design dimentsions, to those that are to be rendered, remember again zoom can happen after renering.
     *
     * @type {number}
     * @memberof ScaleManager
     */
    public scale: number;


    public position: PositionManager;


    /**
     * a reference to the scale configuration object.
     *
     * @private
     * @type {ScaleConfig}
     * @memberof ScaleManager
     */
    private _scaleConfig: ScaleConfig;


    /**
     * a remember to the DOM element that contains our canvas
     *
     * @private
     * @type {Element}
     * @memberof ScaleManager
     */
    private gameContainer: Element;

    /**
     * A reference to our DOM element that contains any non-phaser overlay elements.
     *
     * @private
     * @type {Element}
     * @memberof ScaleManager
     */
    private overlayContent: Element;


    /**
     * creates an instance of our scale manager.
     * @param {Phaser.Plugins.PluginManager} pluginManager
     * @memberof ScaleManager
     */
    constructor(pluginManager: Phaser.Plugins.PluginManager) {

        super(pluginManager);

        // grab our settings configuration object.
        this._scaleConfig = (this.pluginManager.get('_data') as GameData).getDataFor('scaling') as ScaleConfig;
    }


    /**
     * init is called directly from the Phaser PlugingManager.
     *
     * @param {Phaser.Loader.FileTypes.SVGSizeConfig} s
     * @memberof ScaleManager
     */
    public init(s: Phaser.Loader.FileTypes.SVGSizeConfig) {
        console.log('ScaleManger::constructor', s);

        // our scalar (design size / render size ratio)
        this.scale = s.scale;

        this.boot();

    }

    /**
     * the HTMLCanvas element that our game is being rendered to, (this can still be the WebGL context)
     *
     * @private
     * @type {HTMLCanvasElement}
     * @memberof ScaleManager
     */
    private canvas: HTMLCanvasElement;



    /**
     * our overlay elemenent used for ay standard HTML content that is to be loaded over the content of the game.
     *
     * @type {Element}
     * @memberof ScaleManager
     */
    public forgroundHTML: Element;

    /**
     * is this device on mobile or not.
     *
     * @default false
     * @type {boolean}
     * @memberof ScaleManager
     */
    public mobile: boolean = false;

    /**
     * is the game displayed in landscape.
     *
     * @type {boolean}
     * @memberof ScaleManager
     */
    public landscape: boolean = true;

    /**
     * initial moot of the scale magager, this sets up our scaling as well as alters font sizes in place.
     *
     * @memberof ScaleManager
     */
    public boot() {

        console.log('ScaleManager::boot');
        // when everything is ready :)


        // asign our canvas.
        this.canvas = this.game.canvas;

        // decide if we are on a mobile device.
        this.mobile = (!this.game.device.os.windows && !this.game.device.os.linux && !this.game.device.os.macOS);

        // decide our desired layout size.
        this.landscape = (this.canvas.width >= this.canvas.height) ? true : false;

        // generate our "overlay" dom element container, used for HTML items, but use the same scaling as the game
        this.forgroundHTML = document.createElement('div');
        this.forgroundHTML.setAttribute('id', 'phaser_overlay');

        // here we are goign to append the overlay HTML element over the top of the canvas object of the game
        this.canvas.parentElement.appendChild(this.forgroundHTML);


        // lets listen to when the browser is resized and if so re-apply any scaling we require to.
        window.addEventListener('resize', () => {
            this.resizeCanvas();
        });

        // force a reload on initial build
        this.resizeCanvas();
    }



    /**
     * called when our window is resizeCamvasd.
     *
     * @param {HTMLCanvasElement} canvas
     * @memberof ScaleManager
     */
    public resizeCanvas() {

        this.handleCanvasScale(this.canvas);

        if (this.mobile) {
            this.handleOrientationMode();
        }

        // this.handleFontResizing();

    }

    handleFontResizing(): void {

        // we will need to scale fonts based on our scale.
        let fonts = (this.pluginManager.get('_data') as GameData).getDataFor('fonts'); // grab the fotns.


        // apply scalar to each font.
        for (let i in fonts) {
            this.applyFontScalar(fonts[i]);
        }
    }


    /**
     * handle any orientational mode in game, ususally reserved for mobile specific notifications for forced portrait / landcase
     *
     * @private
     * @returns {void}
     * @memberof ScaleManager
     */
    private handleOrientationMode(): void {

        if (!this.mobile) {
            return;
        }

        if (window.innerWidth < window.innerHeight) {
            this.landscape ? this.enterIncorrectOrientation() : this.leaveIncorrectOrientation();
        } else {
            this.landscape ? this.leaveIncorrectOrientation() : this.enterIncorrectOrientation();
        }

    }


    // a  getter for gnereic svg scaler object based on game design / render size.
    get svgSizeConfig(): Phaser.Loader.FileTypes.SVGSizeConfig {
        return {scale: this.scale};
    }

    /**
     * handles a change in the size / scale ot the viewport and applies a simple CSS transfor to show at correct size.
     * take into account max / min scale / container size as well as other proprerties.
     *
     * @param {HTMLCanvasElement} canvas
     * @memberof ScaleManager
     */
    handleCanvasScale(canvas: HTMLCanvasElement) {
        console.log('canvas rescale');


        // get the container our both our game canvas and any extra content to be supplied over the top.
        let parent = this.game.canvas.parentElement.parentElement;

        // work out a ratio that will allow use to show all our cotnent within the parted viewport.
        let requiredScaling = Math.min(parent.clientWidth / canvas.width, Math.min(window.innerHeight, parent.clientHeight) / canvas.height);

        // TODO: we want to restrict the game to any mini max size? this will tie in the tih
        // if we are bigger than the max width or height defined in our configuration we need to re calculated the scale to fit all content
        if (canvas.width * requiredScaling > this._scaleConfig.maxWidth || canvas.height * requiredScaling > this._scaleConfig.maxHeight) {
            requiredScaling = Math.min(this._scaleConfig.maxHeight / canvas.height, this._scaleConfig.maxWidth / canvas.width);

        }

        let styleString = '-ms-transform-origin: left top; -webkit-transform-origin: left top;' +
            ' -moz-transform-origin: left top; -o-transform-origin: left top; transform-origin: left top;' +
            ' -ms-transform: scale(' + requiredScaling + '); -webkit-transform: scale3d(' + requiredScaling + ', 1);' +
            ' -moz-transform: scale(' + requiredScaling + '); -o-transform: scale(' + requiredScaling + '); transform: scale(' + requiredScaling + ');' +
            'height:' + canvas.height + ';' +
            ' display: block; margin: 0;';


        this.canvas.setAttribute('style', styleString);
        this.forgroundHTML.setAttribute('style', styleString);
    }

    /**
     * When we are on mobile and enter the incorrect orientation mode (usually portrait.)
     *
     * @memberof ScaleManager
     */
    enterIncorrectOrientation() {
        document.getElementById('orientation').style.display = 'block';
        document.getElementById('content').style.display = 'none';
    }

    /**
     * when we enter the correct orientation mode usually landscale.
     * @memberof ScaleManager
     */
    leaveIncorrectOrientation() {
        document.getElementById('orientation').style.display = 'none';
        document.getElementById('content').style.display = 'block';
    }






    /**
     * rescales all font's defined in our font config in place, this means that any fonts should now take on these values.
     *
     * @private
     * @param {*} fontObject
     * @memberof ScaleManager
     */
    private applyFontScalar(fontObject: ScaledTextStyle) {

        // store our base scaling for later
        if (fontObject.originalFontSize === undefined) {
            fontObject.originalFontSize = parseInt(fontObject.fontSize); // we define our fonts always in pixels.
        }

        // apply our scale.
        fontObject.setFontSize(Math.round(fontObject.originalFontSize * this.scale));
    }


}

// extend the standard font object with some properties we
interface ScaledTextStyle extends Phaser.GameObjects.Text.TextStyle {
    originalFontSize: number;
}

export class PositionManager {

    /**
     * our default scale that our Position manager will us for positioning from edges.
     *
     * @private
     * @type {number}
     * @memberof PositionManager
     */
    private scale: number;

    constructor() {

    }

    setScale(newScale: number): number {
        return this.scale = newScale;
    }

    fromTop(v: number): number {
        return 0 + v;
    }
    fromBottom(v: number): number {
        return 0 + v;
    }
    fromLeft(v: number): number {
        return 0 + v;
    }
    fromRight(v: number): number {
        return 0 + v;
    }
}