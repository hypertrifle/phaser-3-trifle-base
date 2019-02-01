import BaseScene from "./BaseScene";
import SheneEffect from "../utils/effects/SheneEffect";
import { GUI } from "dat.gui";
import BaseEffect from "../utils/effects/BaseEffect";
import RetroTextEffect from "../utils/effects/RetroTextEffects";
import WaveFillEffect from "../utils/effects/WaveFillEffect";

export default class PostEffectTestsScene extends BaseScene {
  shaderTime: number = 0;
  tree: Phaser.GameObjects.Image;
  testSprite: Phaser.GameObjects.Image;
  shaders: { shader: BaseEffect; id: string }[];

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

  initShader() {
    this.shaders = [];

    // create our background shader pipline.
    let postShader: SheneEffect = new SheneEffect(this.game, "glint", {
      speed: 1.5,
      size: 0.3,
      delay: 3,
      colour: { r: 255, g: 255, b: 255 }
    });
    let postDebug = this.debugGUI.addFolder("Glint");
    postDebug.add(postShader, "size", 0, 0.2);
    postDebug.add(postShader, "speed", 0, 5);
    postDebug.add(postShader, "delay", 0, 10);
    postDebug.addColor(postShader, "colour");

    let textShader: RetroTextEffect = new RetroTextEffect(this.game, "text");


    let fullFillShader: WaveFillEffect = new WaveFillEffect(this.game,"fill" );

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

  initDebugTools() {
    this.debugGUI = new GUI();
  }

  testFont: Phaser.GameObjects.BitmapText;
  testFont2: Phaser.GameObjects.BitmapText;

  create() {
    super.create();
    // this.cameras.main.setZoom(2);
    this.initDebugTools();
    this.initShader();

    this.testFont = this.add.dynamicBitmapText(
      this.dimensions.x / 2,
      30,
      "lot",
      "SCOOP",
      128
    );

    this.testFont.setCenterAlign();
    this.testFont.setOrigin(0.5, 0);
    this.testFont.setPipeline("text");
    this.text = "some\ntext";

    let textDebug = this.debugGUI.addFolder("Text");
    textDebug.add(this, "text", 0, 0.2);

    // this.testSprite = this.add.image(
    //   this.dimensions.x / 2,
    //   this.dimensions.y - 10,
    //   "atlas.png",
    //   "test-sprite-2.png"
    // );
    // this.testSprite.setScale(1);
    // this.testSprite.setOrigin(0.5, 1);
    // this.testSprite.setPipeline("glint");

    console.log("PostEffectTestsScene::Create");
    // this.cameras.main.setBounds(0, 0, this.game.canvas.width, this.game.canvas.height);
    // this.cameras.main.setZoom(16);

    // this.input.on('pointermove', this.moveText,this);
  }

  onLetterCallback(wut: any) {
    return wut;
  }

  set text(text: string) {
    this.testFont.text = text;
    let bounds: BitmapTextSize = this.testFont.getTextBounds();
    this.setUniformsForText(this.testFont);
  }

  get text(): string {
    return "";
  }

  setUniformsForText(object: Phaser.GameObjects.BitmapText): void {
    let bounds: BitmapTextSize = object.getTextBounds();
    object.pipeline.setFloat2("offset", bounds.global.x, bounds.global.y);
    object.pipeline.setFloat2(
      "size",
      bounds.global.width,
      bounds.global.height
    );
  }

  redraw() {
    super.redraw();
    if (this.testFont) {
      this.testFont.x = this.dimensions.x / 2;
      this.setUniformsForText(this.testFont);
    }

    if (this.testSprite) {
      this.testSprite.x = this.dimensions.x / 2;
      this.testSprite.y = this.dimensions.y - 10;
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
