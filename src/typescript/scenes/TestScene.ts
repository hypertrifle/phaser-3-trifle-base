import BaseScene from "../core/scenes/BaseScene";




export default class TestScene extends BaseScene {

   private _polyTest: Phaser.GameObjects.Polygon;

   constructor() {
      super({
         key: "TestScene",
         active: false
      });
   }

   preload(): void {

      this.load.image("asset")

   }


   create(): void {
      super.create();
      console.log("TestScene::create");


      this._polyTest = this.add.polygon(100, 100, '50 0 63 38 100 38 69 59 82 100 50 75 18 100 31 59 0 38 37 38', 0xffffff, 1);

      console.log(this._polyTest);

      this.add.text(55, 200, this.debugString(), this.tools.data.ui.fonts.debug);

      this.tools._boot.lazyLoadPhaserScene("PhysicsTestsScene", false);

   }

   debugString(): string {
      return `
Version:       ${this.tools.data.save.identifier}
Camera Size:   ${this.cameras.main.width} , ${this.cameras.main.height}
Window Size:   ${window.innerWidth} , ${window.innerHeight}
      `
   }
}

