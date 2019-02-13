import BaseEffect from "../utils/effects/BaseEffect";
import WaveFillEffect from "../utils/effects/WaveFillEffect";
import { Scene } from "phaser";
import BaseScene from "./BaseScene";



export default class ResizeTestState extends BaseScene {
  shaderTime: number = 0;
  testSprite: Phaser.GameObjects.TileSprite;
  backgroundShader: Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline;
  background: Phaser.GameObjects.TileSprite;

  constructor() {
    super({
      key: "ResizeTestState",
      active: false
    });
  }

  preload(){
    this.load.image("blank.png","assets/img/blank.png");
  }

  initShaders() {   
    this.backgroundShader =  new WaveFillEffect(this.game,"fill");
}
  create() {
    this.initShaders();

    this.background = this.add.tileSprite(0, 0, this.game.scale.width, this.game.scale.width, "blank.png").setOrigin(0);

    this.background.setPipeline("fill");
    this.redraw();

  }

  

  redraw() {
    this.cameras.resize(this.game.scale.width,this.game.scale.height);
    this.backgroundShader.setFloat1("time", this.shaderTime);
    this.backgroundShader.setFloat2("resolution", this.game.scale.width, this.game.scale.height);

    if (this.background) {
      this.background.setSize(this.game.scale.width, this.game.scale.height);
    }

  }

  update(time: number, delta: number) {
    super.update(time, delta);
    this.redraw();

    this.shaderTime += delta / 1000;
    }
  }

