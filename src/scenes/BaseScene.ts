import Tools from "../plugins/global/Tools";
export interface BaseSceneConfig {
  key: string;
  active?: boolean;
}

export interface TrifleUseful {
  create: () => void;
  redraw: (dimensions: Phaser.Geom.Point) => void;
}

export default class BaseScene extends Phaser.Scene implements TrifleUseful {
  public tools: Tools;
  public dimensions: Phaser.Geom.Point;

  constructor(config: BaseSceneConfig) {
    // default scene to inactive at start.
    let active = config.active === undefined ? false : config.active;

    super({
      key: config.key,
      active: active
    });

    try {
      this.tools = this.sys.plugins.get("tools") as Tools; // cast
    } catch (e) {}
  }

  preload() {
    console.log("BaseScene::preload");
  }

  create() {
    if (!this.tools) {
      this.tools = this.sys.plugins.get("tools") as Tools; // cast
    }
    // save a reference to our game dimensions.
    // grab our utils
    if (!this.tools) {
      this.tools = this.sys.plugins.get("tools") as Tools; // cast
    }
    console.log(this.tools);
    this.dimensions = this.tools.dimensions; // i think this is a reference.

    // listen to events.
    this.events.on("sleep", this.sleep, this);
    this.events.on("wake", this.wake, this);
    this.game.scale.on("resize", this.redraw,this);

  }

  update(time: number, delta: number) {
    super.update(time, delta);
  }

  sleep() {}
  wake() {
    if (!this.tools) {
      this.tools = this.sys.plugins.get("tools") as Tools; // cast
    }
  }

  redraw() {
    this.cameras.resize(this.dimensions.x, this.dimensions.y);
    console.log("BASESCENE REDRAW",this.dimensions, this.cameras);

    for (let i = 0; i < this.cameras.cameras.length; i++) {
      this.cameras.cameras[i].setViewport(0,0,this.dimensions.x, this.dimensions.y);
    }
  }

  shutdown() {
    // drop references to anything we have in create
    this.tools = null;
  }
}
