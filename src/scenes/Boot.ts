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
    console.log("Boot::preload::end"); // and our scale manager
  }




  create() {
    // global resizeHandler now handled here:
    // this.cameras.main.setBackgroundColor(0x00FFaa);

    console.log("Boot::create::start");

    // this.webFontsLoaded();
    // return;

    // @ts-ignore - see https://github.com/typekit/webfontloader for configuration, this is fine for development, but TODO: possible time out handling.
    // https://github.com/typekit/webfontloader#custom todo: load custom from css file.
    WebFont.load({
      custom: {
        families: ["pixel", "porticovintage"]
      },
      google: {
        families: ["Roboto+Mono","Share+Tech+Mono","Roboto:400,400i,500,500i,700","Roboto+Condensed:400,700"]
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

    console.log("DPI:", window.devicePixelRatio);

    // this.cameras.main.zoom = 1/window.devicePixelRatio;

    // TODO: Entry Point.
    this.scene.run("HyperTrifleHomeScene");
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
