import Tools from "../plugins/global/Tools";
export interface BaseSceneConfig {
   key: string;
   active?: boolean;
}
export default class BaseScene extends Phaser.Scene {
  public tools: Tools;

  constructor(config: BaseSceneConfig) {

   // default scene to inactive at start.
   let active = (config.active === undefined) ? false : config.active;

    super({
      key: config.key,
      active: active
    });

    try {
      this.tools = this.sys.plugins.get("tools") as Tools; // cast
    } catch (e) {
       // not availible yet.
       console.warn("State instatiated but plugins are not yet ready, you will no have access to these.");
    }


  }

  preload() {
    console.log("BaseScene::preload");
  }

  create() {
   // grab our utils
   if (!this.tools) {
    this.tools = this.sys.plugins.get("tools") as Tools; // cast
   }

   // listen to events.
   this.events.on("sleep", this.sleep, this);
   this.events.on("wake", this.wake, this);

}

  update(time: number, delta: number) {
    super.update(time, delta);
  }

  sleep() {}
  wake() {}

  shutdown() {
    // drop references to anything we have in create
    this.tools = null;
  }
}