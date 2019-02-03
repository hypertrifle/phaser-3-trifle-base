import "phaser";
import { ScalingModel } from "../../models/GameModel";

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
  public scale: number = 1;

  public position: PositionManager;

  /**
   * a reference to the scale configuration object.
   *
   * @private
   * @type {ScaleConfig}
   * @memberof ScaleManager
   */
  private _scaleConfig: ScalingModel;

  /**
   * a remember to the DOM element that contains our canvas
   *
   * @private
   * @type {Element}
   * @memberof ScaleManager
   */
  private gameContainer: HTMLElement;

  /**
   * A reference to our DOM element that contains any non-phaser overlay elements.
   *
   * @private
   * @type {Element}
   * @memberof ScaleManager
   */
  private overlayContent: HTMLElement;

  /**
   * creates an instance of our scale manager.
   * @param {Phaser.Plugins.PluginManager} pluginManager
   * @memberof ScaleManager
   */
  constructor(pluginManager: Phaser.Plugins.PluginManager) {
    super(pluginManager);

    this.position = null;
  }

  /**
   * init is called directly from the Phaser PlugingManager.
   *
   * @param {Phaser.Loader.FileTypes.SVGSizeConfig} s
   * @memberof ScaleManager
   */
  public init(s: Phaser.Loader.FileTypes.SVGSizeConfig) {
    console.log("ScaleManger::constructor", s);

    // our scalar (design size / render size ratio)
    if (s.scale) {
      this.scale = 1 / s.scale;
    }
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

  public dimensions: Phaser.Geom.Point;

  /**
   * initial moot of the scale magager, this sets up our scaling as well as alters font sizes in place.
   *
   * @memberof ScaleManager
   */
  public boot() {
    this.dimensions = new Phaser.Geom.Point(
      (this.game.config.width as number) * this.game.config.zoom,
      (this.game.config.height as number) * this.game.config.zoom
    );

    console.log("ScaleManager::boot");
    // when everything is ready :)
    // grab our settings configuration object.
    this._scaleConfig = new ScalingModel();

    // initilise our position manager
    this.position = new PositionManager(
      new Phaser.Geom.Point(
        (this.game.config.width as number) / 2,
        (this.game.config.height as number) / 2
      )
    );

    // asign our canvas.
    this.canvas = this.game.canvas;

    if (this.game.device.browser.ie) {
      this.canvas.style.position = "fixed !important";
    }

    // decide if we are on a mobile device.
    this.mobile =
      !this.game.device.os.windows &&
      !this.game.device.os.linux &&
      !this.game.device.os.macOS;

    // decide our desired layout size.
    this.landscape = this.canvas.width >= this.canvas.height ? true : false;

    // generate our "overlay" dom element container, used for HTML items, but use the same scaling as the game
    this.forgroundHTML = document.getElementById("overlay");

    // here we are goign to append the overlay HTML element over the top of the canvas object of the game

    if (this._scaleConfig.resizeToParent || this._scaleConfig.expandToParent) {
      // lets listen to when the browser is resized and if so re-apply any scaling we require to.
      window.addEventListener("resize", () => {
        this.resizeCanvas();
      });


      
      // force a reload on initial build
      this.resizeCanvas();
    }
  }

  /**
   * called when our window is resizeCamvasd.
   *
   * @param {HTMLCanvasElement} canvas
   * @memberof ScaleManager
   */
  public resizeCanvas() {
    if (this._scaleConfig.resizeToParent) {
      // this feels a bit savage, but best way to get browser viewport.
      let parent = this.game.canvas.parentElement.parentElement.parentElement;

      // set our global dimensions, all scenes that extend BaseScene will have a reference to this object.
      this.dimensions.setTo(parent.clientWidth, parent.clientHeight);

      // resize the game canvas
      this.game.resize(this.dimensions.x, this.dimensions.y);

      // if we have cameras in our game lets resize these to fit the viewport.
      if (this.systems && this.systems.cameras) {
        for (let i = 0; i < this.systems.cameras.cameras.length; i++) {
          if (this.systems.cameras.cameras[i]) {

            this.systems.cameras.cameras[i].setSize(
              this.dimensions.x,
              this.dimensions.y
            );
          }

        }
      }

      // emit a global event incase anyone wants to hook into a resize the canvas.
      this.game.events.emit("game.resize");
    } else {
      // doe some contain style scaling
      this.handleCanvasScale(this.canvas);
    }
  }

  handleFontResizing(): void {

  }

  /**
   * handle any orientational mode in game, ususally reserved for mobile specific notifications for forced portrait / landcase
   *
   * @private
   * @returns {void}
   * @memberof ScaleManager
   */
  private handleOrientationMode(): void {
    if (!this.mobile || !this._scaleConfig.shouldForceOrientationOnMobile) {
      return;
    }

    if (window.innerWidth < window.innerHeight) {
      this.landscape
        ? this.enterIncorrectOrientation()
        : this.leaveIncorrectOrientation();
    } else {
      this.landscape
        ? this.leaveIncorrectOrientation()
        : this.enterIncorrectOrientation();
    }
  }

  // a  getter for gnereic svg scaler object based on game design / render size.
  get svgSizeConfig(): Phaser.Loader.FileTypes.SVGSizeConfig {
    return { scale: this.scale };
  }

  /**
   * handles a change in the size / scale ot the viewport and applies a simple CSS transfor to show at correct size.
   * take into account max / min scale / container size as well as other proprerties.
   *
   * @param {HTMLCanvasElement} canvas
   * @memberof ScaleManager
   */
  handleCanvasScale(canvas: HTMLCanvasElement) {
    // console.error("handle canvas scale");

    // get the container our both our game canvas and any extra content to be supplied over the top.
    let parent = this.game.canvas.parentElement.parentElement.parentElement;

    // work out a ratio that will allow use to show all our cotnent within the parted viewport.
    let requiredScaling = Math.min(
      parent.clientWidth / canvas.width,
      Math.min(window.innerHeight, parent.clientHeight) / canvas.height
    );

    // TODO: we want to restrict the game to any mini max size? this will tie in the tih

    if (
      this._scaleConfig.maxWidth !== null &&
      this._scaleConfig.maxHeight != null
    ) {
      // if we are bigger than the max width or height defined in our configuration we need to re calculated the scale to fit all content
      if (
        canvas.width * requiredScaling > this._scaleConfig.maxWidth ||
        canvas.height * requiredScaling > this._scaleConfig.maxHeight
      ) {
        requiredScaling = Math.min(
          this._scaleConfig.maxHeight / canvas.height,
          this._scaleConfig.maxWidth / canvas.width
        );
      }
    }

    // requiredScaling = 16;//this.game.config.zoom;

    let styleString =
      // "transform: scale(" +
      // requiredScaling + "," + requiredScaling +
      // ");" +
      "height:" +
      canvas.height * requiredScaling +
      "px;" +
      "width:" +
      canvas.width * requiredScaling +
      "px;";
    // +
    // "width:" +
    // canvas.width + "px;";

    let extraStlye = "";

    if (this.game.device.browser.ie) {
      styleString += "position:static !important;";
    }

    this.canvas.setAttribute("style", styleString + extraStlye);
    if (this.forgroundHTML) {
      this.forgroundHTML.setAttribute("style", styleString);
    }
  }

  /**
   * When we are on mobile and enter the incorrect orientation mode (usually portrait.)
   *
   * @memberof ScaleManager
   */
  enterIncorrectOrientation() {
    // document.getElementById("orientation").style.display = "block";
    // document.getElementById("content").style.display = "none";
  }

  /**
   * when we enter the correct orientation mode usually landscale.
   * @memberof ScaleManager
   */
  leaveIncorrectOrientation() {
    // document.getElementById("orientation").style.display = "none";
    // document.getElementById("content").style.display = "block";
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
    fontObject.setFontSize(
      Math.round(fontObject.originalFontSize * this.scale)
    );
  }

  percentX(percent: number): number {
    if (percent === 1) {
      console.warn("A PercentX was calculated of value 1, assuming 100%");
    }

    return percent <= 1
      ? (this.game.config.width as number) * percent
      : (this.game.config.width as number) * (percent / 100);
  }

  percentY(percent: number): number {
    if (percent === 1) {
      console.warn("A PercentY was calculated of value 1, assuming 100%");
    }

    return percent <= 1
      ? (this.game.config.height as number) * percent
      : (this.game.config.height as number) * (percent / 100);
  }

  dToR(designDimension: number): number {
    return designDimension * this.scale;
  }

  fromTop(designfromTop: number | string): number {
    if (typeof designfromTop === "string") {
      if (designfromTop.indexOf("%")) {
        return this.percentY(parseInt(designfromTop));
      }
    }
    return this.dToR((designfromTop as number) / this.scale);
  }

  fromBottom(designFromBottom: number | string): number {
    if (typeof designFromBottom === "string") {
      if (designFromBottom.indexOf("%")) {
        return this.percentY(100 - parseInt(designFromBottom));
      }
    }
    return (
      (this.game.config.height as number) -
      this.dToR(designFromBottom as number)
    );
  }

  fromLeft(designfromLeft: number | string): number {
    if (typeof designfromLeft === "string") {
      if (designfromLeft.indexOf("%")) {
        return this.percentX(parseInt(designfromLeft));
      }
    }
    return this.dToR(designfromLeft as number);
  }

  fromRight(designFromRight: number | string): number {
    if (typeof designFromRight === "string") {
      if (designFromRight.indexOf("%")) {
        return this.percentY(100 - parseInt(designFromRight));
      }
    }
    return (
      (this.game.config.width as number) - this.dToR(designFromRight as number)
    );
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

  private gameSize: Phaser.Geom.Point;

  constructor(gameSize: Phaser.Geom.Point) {
    this.gameSize = gameSize;
  }

  setScale(newScale: number): number {
    return (this.scale = newScale);
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
