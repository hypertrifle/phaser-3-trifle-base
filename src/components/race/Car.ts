import DriveScene from "../../scenes/Drive";

export interface CarConfig extends SpriteConfig {
   positionFromBottom: number;
   scale: number;
}

export default class Car extends Phaser.GameObjects.Sprite {

   private _scene: DriveScene;
   private _config: CarConfig;

   constructor(scene: Phaser.Scene, config: CarConfig) {
      super(scene, 0,0, "atlas.png", "car_neutral.png");
      this._scene = scene as DriveScene;
      this._config = config;

      this.setOrigin(0.5,1);

      this.setScale(config.scale,config.scale)

      this.setPosition(this._scene.dimensions.x / 2, this._scene.dimensions.y - this._config.positionFromBottom);

      this.scene.add.existing(this);

      
   }


   get bounds():Phaser.Geom.Rectangle {
      let b = this.getBounds();

      b.y += 30;
      b.height -= 60;

      b.x += 30;
      b.width -= 60;

      return b;
   }

}