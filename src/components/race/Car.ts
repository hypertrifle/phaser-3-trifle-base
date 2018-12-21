import Drive2Scene from "../../scenes/Drive2";

export interface CarConfig extends SpriteConfig {
   positionFromBottom: number;
   scale: number;
}

export default class Car extends Phaser.GameObjects.Sprite {

   private _scene: Drive2Scene;
   private _config: CarConfig;

   private _rumbleLeft:Phaser.GameObjects.Image;
   private _rumbleRight:Phaser.GameObjects.Image;

   private _rumbleStep:number = 0;
   private _rumbleAmount:number = 0;

   constructor(scene: Phaser.Scene, config: CarConfig) {
      super(scene, 0,0, "atlas.png", "car_neutral.png");
      this._scene = scene as Drive2Scene;
      this._config = config;

      this.setOrigin(0.5,0.9);

      this.setScale(config.scale,config.scale)

      this.setPosition(this._scene.dimensions.x / 2, this._scene.dimensions.y - this._config.positionFromBottom);

      this.scene.add.existing(this);

      this._rumbleLeft = scene.add.image(0,0,"atlas.png", "skid_00001.png");
      this._rumbleLeft.setOrigin(0,0.8);

      this._rumbleLeft.setScale(2)
      
      this._rumbleRight = scene.add.image(0,0,"atlas.png", "skid_00001.png");
      this._rumbleRight.setOrigin(1,0.8);
      this._rumbleRight.setFlipX(true);
      
      this._rumbleRight.setScale(2)

   }

   rumble(){
      this._rumbleStep ++;
      if(this._rumbleStep > 4*7){
         this._rumbleStep = 0;
         this._rumbleAmount = Math.random()*0.02;
      }

         this._rumbleLeft.visible = true;
         this._rumbleRight.visible = true;

      this.setOrigin(0.5,0.9+this._rumbleAmount);

         let frame = Math.floor(this._rumbleStep / 4.1);
      
         this._rumbleLeft.setFrame("skid_0000"+frame+".png");
         this._rumbleRight.setFrame("skid_0000"+frame+".png");
   

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
      this._rumbleLeft.visible = false;
      this._rumbleLeft.x = this.x-100;
      this._rumbleLeft.y = this.y;

      this._rumbleRight.visible = false;
      this._rumbleRight.x = this.x+100;
      this._rumbleRight.y = this.y;
   }

}