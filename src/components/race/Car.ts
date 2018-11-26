import DriveScene from "../../scenes/Drive";

export interface CarConfig extends SpriteConfig {
   positionFromBottom:number;
   scale:number;
}

export default class Car extends Phaser.GameObjects.Sprite {

   private _scene:DriveScene;
   private _config: CarConfig;

   constructor(scene:Phaser.Scene, config:CarConfig){
      super(scene, 0,0, "car");
      this._scene = scene as DriveScene;
      this._config = config;

      this.setOrigin(0.5,1);

      this.setPosition(this._scene.dimensions.x/2, this._scene.dimensions.y - this._config.positionFromBottom);

      this.scene.add.existing(this);
   }

}