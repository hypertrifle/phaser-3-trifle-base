import BaseScene from "./BaseScene";

export default class REPLACEMEScene extends BaseScene {

  constructor() {
    super({
      key: "REPLACEMEScene",
      active: false
    });
    console.log("REPLACEMEScene::constructor");
  }

  preload() {
    console.log("REPLACEMEScene::preload");

  }

  create() {
    super.create();
  }

  update(time: number, delta: number) {
    super.update(time, delta);
  }

  shutdown() {
    // drop references to anything we have in create
    this.sponge = null;

    super.shutdown();
  }
}
