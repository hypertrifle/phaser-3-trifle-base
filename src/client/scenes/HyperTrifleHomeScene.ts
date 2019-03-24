import { Scene } from "phaser";
import BaseScene from "./BaseScene";
import WaveFillEffect, { Vec2 } from "../utils/effects/WaveFillEffect";

const DPI =window.devicePixelRatio;
const PADDING = 40*DPI;


export default class HyperTrifleHomeScene extends BaseScene {
  shaderTime: number = 0;
  testSprite: Phaser.GameObjects.TileSprite;
  backgroundShader: WaveFillEffect;
  background: Phaser.GameObjects.TileSprite;
  buttons: Phaser.GameObjects.Text[];
  testText: Phaser.GameObjects.Text;
  testTextTitle: Phaser.GameObjects.Text;
  title:Phaser.GameObjects.BitmapText;


  targetBackgroundSizes:{top:Vec2, bottom:Vec2} ={
    top: {x:0.4, y:0.275 },
    bottom: {x:0.66, y:0.82 }
  }


  constructor() {
    super({
      key: "HyperTrifleHomeScene",
      active: false
    });

  }

  preload(){
    this.load.image("blank.png","assets/img/blank.png");
    this.load.bitmapFont(
      "lazer",
      "assets/fonts/lazer_0.png",
      "assets/fonts/lazer.fnt"
    );

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

    this.backgroundShader.upperSplitPosition;

    this.randomiseShaderInfo();
  }

  randomiseShaderInfo(){

    let leftSpit = Math.max(Math.random(),0.5);
    let rightSplit =Math.max(Math.random(),0.5);
    let leftOffset = (1-leftSpit)*Math.random();
    let rightOffset = (1-rightSplit)*Math.random();

    let top = {x:leftOffset,y:rightOffset};
    let bottom = {x:leftOffset+leftSpit, y:rightOffset+rightSplit };

    
    this.add.tween({
      targets:this.targetBackgroundSizes.top,
      x:top.x,
      y:top.y,
      ease: 'Sine.easeInOut',
      delay:8000,
      duration: 8000,
    })
  
    this.add.tween({
      targets:this.targetBackgroundSizes.bottom,
      x:bottom.x,
      y:bottom.y,
      duration: 8000,
      delay:8000,
      ease: 'Sine.easeInOut',
      onComplete: this.randomiseShaderInfo.bind(this)
    })
  
  }

  wake(){
    super.wake();
  }

  addBaseUI(){
    this.buttons = [];

//     let fontStyle: FontStyle = {
//       fontFamily: "'Roboto Condensed'",
//       fontSize: "32px",
//       fontStyle:"bold",
//       color: "#fff",
//       align: "left"
//  };

    //  for (let i = this.tools.data.content.pages.length-1; i >= 0; i--) {

    //    let button = this.add.text(0,0,this.tools.data.content.pages[i].label,fontStyle)
    //    button.setOrigin(0,0.5);
    //    button.setInteractive();
    //    button.input.cursor = "pointer";
       
    //    button.setScale(0.5,0.5);
    //    button.on("pointerover", function(){
    //      this.scene.overBaseButton(this);
    //    });
       
    //    button.on("pointerout", function(){
    //     this.scene.outBaseButton(this);
    //   });
    //    this.buttons.push( button );
    //  }

    //@ts-ignore - typscript defs for the text styles have not optional tags.
     let fontStyle2: Phaser.GameObjects.TextStyle = {
      fontFamily: "'Roboto Condensed'",
      fontSize: (32*DPI)+"px",
      // fontStyle:"bold",
      color: "#000000",
      align: "right",
      fixedWidth : 520*DPI
    };
  

 this.testText = this.add.text(this.game.scale.width-PADDING,PADDING,this.tools.data.content.testParagraph,fontStyle2);
 this.testText.setOrigin(1,0);
 this.testText.setScale(0.5,0.5);

 
    //@ts-ignore - typscript defs for the text styles have not optional tags.
 let fontStyle3: Phaser.GameObjects.TextStyle = {
  fontFamily: "'Roboto Condensed'",
  fontSize: (32*DPI)+"px",
  fontStyle:"bold",
  color: "#000000",
  align: "right",
  fixedWidth: 520*DPI
};

 this.testTextTitle = this.add.text(this.game.scale.width-PADDING,PADDING,this.tools.data.content.testTitle,fontStyle3);
 this.testTextTitle.setOrigin(1, 1);
 this.testTextTitle.setScale(0.5,0.5);

 this.title = this.add.dynamicBitmapText(this.game.scale.width / 2, 30,  "lazer", "SCOOP",  128 );

 this.title.setCenterAlign();
 this.title.letterSpacing += 10;
 this.title.setOrigin(0.0, 0.5);
 this.title.setPipeline("text");
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
    this.cameras.resize(this.game.scale.width*this.game.scale.resolution,this.game.scale.height*this.game.scale.resolution);
    this.backgroundShader.setFloat1("time", this.shaderTime);
    this.backgroundShader.setFloat2("resolution", this.game.scale.width, this.game.scale.height);
    this.backgroundShader.upperSplitPosition = this.targetBackgroundSizes.top;
    this.backgroundShader.lowerSplitPosition = this.targetBackgroundSizes.bottom;
    if (this.background) {
      this.background.setSize(this.game.scale.width, this.game.scale.height);
    }




    if (this.buttons && this.buttons.length > 0) {
      for (let i = 0; i < this.buttons.length; i++) {
        
        let h = (i * this.game.scale.height / this.buttons.length) * 0.25 +(this.game.scale.height*0.04);
        this.buttons[i].y = this.game.scale.height - h ;

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

