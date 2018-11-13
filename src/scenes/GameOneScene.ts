import BaseScene from "./BaseScene";

const POST = require("../../assets/glsl/post.frag");


export class FullScreeenShader extends Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline {
   
   constructor(game:Phaser.Game, shaderSource:string)
   {

       super({
           game: game,
           renderer: game.renderer,
           fragShader: shaderSource
       });
   } 

};

export default class GameOneScene extends BaseScene {

   postShader: Phaser.Renderer.WebGL.WebGLPipeline;
   shaderTime: number = 0;
   tree:Phaser.GameObjects.Image;

   
  constructor() {
    super({
      key: "GameOneScene",
      active: false
    });
    console.log("GameOneScene::constructor");
  }

  preload() {
    console.log("GameOneScene::preload");
    this.load.image("post_texture", "assets/img/jump_texture.png")


    
  }

  gameWidth:number;
  gameHeight:number;
  zoomLevel:number = 16;


  private _backStitchColour:number;


  set backStitchColour(v:number){
   this._backStitchColour = v;
   let c:Phaser.Display.Color = Phaser.Display.Color.ValueToColor(this._backStitchColour);


   this.postShader.setFloat3(
      "backStitchColour",
      c.red/256,
      c.green/256,
      c.blue/256
      );
  
}

get backStitchColour():number {
   return this._backStitchColour;
}

initPostShader(){
      // create our background shader pipline.
      this.postShader = (this.game.renderer as Phaser.Renderer.WebGL.WebGLRenderer).addPipeline(
         "Custom",
         new FullScreeenShader(this.game,POST
         ));
          
    this.postShader.setFloat2(
    "resolution",
    this.game.config.width as number,
    this.game.config.height as number
    );
 
    this.postShader.setFloat1("zoomLevel", this.zoomLevel);
    this.backStitchColour = 0x300404;
 
    
    let TEXTURE_SLOT = 1; // 0 is I assume phasers output.
    let postImage:Phaser.GameObjects.Image = this.add.image(0,0,"post_texture");
    postImage.visible = false;
    this.postShader.renderer.setTexture2D(postImage.texture.source[0].glTexture, TEXTURE_SLOT); //TODO: check array length
    this.postShader.renderer.setInt1(this.postShader.program, 'uPostTexture', TEXTURE_SLOT);
    this.cameras.main.setRenderToTexture(this.postShader);
}


  create() {
    super.create();

  //  this.initPostShader();

   console.log("GameOneScene::Create");
    this.cameras.main.setBounds(0, 0, this.game.canvas.width, this.game.canvas.height);
    this.cameras.main.setZoom(16);

    console.log(this.game.canvas);

    this.gameHeight = this.game.canvas.height
    this.gameWidth = this.game.canvas.width;


   let bg = this.add.graphics({});
   bg.fillStyle(0xff00aa,1);
   bg.fillRect(0,0,this.gameWidth,this.gameHeight);


    
  }

  update(time: number, delta: number) {
    super.update(time, delta);
  
   //update shaders
   if(this.postShader){
      this.shaderTime += 0.005;
      this.postShader.setFloat1("time", this.shaderTime);
   }
   // this.tree.x = (this.tree.x / this.zoomLevel)*this.zoomLevel;



  
   }

  shutdown() {
    // drop references to anything we have in create
    this.tools = null;

    super.shutdown();
  }
}
