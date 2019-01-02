import BaseScene from "./BaseScene";

  //@ts-ignore
const POST = require('../../assets/glsl/post.frag');

export class TexturedShader extends Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline {
   constructor(game: Phaser.Game, shaderSource: string) {

       super({
           game: game,
           renderer: game.renderer,
           fragShader: shaderSource
       });
   }

}

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
      this.postShader = (this.game.renderer as Phaser.Renderer.WebGL.WebGLRenderer).addPipeline(
         "Custom",
         new TexturedShader(this.game,POST
         ));

    this.postShader.setFloat2(
    "resolution",
    this.game.config.width as number,
    this.game.config.height as number
    );

    // this.postShader.setFloat1("zoomLevel", this.zoomLevel);


    let TEXTURE_SLOT = 1; // 0 is I assume phasers output.
    let postImage: Phaser.GameObjects.Image = this.add.image(0,0,"post_texture");
    postImage.visible = false;
    this.postShader.renderer.setTexture2D(postImage.texture.source[0].glTexture, TEXTURE_SLOT); // TODO: check array length
    this.postShader.renderer.setInt1(this.postShader.program, 'uPostTexture', TEXTURE_SLOT);
    this.cameras.main.setRenderToTexture(this.postShader);
}


  create() {
    super.create();

    let test = this.add.image(this.dimensions.x/2, this.dimensions.y/2, "atlas.png", "test-sprite.png");



  console.log("PostEffectTestsScene::Create");
    // this.cameras.main.setBounds(0, 0, this.game.canvas.width, this.game.canvas.height);
    // this.cameras.main.setZoom(16);



  }

  update(time: number, delta: number) {
    super.update(time, delta);

   // update shaders
   if (this.postShader) {
      this.shaderTime += 0.005;
      this.postShader.setFloat1("time", this.shaderTime);
   }
   // this.tree.x = (this.tree.x / this.zoomLevel)*this.zoomLevel;




   }

  shutdown() {
    super.shutdown();
  }
}
