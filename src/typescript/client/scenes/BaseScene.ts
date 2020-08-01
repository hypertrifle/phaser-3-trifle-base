import Tools from "../plugins/global/HyperToolsPlugin";
export interface BaseSceneConfig extends Phaser.Types.Scenes.SettingsConfig {
  key: string;
  active?: boolean;
}


export default class BaseScene extends Phaser.Scene {
  public tools: Tools;
  // public dimensions: Phaser.Geom.Point;

  constructor(config: BaseSceneConfig) {
    // default scene to inactive at start.
    const active = config.active === undefined ? false : config.active;

    super({
      key: config.key,
      active: active
    });

    try {
      this.tools = this.sys.plugins.get("tools") as Tools; // cast
    } catch (e) { }
  }

  preload(): void {
    console.log("BaseScene::preload");

    // TODO: setup preload bar
  }

  create(): void {
    if (!this.tools) {
      this.tools = this.sys.plugins.get("tools") as Tools; // cast
    }

    // listen to events.
    this.events.on("sleep", this.sleep, this);
    this.events.on("wake", this.wake, this);
    this.events.on("start", this.wake, this);

  }

  update(time: number, delta: number): void {
    super.update(time, delta);
  }



  sleep(): void {
    //no global sleep functionallity.
  }
  wake(): void {
    if (!this.tools) {
      this.tools = this.sys.plugins.get("tools") as Tools; // cast
    }
  }

  shutdown(): void {
    // drop references to anything we have in create
    this.tools = null;
  }
}
