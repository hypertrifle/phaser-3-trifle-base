import BaseScene from "./BaseScene";
import Tools from "../plugins/global/Tools";

export default class REPLACEMEScene extends BaseScene {

  public tools:Tools;

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
    this.tools = null;

    super.shutdown();
  }
}
