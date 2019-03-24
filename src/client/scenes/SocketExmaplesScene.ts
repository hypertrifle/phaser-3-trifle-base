import BaseScene from "./BaseScene";
import SocketIOPlugin from "../plugins/global/SocketIOPlugin";

export default class SocketExmaplesScene extends BaseScene {

  socketController:SocketIOPlugin;

  constructor() {
    super({
      key: "SocketExmaplesScene",
      active: false
    });
    console.log("SocketExmaplesScene::constructor");
  }

  preload() {
    console.log("SocketExmaplesScene::preload");

    this.socketController = this.sys.plugins.get("socket.io") as  SocketIOPlugin;//plugins.get("socket.io");


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
