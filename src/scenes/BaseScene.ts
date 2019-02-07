import Tools from "../plugins/global/Tools";
export interface BaseSceneConfig {
  key: string;
  active?: boolean;
}

export interface IBaseScene {
  create: () => void;
  redraw: (dimensions?: {width: number,height: number}) => void;
}

export default class BaseScene extends Phaser.Scene implements IBaseScene {
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
    this.dimensions = this.tools.dimensions; // i think this is a reference.

    // listen to events.
    this.events.on("sleep", this.sleep, this);
    this.events.on("wake", this.wake, this);

    // @ts-ignore
    this.scale.on("resize", this.redraw,this);

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

  redraw(gameSize?: {width: number, height: number}) {

  }

  shutdown() {
    // drop references to anything we have in create
    this.tools = null;
  }
}
