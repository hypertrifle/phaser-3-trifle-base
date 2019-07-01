import Tools from "../plugins/global/HyperToolsPlugin";
export interface BaseSceneConfig {
  key: string;
  active?: boolean;
}

export interface IBaseScene {
  create: () => void;
}

export default class BaseScene extends Phaser.Scene implements IBaseScene {
  public tools: Tools;
  // public dimensions: Phaser.Geom.Point;

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

    //TODO: setup preload bar
  }

  create() {
    if (!this.tools) {
      this.tools = this.sys.plugins.get("tools") as Tools; // cast
    }

    // listen to events.
    this.events.on("sleep", this.sleep, this);
    this.events.on("wake", this.wake, this);
    this.events.on("start", this.wake, this);

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

  shutdown() {
    // drop references to anything we have in create
    this.tools = null;
  }
}
