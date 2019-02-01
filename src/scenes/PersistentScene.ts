import BaseScene from "./BaseScene";

export default class PersistentScene extends BaseScene {

  constructor() {
    super({
      key: "PersistentScene",
      active: true // we are always active.
    });
    console.log("PersistentScene::constructor");
  }

  preload() {
    console.log("PersistentScene::preload");

  }

  create() {
    super.create();


    this.add.graphics({});
  }

  update(time: number, delta: number) {
    super.update(time, delta);
  }

  shutdown() {
    // drop references to anything we have in create
    this.tools = null;

    super.shutdown();
  }
}
