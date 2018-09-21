import TitleScene from "./TitleScene";
import GameData from "../plugins/global/GameData";
import HTMLUtils from "../plugins/global/HTMLUtils";
import HUDOverlay from "./HUDOverlay";
import Utils from "../plugins/utils/Utils";
import ScaleManager from "../plugins/global/ScaleManager";
import SpongeUtils from "../plugins/global/Sponge";
import GameModel from "../models/GameModel";
import TestScene from "./TestScene";
import DebugOverlay from "./DebugOverlay";
import Sponge from "../plugins/global/Sponge";

// this is sort of an bootstate, there probably is a more elegant way that this,
// its sort of a settings mediator, validation and initilisation of content. again could be done elsewhere. - maybe plugin?
export default class Boot extends Phaser.Scene {
  private _data: GameData;

  testsprites: Phaser.GameObjects.Sprite[];

  /**
   * because of importing and typescripts, heres where we will manually add states,
   * we can still add configuration to the setting.json but this is to produce nice ol bundles.
   *
   * @memberof Boot
   */
  private loadStates() {
    // add all our scenes, we are going to have to do this pragmatically now with webpack and ts,
    // it means better bundle size but requuires a re-compile on changing orders.

    this.scene.add("TitleScreen", TitleScene, false); // false is to stop it launching now we'll choose to launch it when we need.

    console.log(this._data);

    if (this._data.getDataFor("global.debugMode")) {
      console.warn("!!! GLOBAL DEBUG MODE IS ACTIVE !!!");
      this.scene.add("debug", DebugOverlay, true);
    }

    // finallly add our on top / HUD layer.
    this.scene.add("HUD", HUDOverlay, true); // true as we always want that badboy running in the forground.
  }

  /**
   * load our global plugins, these extend Phaser global functionallity with plugins like Scorm / data and Html helpers.
   *
   * @private
   * @memberof Boot
   */
  private loadPlugins() {
    // first install out data controller, this is going to be both data models, and anything to do with content Tracking.
    this.sys.plugins.install("_data", GameData, true, "_data");
    this._data = this.sys.plugins.get("_data") as GameData;

    // we are going to load all our related sponge helpers in the sponge class now.
    this.sys.plugins.install("sponge", SpongeUtils, true, "sponge");
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
    if (!this.game.device.browser.ie) {
      let args = [
        "%c %c %c Sponge UK - Luigi 1.0.1 %c %c ",
        "font-size: 12px; background: #d8dd0b;",
        "font-size: 12px; background: #0044ff;",
        "color: #fff; font-size: 12px; background: #45b245;",
        "font-size: 12px; background: #0044ff;",
        "font-size: 12px; background: #d8dd0b;"
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
        (this.sys.game.config.height as number) / 2,
        (this.sys.game.config.width as number) * value,
        60
      );
    });

    // Register a load complete event to launch the title screen when all files are loaded
    this.load.on("complete", () => {
      progress.destroy();
    });

    // load content.
    this.load.json("content", "assets/json/content.json"); // required

    // settings.
    this.load.json("settings", "assets/json/settings.json"); // required

    this.load.json("atlas.json", "assets/atlas/atlas.json"); // our SVG atlas

    /* with SVGs we now want to start thinking about making games that we can scale up if required. *
         * to start, we can determine a scale for SVG assets, this way when converted to textures they are enlarged / reduced based on our game size
         * note - this doesn't redraw on resize, its calculated from gameconfig width / height at entry.
         * as we change the resolution, we change the zoom as well keeping fededlity.
         */

    // we now have an SVGScale
    this.load.svg({
      key: "atlas.svg",
      url: "assets/atlas/atlas-50cfe01f.svg",
      svgConfig: { scale: this.game.config.zoom }
    });

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

    // lets generate this atlas.
    let svgAtlasTexture = this.textures.get("atlas.svg");
    let svgAtlasData = this.game.cache.json.get("atlas.json");

    this.transFormAtlasDataToScale(svgAtlasData);

    // @ts-ignore
    Phaser.Textures.Parsers.JSONArray(svgAtlasTexture, 0, svgAtlasData);

    // load our sponge plugins.
    this.loadPlugins();
    console.log("Boot::Initilising all required states");

    // load our states for this experience.
    this.loadStates();
    console.log("Boot::create::end");

    // we are ending the console group here as any subsequent logs should be visible.
    console.groupEnd();

    this.scene.resume("TitleScreen");

    // TODO: Entry Point.
    this.testSVG();
  }

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

  testSVG(): void {
    console.log("testing svg featureset");

    // so can we resize SVGs and generate games at differnet resolutions dependand on device?
    let one: Phaser.GameObjects.Sprite = this.add.sprite(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2,
      "atlas.svg",
      "spaceman"
    );

    let two: Phaser.GameObjects.Sprite = this.add.sprite(
      this.cameras.main.width / 4,
      this.cameras.main.height / 4,
      "atlas.svg",
      "asteroid2"
    );

    let three: Phaser.GameObjects.Sprite = this.add.sprite(
      (this.cameras.main.width / 4) * 3,
      (this.cameras.main.height / 4) * 3,
      "atlas.svg",
      "asteroid1"
    );

    this.testsprites.push(one, two, three);
    // this.svg.setScale((1/this.game.config.zoom));
  }
}
