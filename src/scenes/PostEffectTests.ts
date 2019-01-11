import BaseScene from "./BaseScene";
import SheneEffect from "../utils/effects/SheneEffect";


export default class PostEffectTestsScene extends BaseScene {

   postShader: Phaser.Renderer.WebGL.WebGLPipeline;
   shaderTime: number = 0;
   tree: Phaser.GameObjects.Image;


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
      // create our background shader pipline.
      this.postShader =  new SheneEffect(this.game,"glint");



}


  create() {
    super.create();
    this.cameras.main.setZoom(2);

    this.initShader();

    let test = this.add.image(this.dimensions.x/2, this.dimensions.y/2, "atlas.png", "test-sprite-2.png");
    test.setPipeline("glint");



  console.log("PostEffectTestsScene::Create");
    // this.cameras.main.setBounds(0, 0, this.game.canvas.width, this.game.canvas.height);
    // this.cameras.main.setZoom(16);



  }

  update(time: number, delta: number) {
    super.update(time, delta);

   // update shaders
   if (this.postShader) {
      this.shaderTime +=delta/1000;
      this.postShader.setFloat1("time", this.shaderTime);
   }
   // this.tree.x = (this.tree.x / this.zoomLevel)*this.zoomLevel;




   }

  shutdown() {
    super.shutdown();
  }
}
