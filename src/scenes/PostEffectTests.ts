import BaseScene from "./BaseScene";
import SheneEffect from "../utils/effects/SheneEffect";
import { GUI } from "dat.gui";
import BaseEffect from "../utils/effects/BaseEffect";


export default class PostEffectTestsScene extends BaseScene {

  shaderTime: number = 0;
  tree: Phaser.GameObjects.Image;

  shaders: {shader: BaseEffect, id: string}[];

  debugGUI: GUI;
  constructor() {
    super({
      key: "PostEffectTestScene",
      active: false
    });
    console.log("PostEffectTestsScene::constructor");
  }

  preload() {
    console.log("PostEffectTestsScene::preload");



  }

  initShader() {
    this.shaders = [];


    // create our background shader pipline.
    let postShader: SheneEffect = new SheneEffect(this.game, "glint");
    this.debugGUI.add(postShader,"size",0,0.2);
    this.debugGUI.add(postShader,"speed",0,5);
    this.debugGUI.add(postShader,"delay",0,10);
    this.debugGUI.addColor(postShader, "colour");

    this.shaders.push(
      {
        shader: postShader,
        id: "glint"
      }
    );
  }

  initDebugTools() {
    this.debugGUI = new GUI();
  }


  create() {
    super.create();
    this.cameras.main.setZoom(2);


    this.initDebugTools();

    this.initShader();

    let test = this.add.image(this.dimensions.x / 2, this.dimensions.y / 2, "atlas.png", "test-sprite-2.png");
    test.setPipeline("glint");



    console.log("PostEffectTestsScene::Create");
    // this.cameras.main.setBounds(0, 0, this.game.canvas.width, this.game.canvas.height);
    // this.cameras.main.setZoom(16);



  }

  update(time: number, delta: number) {
    super.update(time, delta);

    this.shaderTime += delta / 1000;

    for (let i = 0; i < this.shaders.length; i ++) {
      this.shaders[i].shader.setFloat1("time", this.shaderTime);

    }


  }

  shutdown() {
    super.shutdown();
  }
}
