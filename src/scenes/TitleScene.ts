import GameData from "../plugins/global/GameData";
import Sponge from "../plugins/global/Sponge";
import { TitleSceneModel } from "../models/TitleSceneModel";

export default class TitleScreen extends Phaser.Scene {
  /**
   * data model for this class, define so everything is in order.
   *
   * @type {TitleScreenModel}
   * @memberof TitleScreen
   */
  sceneDataModel: TitleSceneModel;

  /**
   * reference to our spong tools.
   *
   * @type {SpongeUtils}
   * @memberof TitleScreen
   */
  sponge: Sponge;

  constructor() {
    super({
      key: "TitleScene",
      active: false
    });
    console.log("TitleScene::constructor");
  }

  preload() {
    console.log("titleScene::preload");
    // grab our utils
  }

  /**
   *a layer for background objects, remember these can still be sorted as well
   *
   * @type {Phaser.GameObjects.Container}
   * @memberof TitleScreen
   */
  backgroundLayer: Phaser.GameObjects.Container;

  create() {
    // grab our data for this model.
    this.sponge = this.sys.plugins.get("sponge") as Sponge; // cas

    console.log(this.sponge);
    this.sceneDataModel = this.sponge.data.getDataFor(
      "titleScene"
    ) as TitleSceneModel; // cast

    // create a background layer for objects that exist in BG.
    this.backgroundLayer = new Phaser.GameObjects.Container(this);

    // create a sprite that we can apply our pipline to.
    let g: Phaser.GameObjects.Graphics = this.make.graphics({
      x: 0,
      y: 0,
      add: false
    });
    g.fillStyle(parseInt(this.sceneDataModel.backgroundColor), 1);
    g.fillRect(
      0,
      0,
      this.sponge.scale.percentX(100),
      this.sponge.scale.percentY(100)
    );
    g.generateTexture("titlescreen_texture");

    let background: Phaser.GameObjects.Image = this.add.image(
      0,
      0,
      "titlescreen_texture"
    );
    // background.setPipeline("custom_background");
    background.x = 0;
    background.setOrigin(0, 0);

    this.add.image(
      (this.game.config.width as number) / 2,
      (this.game.config.height as number) / 2,
      "test.svg"
    );
  }

  update(time: number, delta: number) {
    super.update(time, delta);
  }

  shutdown() {}
}
