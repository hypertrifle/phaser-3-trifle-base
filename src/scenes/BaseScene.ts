import Tools from "../plugins/global/Tools";
export interface BaseSceneConfig {
  key: string;
  active?: boolean;
}

export interface IBaseScene {
  create: () => void;
  redraw: (dimensions?:{width:number,height:number}) => void;
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

    //@ts-ignore
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

  redraw(gameSize?:{width:number, height:number}) {

    if(!gameSize){
      return;
    }
    this.dimensions.setTo(Math.floor(gameSize.width), Math.floor(gameSize.height));

    let w  = gameSize.width;
    let h  = gameSize.width;

    this.dimensions.setTo(Math.floor(1), Math.floor(h));

    // this.cameras.resize(w, h);

    for (let i = 0; i < this.cameras.cameras.length; i++) {
      this.cameras.cameras[i].setViewport(0,0,w, h);
    }
  }

  shutdown() {
    // drop references to anything we have in create
    this.tools = null;
  }
}
