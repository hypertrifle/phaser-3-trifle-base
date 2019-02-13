import BaseEffect from "../utils/effects/BaseEffect";
import WaveFillEffect from "../utils/effects/WaveFillEffect";
import { Scene } from "phaser";
import BaseScene from "./BaseScene";
import { FontStyle } from "../models/FontModels";

const PADDING = 40;

export default class HyperTrifleHomeScene extends BaseScene {
  shaderTime: number = 0;
  testSprite: Phaser.GameObjects.TileSprite;
  backgroundShader: Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline;
  background: Phaser.GameObjects.TileSprite;
  buttons: Phaser.GameObjects.Text[];
  testText: Phaser.GameObjects.Text;
  testTextTitle: Phaser.GameObjects.Text;


  constructor() {
    super({
      key: "HyperTrifleHomeScene",
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
    super.create();
    this.initShaders();

    this.background = this.add.tileSprite(0, 0, this.game.scale.width, this.game.scale.width, "blank.png").setOrigin(0);

    this.background.setPipeline("fill");
    
    this.addBaseUI();
    
    this.redraw();
  }

  wake(){
    super.wake();
  }

  addBaseUI(){
    this.buttons = [];

    let fontStyle: FontStyle = {
      fontFamily: "'Roboto Condensed'",
      fontSize: "32px",
      fontStyle:"bold",
      color: "#fff",
      align: "left"
 };

     for (let i = this.tools.data.content.pages.length-1; i >= 0; i--) {

       let button = this.add.text(0,0,this.tools.data.content.pages[i].label,fontStyle)
       button.setOrigin(0,0.5);
       button.setScale(0.5,0.5);
       button.setInteractive();
        button.input.cursor = "pointer";
       button.on("pointerover", function(){
         this.scene.overBaseButton(this);
       });
       
       button.on("pointerout", function(){
        this.scene.outBaseButton(this);
      });
       this.buttons.push( button );
     }

     let fontStyle2: FontStyle = {
      fontFamily: "'Roboto Condensed'",
      fontSize: "32px",
      // fontStyle:"bold",
      color: "#000000",
      align: "right",
      wordWrap: { width: 520 }
 };

 this.testText = this.add.text(this.game.scale.width-PADDING,PADDING,this.tools.data.content.testParagraph,fontStyle2);
 this.testText.setOrigin(1,0);
 this.testText.setScale(0.5,0.5);

 let fontStyle3: FontStyle = {
  fontFamily: "'Roboto Condensed'",
  fontSize: "32px",
  fontStyle:"bold",
  color: "#000000",
  align: "right",
  wordWrap: { width: 520 }
};

 this.testTextTitle = this.add.text(this.game.scale.width-PADDING,PADDING,this.tools.data.content.testTitle,fontStyle3);
 this.testTextTitle.setOrigin(1, 1);
 this.testTextTitle.setScale(0.5,0.5);


  }

  overBaseButton(button:Phaser.GameObjects.Text) {
    console.log("over", button);

    this.add.tween({
      duration:200,
      targets:button,
      scaleX:1,
      scaleY:1,
      ease: 'Power2'
    })
  }
  outBaseButton(button:Phaser.GameObjects.Text) {
    console.log("out", button);

    this.add.tween({
      duration:200,
      targets:button,
      scaleX:0.5,
      scaleY:0.5,
      ease: 'Power2'
    })
  }

  

  redraw() {
    this.cameras.resize(this.game.scale.width,this.game.scale.height);
    this.backgroundShader.setFloat1("time", this.shaderTime);
    this.backgroundShader.setFloat2("resolution", this.game.scale.width, this.game.scale.height);

    if (this.background) {
      this.background.setSize(this.game.scale.width, this.game.scale.height);
    }




    if (this.buttons && this.buttons.length > 0) {
      for (let i = 0; i < this.buttons.length; i++) {
        
        let h = ((i + 0.5) * this.game.scale.height / this.buttons.length + 1) * 0.2 +(this.game.scale.height*0.04);
        this.buttons[i].y = this.game.scale.height - PADDING - h;

        this.buttons[i].x = PADDING;
      }
    }





    if(this.testText){
      this.testText.x = this.game.scale.width - PADDING;
      this.testText.y = this.game.scale.height * 0.205 * 0.5;
    }

    if(this.testTextTitle){
      this.testTextTitle.x = this.game.scale.width - PADDING;
      this.testTextTitle.y = this.game.scale.height * 0.205 * 0.5;
    }

  }

  update(time: number, delta: number) {
    super.update(time, delta);
    this.redraw();

    this.shaderTime += delta / 1000;
    }
  }

