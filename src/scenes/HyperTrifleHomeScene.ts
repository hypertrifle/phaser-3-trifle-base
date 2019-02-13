import BaseEffect from "../utils/effects/BaseEffect";
import WaveFillEffect from "../utils/effects/WaveFillEffect";
import { Scene } from "phaser";
import BaseScene from "./BaseScene";



export default class HyperTrifleHomeScene extends BaseScene {
  shaderTime: number = 0;
  testSprite: Phaser.GameObjects.TileSprite;
  backgroundShader: Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline;
  background: Phaser.GameObjects.TileSprite;
  buttons: Phaser.GameObjects.Text[];


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

  addBaseUI(){
    this.buttons = [];

    let fontStyle: any = {
      fontFamily: "'Share Tech Mono'",
      fontSize: "22px",
      color: "#ffffff",
      align: "center"
 };

     for (let i = 0; i < this.tools.data.content.pages.length; i ++) {
       this.buttons.push(
         this.add.text(0,0,this.tools.data.content.pages[i].label,fontStyle)
       );

       this.buttons[i].setOrigin(0.5,0.5);
       this.buttons[i].setInteractive();
       this.buttons[i].on("pointerover", this.overBaseButton);
     }



  }

  overBaseButton(e: PointerEvent,x: number, y: number,button: Phaser.GameObjects.Image) {
    // console.log(e, button);
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

