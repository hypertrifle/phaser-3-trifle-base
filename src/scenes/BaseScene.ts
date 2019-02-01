import Tools from "../plugins/global/Tools";
export interface BaseSceneConfig {
   key: string;
   active?: boolean;
}

export interface TrifleUseful {
  create:()=>void;
  redraw:(dimensions:Phaser.Geom.Point)=>void;

}

export default class BaseScene extends Phaser.Scene implements TrifleUseful {
  public tools: Tools;
  public dimensions:Phaser.Geom.Point;

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
    this.game.events.on(
      "game.resize",
      this.redraw,this
    );

      //save a reference to our game dimensions.
      // grab our utils
      if (!this.tools) {
        this.tools = this.sys.plugins.get("tools") as Tools; // cast
      }
      console.log(this.tools.scale.dimensions)
      this.dimensions = this.tools.scale.dimensions;// i think this is a reference.
      
    
   // listen to events.
   this.events.on("sleep", this.sleep, this);
   this.events.on("wake", this.wake, this);

}

  update(time: number, delta: number) {
    super.update(time, delta);
  }

  sleep() {}
  wake() {}
 
  redraw(){
  }

  shutdown() {
    // drop references to anything we have in create
    this.tools = null;
  }
}
