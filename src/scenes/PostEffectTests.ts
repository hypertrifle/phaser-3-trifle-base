import BaseScene from "./BaseScene";
import SheneEffect from "../utils/effects/SheneEffect";
import { GUI } from "dat.gui";
import BaseEffect from "../utils/effects/BaseEffect";
import RetroTextEffect from "../utils/effects/RetroTextEffects";
import WaveFillEffect from "../utils/effects/WaveFillEffect";
import { bestFit } from "../utils/Utils";

export default class PostEffectTestsScene extends BaseScene {
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
      speed: 2,
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
  background: Phaser.GameObjects.Graphics;

  create() {
    super.create();

    this.initShaders();



    this.background = this.add.graphics({
      x: 0,
      y: 0
    });

    this.background.setPipeline("fill");

    // this.testSprite = this.add.tileSprite(0,this.dimensions.y - 209,this.dimensions.x,209,
    //   "atlas.png",
    //   "near-buildings-bg.png"
    // );
    // this.testSprite.setScale(1);
    // this.testSprite.setOrigin(0.5, 1);
    // this.testSprite.setPipeline("glint");


        // // // add our title
        // this.testFont = this.add.dynamicBitmapText(
        //   this.dimensions.x / 2,
        //   30,
        //   "lazer",
        //   "SCOOP",
        //   128
        // );

        // this.testFont.setCenterAlign();
        // this.testFont.letterSpacing += 10;
        // this.testFont.setOrigin(0.0, 0.5);
        // this.testFont.setPipeline("text");
        // this.text = "HYPER\nTRIFLE";


        if (this.tools.debugGUI) {
          let textDebug = this.tools.debugGUI.addFolder("Text");
          textDebug.add(this, "text", 0, 0.2);
        }

        this.buttons = [];

        let links = ["SKILLS", "DEMOS", "EMAIL", "LinkedIN"];

        let fontStyle: any = {
         fontFamily: "porticovintage",
         fontSize: "32px",
         color: "#ffffff",
         align: "center"
    };

        for (let i = 0; i < links.length; i ++) {
          this.buttons.push(
            this.add.text(0,0,links[i],fontStyle)
          );

          this.buttons[i].setOrigin(0.5,0.5);
          this.buttons[i].setInteractive();
          this.buttons[i].on("pointerover", this.overBaseButton);
        }
        this.redraw();

  }
  overBaseButton(e: PointerEvent,x: number, y: number,button: Phaser.GameObjects.Image) {
    console.log(e, button);
  }

  onLetterCallback(wut: any) {
    return wut;
  }

  set text(text: string) {
    this.testFont.text = text.toUpperCase();
    let bounds: BitmapTextSize = this.testFont.getTextBounds();
    //  this.setUniformsForText(this.testFont);
    this.redraw();
  }

  get text(): string {
    return "";
  }

  setUniformsForText(object: Phaser.GameObjects.BitmapText): void {
    let bounds: BitmapTextSize = object.getTextBounds();

    object.pipeline.setFloat2("resolution", bounds.global.x - this.dimensions.x, bounds.global.y - this.dimensions.y);
    object.pipeline.setFloat2(
      "size",
      this.testFont.width / this.testFont.scaleX,
      this.testFont.height / this.testFont.scaleY
    );

    // console.log(object.pipeline);





  }

  redraw() {
    super.redraw();

    if (this.testFont) {
      this.testFont.x = this.dimensions.x * 0.05;
      this.testFont.y = this.dimensions.y / 5;
      this.testFont.setScale(bestFit(this.testFont.width / this.testFont.scaleX,this.testFont.height / this.testFont.scaleY,this.dimensions.x * 0.5, this.dimensions.y * 0.35));
      this.setUniformsForText(this.testFont);
    }

    if (this.testSprite) {
      this.testSprite.x = this.dimensions.x / 2;
      this.testSprite.y = this.dimensions.y;
      this.testSprite.width = this.dimensions.x * 2;

    }

    if (this.background) {
      this.background.fillStyle(0xffffff,1);
      this.background.clear();
      this.background.fillRect(0,0,this.dimensions.x, this.dimensions.y);

    }

    if (this.buttons && this.buttons.length > 0) {
      for (let i = 0; i < this.buttons.length; i++) {
        this.buttons[i].y = this.dimensions.y * 0.95;
        this.buttons[i].x = (i + 0.5) * this.dimensions.x / this.buttons.length + 1;
      }
    }
  }

  update(time: number, delta: number) {
    super.update(time, delta);

    this.shaderTime += delta / 1000;

    for (let i = 0; i < this.shaders.length; i++) {
      this.shaders[i].shader.setFloat1("time", this.shaderTime);

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
