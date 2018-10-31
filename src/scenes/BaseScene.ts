import SpongeUtils from "../plugins/global/Sponge";
export interface BaseSceneConfig {
   key: string;
   active?: boolean;
}
export default class BaseScene extends Phaser.Scene {
  public sponge: SpongeUtils;

  constructor(config: BaseSceneConfig) {

   // default scene to inactive at start.
   let active = (config.active === undefined) ? false : config.active;

    super({
      key: config.key,
      active: active
    });

    try {
      this.sponge = this.sys.plugins.get("sponge") as SpongeUtils; // cast
    } catch (e) {
       // not availible yet.
    }


  }

  preload() {
    console.log("BaseScene::preload");
  }

  create() {
   // grab our utils
   this.sponge = this.sys.plugins.get("sponge") as SpongeUtils; // cast

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
    this.sponge = null;
  }
}
