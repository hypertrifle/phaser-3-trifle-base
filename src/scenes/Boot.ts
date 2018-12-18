import GameData from "../plugins/global/GameData";
import Tools from "../plugins/global/Tools";
import BaseScene from "./BaseScene";
import Drive2Scene from "./Drive2";

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

    // this.scene.add("TitleScene", TitleScene, false);
    this.scene.add("Drive2Scene", Drive2Scene, false);

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
    // this.sys.plugins.install("_data", GameData, true, "_data");
    // this._data = this.sys.plugins.get("_data") as GameData;

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


  init ()
{

  console.log = function(e:any){
    return;
  }

  console.log("Boot init - for fonts.")
    //  Inject our CSS
    var element = document.createElement('style');

    document.head.appendChild(element);

    var sheet = element.sheet;

    var styles = "@font-face {font-family: 'charybdisregular';    src: url(data:application/font-woff2;charset=utf-8;base64,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) format('woff2'),url(data:application/font-woff;charset=utf-8;base64,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) format('woff');     font-weight: normal; font-style: normal;}";

    // @ts-ignore
    sheet.insertRule(styles, 0);

}


  /**
   * preload anything required for the experience.
   *
   * @memberof Boot
   */
  preload() {

    // this.scene.add("Background", Background, true); // false is to stop it launching now we'll choose to launch it when we need.

    // if (!this.game.device.browser.ie) {
    //   let args = [
    //     "%c %c %c Tricky's Custom Phaser 1.0.0 - HYPERTRIFLE.COM %c %c ",
    //     "font-size: 12px; background: #1C005F;",
    //     "font-size: 12px; background: #85F7BF;",
    //     "color: #000054; font-size: 12px; background: #C65DD2;",
    //     "font-size: 12px; background: #85F7BF;",
    //     "font-size: 12px; background: #1C005F;"
    //   ];

    //   console.log.apply(console, args);

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
    // }

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

    // this.load.json("atlaspng.json", "assets/atlas/atlaspng.json"); // our png atlas

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
      "//ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js"
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


    console.log("Boot::create::webfotnsstarted");


    // https://github.com/typekit/webfontloader#custom todo: load custom from css file.
    // @ts-ignore - see https://github.com/typekit/webfontloader for configuration, this is fine for development, but TODO: possible time out handling.
    WebFont.load({
      custom: {
         families: ["charybdisregular"]
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
    console.log("Boot::create::webfotnsloaded");
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
    this.scene.run("Drive2Scene");
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
