import DriveScene from "../../scenes/Drive";

export interface CarConfig extends SpriteConfig {
   positionFromBottom: number;
   scale: number;
}

export default class Car extends Phaser.GameObjects.Sprite {

   private _scene: DriveScene;
   private _config: CarConfig;

   private _rumble:Phaser.GameObjects.Image;

   private _rumbleStep:number = 0;
   private _rumbleAmount:number = 0;

   constructor(scene: Phaser.Scene, config: CarConfig) {
      super(scene, 0,0, "atlas.png", "car_neutral.png");
      this._scene = scene as DriveScene;
      this._config = config;

      this.setOrigin(0.5,0.9);

      this.setScale(config.scale,config.scale)

      this.setPosition(this._scene.dimensions.x / 2, this._scene.dimensions.y - this._config.positionFromBottom);

      this.scene.add.existing(this);

      this._rumble = scene.add.image(0,0,"atlas.png", "car_smoke0.png");
      this._rumble.setOrigin(0.5,0.8);

      
   }

   rumble(){
      this._rumbleStep ++;
      if(this._rumbleStep > 3){
         this._rumbleStep = 0;
         this._rumbleAmount = Math.random()*0.02;
      }

      if(this._rumbleAmount > 0.01){
         this._rumble.visible = true;
      }

      this.setOrigin(0.5,0.9+this._rumbleAmount);
      
      if(this._rumbleStep > 0 && this._rumbleStep< 3 ){
         this._rumble.setFrame("car_smoke0.png");
      } else {
         this._rumble.setFrame("car_smoke1.png");

      }

   }

   resetRumble(){
      this.setOrigin(0.5,0.9);

   }


   get bounds():Phaser.Geom.Rectangle {
      let b = this.getBounds();

      b.y += 30;
      b.height -= 60;

      b.x += 30;
      b.width -= 60;

      return b;
   }

   update(delta:number){
      console.log("carupdate");

      this._rumble.visible = false;
      this._rumble.x = this.x;
      this._rumble.y = this.y;
   }

}