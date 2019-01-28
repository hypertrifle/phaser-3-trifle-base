import BaseScene from "./BaseScene";
import SheneEffect from "../utils/effects/SheneEffect";
import { GUI } from "dat.gui";
import BaseEffect from "../utils/effects/BaseEffect";
import RetroTextEffect from "../utils/effects/RetroTextEffects";
import Utils from "../plugins/utils/Utils";


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


    
    this.load.bitmapFont('cast-iron', 'assets/fonts/cast-iron_0.png', 'assets/fonts/cast-iron.fnt');

    this.load.bitmapFont('lot', 'assets/fonts/lot_0.png', 'assets/fonts/lot.fnt');



  }

  initShader() {
    this.shaders = [];


    // create our background shader pipline.
    let postShader: SheneEffect = new SheneEffect(this.game, "glint", {
      speed:1.5,
      size:0.3, 
      delay:3,
      colour: {r:255,g:255,b:255}
    });
    let postDebug = this.debugGUI.addFolder("Glint")
    postDebug.add(postShader,"size",0,0.2);
    postDebug.add(postShader,"speed",0,5);
    postDebug.add(postShader,"delay",0,10);
    postDebug.addColor(postShader, "colour");

    let textShader: RetroTextEffect = new RetroTextEffect(this.game,"text");


    this.shaders.push(
      {
        shader: postShader,
        id: "glint"
      },
      {
        shader: textShader,
        id: "text"
      },

    );
  }

  initDebugTools() {
    this.debugGUI = new GUI();
  }
  
  testFont:Phaser.GameObjects.BitmapText;
  testFont2:Phaser.GameObjects.BitmapText;

  create() {
    super.create();
    // this.cameras.main.setZoom(2);
    this.initDebugTools();
    this.initShader();

    this.testFont = this.add.dynamicBitmapText(this.dimensions.x/2,230,"lot","SCOOP",256);
    this.testFont.setOrigin(0.5, 0);
    this.testFont.setPipeline("text");
    this.text = "poot";
    

    let textDebug = this.debugGUI.addFolder("Text");
    textDebug.add(this,"text",0,0.2);


    // this.testFont2 = this.add.bitmapText(this.dimensions.x/2,330,"lot","longer string",128);
    // this.testFont2.setOrigin(0.5, 0);
    // this.testFont2.setPipeline("text");

    // console.clear();

    console.log("SCOOP", this.testFont.getTextBounds());
    // console.log("LONGER STRING", this.testFont2.getTextBounds());

    let testSprite = this.add.image(this.dimensions.x / 2, this.dimensions.y -10, "atlas.png", "test-sprite-2.png");
    testSprite.setScale(0.5);   
    testSprite.setOrigin(0.5,1);   
    testSprite.setPipeline("glint");




    console.log("PostEffectTestsScene::Create");
    // this.cameras.main.setBounds(0, 0, this.game.canvas.width, this.game.canvas.height);
    // this.cameras.main.setZoom(16);


    // this.input.on('pointermove', this.moveText,this);
  }

  onLetterCallback(wut:any){
    return wut;
  }

  set text(text:string){
    this.testFont.text = text;
    let bounds:BitmapTextSize = this.testFont.getTextBounds();

    this.testFont.pipeline.setFloat2('offset',bounds.global.x,bounds.global.y);
    this.testFont.pipeline.setFloat2('size',bounds.global.width,bounds.global.height);

  }

  get text():string{
    return  "";
  }

  update(time: number, delta: number) {
    super.update(time, delta);

    this.shaderTime += delta / 1000;

    for (let i = 0; i < this.shaders.length; i ++) {
      this.shaders[i].shader.setFloat1("time", this.shaderTime);

      // this.setText(Math.random().toString());

    }
  }
  moveText(pointer:PointerEvent){

    if(this.testFont && pointer){
      this.testFont.x = pointer.x;
      this.testFont.y = pointer.y;
    }


  }

  shutdown() {
    super.shutdown();
  }
}
