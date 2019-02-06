import GameData from "../plugins/global/GameData";
import Tools from "../plugins/global/Tools";
import BaseScene from "./BaseScene";

import * as WebFont from "webfontloader";
// this is sort of an bootstate, there probably is a more elegant way that this, but examples seem to do simular.
// its sort of a settings mediator, validation and initilisation of content. again could be done elsewhere. - maybe plugin?
export default class Boot extends BaseScene {
  static debug: dat.GUI;
  public tools: Tools;

  /**
   *
   * Creates an instance of Boot state.
   * imagine this as a persitent scene which handles the setup / switching and close of states.
   *
   * @memberof Boot
   */
  constructor() {
    // active true means the state always runs. from experience with Phaser2CE, best to keep this contructor free and used pleload / boot and creat for custom fucntionallity/.
    super(
      { key: "Boot", active: true } // we are always going to be active.
    );
  }

  /**
   * preload anything required for the experience.
   *
   * @memberof Boot
   */
  preload() {
    // this.scene.add("Background", Background, true); // false is to stop it launching now we'll choose to launch it when we need.

    if (!this.game.device.browser.ie) {
      let args = [
        "%c %c %c Tricky's Custom Phaser 1.0.0 - HYPERTRIFLE.COM %c %c ",
        "font-size: 12px; background: #1C005F;",
        "font-size: 12px; background: #85F7BF;",
        "color: #000054; font-size: 12px; background: #C65DD2;",
        "font-size: 12px; background: #85F7BF;",
        "font-size: 12px; background: #1C005F;"
      ];
      console.log.apply(console, args);
    }

    // we are going to colapse any log messages here unitl we are fully booted.
    console.groupCollapsed("BOOT DATA");
    console.log("Boot::preload::start");

    // a graphics element to track our load progress.
    const progress = this.add.graphics();

    // Register a load progress event to show a load bar
    this.load.on("progress", (value: number) => {
      progress.clear();
      progress.fillStyle(0xffffff, 1);

      // 'as number' - this counts as casting as game config accepts strings for these props.
      progress.fillRect(
        0,
        (1 - value) * (this.sys.game.config.height as number),
        this.sys.game.config.width as number,
        (this.sys.game.config.height as number) * value
      );
    });

    // Register a load complete event to launch the title screen when all files are loaded
    this.load.on("complete", () => {
      progress.destroy();
    });

    // TODO: try and load any game wide content, usually globabl settings and translation files.

    // load content.
    this.load.json("content", "assets/json/content.json"); // required

    // settings.
    this.load.json("settings", "assets/json/settings.json"); // required

    // LOAD any game wide atlas' but iff assets are yo be used in one state, best to preload and handle in that state.

    /* with SVGs we now want to start thinking about making games that we can scale up if required. *
     * to start, we can determine a scale for SVG assets, this way when converted to textures they are enlarged / reduced based on our game size
     * note - this doesn't redraw on resize, its calculated from gameconfig width / height at entry.
     * as we change the resolution, we change the zoom as well keeping fededlity.
     */

    // we now have an SVGScale
    //  this.load.svg({
    //    key: "atlas.svg",
    //    url: "assets/atlas/atlas.svg",
    //    svgConfig: { scale: this.game.config.zoom }
    //   });

    //   this.load.json("atlas.json", "assets/atlas/atlas.json"); // our SVG atlas

    console.log("Boot::preload::end"); // and our scale manager
  }

  /**
   * Formates a JSON atlas frame data object to the new render resolution size.
   * Edits in place.
   *
   * @param {*} atlasModel
   * @memberof Boot
   */
  // transFormAtlasDataToScale(atlasModel: any) {
  //   for (let i in atlasModel.frames) {
  //     let frame = atlasModel.frames[i];

  //     // alter all frame properties
  //     for (let prop in frame.frame) {
  //       frame.frame[prop] *= this.game.config.zoom;
  //     }

  //     // alter all frame properties
  //     for (let prop in frame.spriteSourceSize) {
  //       frame.spriteSourceSize[prop] *= this.game.config.zoom;
  //     }

  //     // alter all frame properties
  //     for (let prop in frame.sourceSize) {
  //       frame.sourceSize[prop] *= this.game.config.zoom;
  //     }
  //   }
  // }

  resize(
    gameSize: any,
    baseSize: any,
    displaySize: any,
    resolution: any
  ) {
    let width = gameSize.width;
    let height = gameSize.height;
    console.log(this, gameSize);
    this.tools.dimensions.setTo(width, height);


}

  create() {
    // global resizeHandler now handled here:
    this.game.scale.on("resize", this.resize,this);

    console.log("Boot::create::start");

    // this.webFontsLoaded();
    // return;

    // @ts-ignore - see https://github.com/typekit/webfontloader for configuration, this is fine for development, but TODO: possible time out handling.
    // https://github.com/typekit/webfontloader#custom todo: load custom from css file.
    WebFont.load({
      custom: {
        families: ["pixel", "porticovintage"]
      },
      active: this.webFontsLoaded.bind(this),
      inactive: this.webFontsLoaded.bind(this, false)
    });
  }

  /**
   * a second state of our load cue just to make sure fonts have been loaded.
   *
   * @memberof Boot
   */
  webFontsLoaded(success: boolean = true) {
    if (!success) {
      // we may need to look into font fallback at thes point
    }

    console.log("Boot::webFontsLoaded::success?", success);
    this.tools = this.game.plugins.get("tools") as Tools;
    if (this.tools) {
      this.tools.postBoot(this);
    }

    // we are ending the console group here as any subsequent logs should be visible.
    console.groupEnd();

    // TODO: Entry Point.
    this.scene.run("PostEffectTestScene");
  }

  generateTiles() {}

  /**
   * called every frame of the game, remember that this state is
   * ALLWAYS actice and running this loop.
   *
   * @param {number} t
   * @param {number} dt
   * @memberof Boot
   */
  update(t: number, dt: number) {
    super.update(t, dt);
  }
}
