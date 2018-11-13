import TitleScene from "./TitleScene";
import GameData from "../plugins/global/GameData";
import Tools from "../plugins/global/Tools";
import Sponge from "../plugins/global/Tools";
import BaseScene from "./BaseScene";
import GameOneScene from "./GameOneScene";

// const atlas = require("svg-inline-loader?../../assets/svg/gameplay/gameplay-tile-door.svg") as string;

// this is sort of an bootstate, there probably is a more elegant way that this, but examples seem to do simular.
// its sort of a settings mediator, validation and initilisation of content. again could be done elsewhere. - maybe plugin?
export default class Boot extends BaseScene {
  private _data: GameData;

  testsprites: Phaser.GameObjects.Sprite[];

  /**
   * because of importing and typescripts, heres where we will manually add states,
   * we can still add configuration to the setting.json but this is to produce nice ol bundles.
   *
   * @memberof Boot
   */
  private loadStates() {
    console.groupCollapsed("STATES");
    console.log("Boot::Initilising all required states");

    // add all our scenes, we are going to have to do this pragmatically now with webpack and ts,
    // it means better bundle size but requuires a re-compile on changing orders.

    this.scene.add("TitleScene", TitleScene, false);
    this.scene.add("GameOneScene", GameOneScene, false);

    console.log(this._data);

    // if (this._data.getDataFor("global.debugMode")) {
    //   console.warn("!!! GLOBAL DEBUG MODE IS ACTIVE !!!");
    //   this.scene.add("debug", DebugOverlay, true);
    // }

    // finallly add our on top / HUD layer. - fuck this.
    // this.scene.add("HUD", HUDOverlay, true); // true as we always want that badboy running in the forground.

        // we are ending the console group here as any subsequent logs should be visible.
        console.groupEnd();
  }

  /**
   * load our global plugins, these extend Phaser global functionallity with plugins like Scorm / data and Html helpers.
   *
   * @private
   * @memberof Boot
   */
  private loadPlugins() {
    console.groupCollapsed("PLUGINS");

    // first install out data controller, this is going to be both data models, and anything to do with content Tracking. TODO:I'm going to leave the data tools in as is a nice way for quick config / translation, but casting these loose object to types doing catch warning on compile... and we are back to ol' reliable javascritp:/
    this.sys.plugins.install("_data", GameData, true, "_data");
    this._data = this.sys.plugins.get("_data") as GameData;

    // we are going to load all our related sponge helpers in the sponge class now.
    this.sys.plugins.install("tools", Tools, true, "tools");
    this.tools = this.sys.plugins.get("tools") as Tools;

    // if (this.tools.debugGUI) {
    //   // TODO: add custom items to dat.GUI here, as boot is always active any state based switching will work here.
    // }

    // TODO: add post processing
    // this.cameras.main.pipeline

    // we are ending the console group here as any subsequent logs should be visible.
    console.groupEnd();
  }
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

    this.testsprites = [];
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

    //   let args2 = [
    //     "%c %c %c %c 🔎 _GAME_NAME_ _GAME_VERSION_ ALPHA 🔭 %c %c %c ", // // https://getemoji.com/
    //     "font-size: 8px; background: #F0C25A", //custom colours
    //     "font-size: 10px; background: #33A995",
    //     "font-size: 12px; background: #F0394F;",
    //     "color: #DAEAF0; font-size: 12px; background: #233648;",
    //     "font-size: 12px; background: #F0394F;",
    //     "font-size: 10px; background: #33A995",
    //     "font-size: 8px; background: #F0C25A"
    //   ];

    //   console.log.apply(console, args2);
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
        (this.sys.game.config.height as number) / 2,
        (this.sys.game.config.width as number) * value,
        60
      );
    });

    // Register a load complete event to launch the title screen when all files are loaded
    this.load.on("complete", () => {
      progress.destroy();
    });

    // TODO: try and load content, if not skip those libs.
    // TODO: inline json for package size.


    // load content.
    this.load.json("content", "assets/json/content.json"); // required

    // settings.
    this.load.json("settings", "assets/json/settings.json"); // required

    // todo:

    this.load.json("atlaspng.json", "assets/atlas/atlaspng.json"); // our png atlas

    this.load.atlas('atlas.png', 'assets/atlas/atlaspng.png', 'assets/atlas/atlaspng.json');


    /* with SVGs we now want to start thinking about making games that we can scale up if required. *
    * to start, we can determine a scale for SVG assets, this way when converted to textures they are enlarged / reduced based on our game size
    * note - this doesn't redraw on resize, its calculated from gameconfig width / height at entry.
    * as we change the resolution, we change the zoom as well keeping fededlity.
    */

   // we now have an SVGScale
   this.load.svg({
     key: "atlas.svg",
     url: "assets/atlas/atlas.svg",
     svgConfig: { scale: this.game.config.zoom }
    });

    this.load.json("atlas.json", "assets/atlas/atlas.json"); // our SVG atlas

    this.load.script(
      "webfont",
      "https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js"
    );

    console.log("Boot::preload::end"); // and our scale manager
  }

  /**
   * Formates a JSON atlas frame data object to the new render resolution size.
   * Edits in place.
   *
   * @param {*} atlasModel
   * @memberof Boot
   */
  transFormAtlasDataToScale(atlasModel: any) {
    for (let i in atlasModel.frames) {
      let frame = atlasModel.frames[i];

      // alter all frame properties
      for (let prop in frame.frame) {
        frame.frame[prop] *= this.game.config.zoom;
      }

      // alter all frame properties
      for (let prop in frame.spriteSourceSize) {
        frame.spriteSourceSize[prop] *= this.game.config.zoom;
      }

      // alter all frame properties
      for (let prop in frame.sourceSize) {
        frame.sourceSize[prop] *= this.game.config.zoom;
      }
    }
  }

  create() {
    console.log("Boot::create::start");

    // this.webFontsLoaded();
    // return;

    // @ts-ignore - see https://github.com/typekit/webfontloader for configuration, this is fine for development, but TODO: possible time out handling.
    // https://github.com/typekit/webfontloader#custom todo: load custom from css file.
    WebFont.load({

      custom: {
         families: ["pixel"]
      },
      active: this.webFontsLoaded.bind(this)
    });
  }

  /**
   * a second state of our load cue just to make sure fonts have been loaded.
   *
   * @memberof Boot
   */
  webFontsLoaded() {
    // lets generate this atlas.
    let svgAtlasTexture = this.textures.get("atlas.svg");
    let svgAtlasData = this.game.cache.json.get("atlas.json");

    this.transFormAtlasDataToScale(svgAtlasData);

    // @ts-ignore
    Phaser.Textures.Parsers.JSONArray(svgAtlasTexture, 0, svgAtlasData);

    // load our sponge plugins.
    this.loadPlugins();

    // load our states for this experience.
    this.loadStates();
    console.log("Boot::create::end");

    this.tools.postBoot(this);

    // we are ending the console group here as any subsequent logs should be visible.
    console.groupEnd();

    // TODO: Entry Point.
    this.scene.run("GameOneScene");
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
    // console.log(dt);
    // this is run every frame, regardless of loaded scene.
    // for (let i in this.testsprites) {
    //     this.testsprites[i].x += 10*(dt/1000);
    //     this.testsprites[i].y += 10*(dt/1000);
    // }
  }
}
