import BaseScene, { IBaseScene } from "./BaseScene";
import SheneEffect from "../utils/effects/SheneEffect";
import { GUI } from "dat.gui";
import BaseEffect from "../utils/effects/BaseEffect";
import RetroTextEffect from "../utils/effects/RetroTextEffects";
import WaveFillEffect from "../utils/effects/WaveFillEffect";
import { bestFit } from "../utils/Utils";

export default class PostEffectTestsScene extends BaseScene implements IBaseScene {
  shaderTime: number = 0;
  tree: Phaser.GameObjects.Image;
  testSprite: Phaser.GameObjects.TileSprite;
  shaders: { shader: BaseEffect; id: string }[];

  buttons: Phaser.GameObjects.Text[];

  constructor() {
    super({
      key: "PostEffectTestScene",
      active: false
    });
    console.log("PostEffectTestsScene::constructor");
  }

  preload() {
    console.log("PostEffectTestsScene::preload");

    this.load.atlas("atlas.png","assets/atlas/atlaspng.png","assets/atlas/atlaspng.json");

    this.load.bitmapFont(
      "lazer",
      "assets/fonts/lazer_0.png",
      "assets/fonts/lazer.fnt"
    );
    this.load.bitmapFont(
      "cast-iron",
      "assets/fonts/cast-iron_0.png",
      "assets/fonts/cast-iron.fnt"
    );

    this.load.bitmapFont(
      "lot",
      "assets/fonts/lot_0.png",
      "assets/fonts/lot.fnt"
    );
  }

  initShaders() {
    this.shaders = [];

    // create our background shader pipline.
    let postShader: SheneEffect = new SheneEffect(this.game, "glint", {
      speed: 5,
      size: 0.5,
      delay: 20,
      colour: { r: 255, g: 100, b: 255 }
    });

    if (this.tools.debugGUI) {
    let postDebug = this.tools.debugGUI.addFolder("Glint");
    postDebug.add(postShader, "size", 0, 0.4);
    postDebug.add(postShader, "speed", 0, 5);
    postDebug.add(postShader, "delay", 0, 10);
    postDebug.addColor(postShader, "colour");
    }

    let textShader: RetroTextEffect = new RetroTextEffect(this.game, "text");
    let fullFillShader: WaveFillEffect = new WaveFillEffect(this.game,"fill");
    

    this.shaders.push(
      {
        shader: postShader,
        id: "glint"
      },
      {
        shader: textShader,
        id: "text"
      },
      {
        shader: fullFillShader,
        id: "waveFill"
      }
    );
  }

  testFont: Phaser.GameObjects.BitmapText;
  testFont2: Phaser.GameObjects.BitmapText;
  background: Phaser.GameObjects.TileSprite;

  create() {
    super.create();

    this.initShaders();



    this.background = this.add.tileSprite(0, 0, this.game.scale.width, this.game.scale.width,"atlas.png", "blank.png").setOrigin(0);

    this.background.setPipeline("fill");

    // this.testSprite = this.add.tileSprite(0,this.game.scale.width - 209,this.game.scale.height,209,
    //   "atlas.png",
    //   "near-buildings-bg.png"
    // );
    // this.testSprite.setScale(1);
    // this.testSprite.setOrigin(0.5, 1);
    // this.testSprite.setPipeline("glint");


        // // add our title
        this.testFont = this.add.dynamicBitmapText(
          this.game.scale.width / 2,
          30,
          "lazer",
          "SCOOP",
          128
        );

        this.testFont.setCenterAlign();
        this.testFont.letterSpacing += 10;
        this.testFont.setOrigin(0.0, 0.5);
        this.testFont.setPipeline("text");
        this.text = "HYPER\nTRIFLE";


        if (this.tools.debugGUI) {
          let textDebug = this.tools.debugGUI.addFolder("Text");
          textDebug.add(this, "text", 0, 0.2);
        }

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
        this.redraw();

  }
  overBaseButton(e: PointerEvent,x: number, y: number,button: Phaser.GameObjects.Image) {
    // console.log(e, button);
  }

  onLetterCallback(wut: any) {
    return wut;
  }

  set text(text: string) {
    this.testFont.text = text.toUpperCase();
    let bounds: BitmapTextSize = this.testFont.getTextBounds();
     this.setUniformsForText(this.testFont);
    this.redraw();
  }

  get text(): string {
    return "";
  }

  setUniformsForText(object: Phaser.GameObjects.BitmapText): void {
    let bounds: BitmapTextSize = object.getTextBounds();

    object.pipeline.setFloat2("resolution", bounds.global.width/this.game.scale.resolution, bounds.global.height/this.game.scale.resolution);
    object.pipeline.setFloat2(
      "size",
      this.testFont.width / this.testFont.scaleX,
      this.testFont.height / this.testFont.scaleY
    );

    // console.log(object.pipeline);





  }

  redraw() {
    super.redraw();

   // console.log(this.dimensions);

    if (this.testFont) {
      this.testFont.x = this.game.scale.width * 0.05;
      this.testFont.y = this.game.scale.height / 5;
      this.testFont.setScale(bestFit(this.testFont.width / this.testFont.scaleX,this.testFont.height / this.testFont.scaleY,this.game.scale.width * 0.5, this.game.scale.height * 0.35));

    }



    if (this.testSprite) {
      this.testSprite.x = this.game.scale.width / 2;
      this.testSprite.y = this.game.scale.height;
      this.testSprite.width = this.game.scale.width * 2;

    }

    if (this.background) {
      this.background.setSize(this.game.scale.width, this.game.scale.height);

      console.log(this.background.getBounds());
    }

    if (this.buttons && this.buttons.length > 0) {
      for (let i = 0; i < this.buttons.length; i++) {
        this.buttons[i].y = this.game.scale.height - 20;
        this.buttons[i].x = (i + 0.5) * this.game.scale.width / this.buttons.length + 1;
      }
    }
  }

  update(time: number, delta: number) {
    super.update(time, delta);

    this.shaderTime += delta / 1000;

    for (let i = 0; i < this.shaders.length; i++) {
      this.shaders[i].shader.time = this.shaderTime;
      this.shaders[i].shader.res = {x: this.game.scale.width,y: this.game.scale.height}

      // this.setText(Math.random().toString());
    }
  }
  moveText(pointer: PointerEvent) {
    if (this.testFont && pointer) {
      this.testFont.x = pointer.x;
      this.testFont.y = pointer.y;
    }
  }

  shutdown() {
    super.shutdown();
  }
}
