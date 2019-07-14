import { GameObjects } from "phaser";
import PingScene, { IGameplaySettings } from "../../scenes/PingScene";



export interface IPlayerConfig {
   intialX: number;
   intialY: number;
   skin: string;
   team: number;
   controls: Phaser.Input.Gamepad.Gamepad;
}


export interface SpineGameObject extends GameObjects.Image {
   skeleton: spine.Skeleton;
   stateData: spine.AnimationStateData;
   timeScale: number;
   getAnimationList: () => string[];
   play: (animationName: string, loop: boolean) => void;
}



export default class Player extends GameObjects.GameObject {

   playerBox: GameObjects.Rectangle;
   hitBox: GameObjects.Rectangle
   _visual: PlayerVisual;
   config: IPlayerConfig;
   _gamePad: Phaser.Input.Gamepad.Gamepad;
   team: number;

   spineModel: SpineGameObject;


   jumpTime: number = 0;
   hitCharge: number = 0;
   activeFrames: number = Number.MAX_SAFE_INTEGER;

   constructor(scene: PingScene, config: IPlayerConfig) {
      super(scene, 'player');

      console.log("Player::constructor");

      this._gamePad = config.controls;

      this.team = config.team;

      //set up out collider what we use to interact with the ball
      this.hitBox = scene.add.rectangle(config.intialX, config.intialY, -150, -350, 0xff0000, 1);
      scene.physics.world.enableBody(this.hitBox, Phaser.Physics.Arcade.STATIC_BODY);

      //disable for now.
      this.hitBox.active = false;
      this.hitBox.alpha = 0;



      //set up our body, which touches walls, basis of moment and where we get it from
      this.playerBox = scene.add.rectangle(config.intialX, config.intialY, 120, 220, 0xffffff, 0);
      scene.physics.world.enableBody(this.playerBox, Phaser.Physics.Arcade.DYNAMIC_BODY);


      //we will always want to collide our body with world bounds.
      (this.playerBox.body as Phaser.Physics.Arcade.Body).setCollideWorldBounds(true);

      //@ts-ignore
      this.spineModel = scene.add.spine(200, 400, 'gary', "idle", true);

      this.spineModel.timeScale = 1;
      this.spineModel.stateData.defaultMix=0.2;
      this.spineModel.getAnimationList();

      console.log(this.spineModel)


      this.spineModel.on("spine.event", (s: SpineGameObject, track: spine.TrackEntry, event: string) => {
         // console.log("spine.event",s,track, event);

      })


      this.spineModel.on("spine.complete", (s: SpineGameObject, track: spine.TrackEntry) => {
         // console.log("spine.complete",s,track);

         if(!track.loop && track.animation.name !== "charge"&& track.animation.name !== "jump"){
            this.spineModel.play("idle", true);
         }
      })
      this.spineModel.on("spine.start", (s: SpineGameObject, track: spine.TrackEntry) => {
         // console.log("spine.start",s,track);

      })
      this.spineModel.on("spine.end", (s: SpineGameObject, track: spine.TrackEntry) => {
         // console.log("spine.end",s,track);

      });


      console.log(this.spineModel);


      // scene.add.existing(this.playerBox);
      // scene.add.existing(this.hitBox);
   }

   updateHitLogic(config: IGameplaySettings) {
      let buttonPressed = this._gamePad.X;

      this.hitBox.setPosition(this.playerBox.x, this.playerBox.y)

      if (buttonPressed) {
         this.hitCharge = Math.min(config.maxHitCharge, this.hitCharge + 1);
         //reset active frames
         this.activeFrames = 0;

         // we release hit TODO:cooldown
         this.hitBox.active = true;
      } else {
         //hand up

         if (this.hitCharge > 0 && this.activeFrames === 0) {
            console.log("start attack");

            // update hit visual?
            this.hitBox.alpha = 1;

            // reset hitCharge
            this.hitCharge = 0;

         } else if (this.activeFrames === config.hitActiveFrames) {

            //end hit
            this.hitBox.active = false;
            //update hit visual?
            this.hitBox.alpha = 0;
         }


         this.activeFrames++;

      }
   }

   updateMovement(config: IGameplaySettings) {


      if (this.hitCharge > 0) {
         (this.playerBox.body as Phaser.Physics.Arcade.Body).setDragX(300);
         (this.playerBox.body as Phaser.Physics.Arcade.Body).setMaxVelocity(700, 700); // nice idea, needs lerping ans teaking of physics

      } else {
         (this.playerBox.body as Phaser.Physics.Arcade.Body).setDragX(10000);

         (this.playerBox.body as Phaser.Physics.Arcade.Body).setMaxVelocity(2000, 10000);

      }

      //first update our jump logic


      this.updateJumpLogic(config);




      (this.playerBox.body as Phaser.Physics.Arcade.Body).setAccelerationX(this._gamePad.leftStick.x * 50000);

   }

   updateJumpLogic(config: IGameplaySettings) {

      let jumpState = this._gamePad.A;

      if (this.jumpTime === -1 && jumpState) {
         this.jumpTime++;

         //apply initial jump force
         (this.playerBox.body as Phaser.Physics.Arcade.Body).velocity.y = -2000;
      }

      if (jumpState && this.jumpTime >= 0 && this.jumpTime < 10) {
         //apply jump for diminished by time
         console.log("jump");
         (this.playerBox.body as Phaser.Physics.Arcade.Body).velocity.y += -600 * (this.jumpTime / 10);

      }


      this.jumpTime++;







      if ((this.playerBox.body as Phaser.Physics.Arcade.Body).onFloor() && !jumpState) {
         this.jumpTime = -1;
      }


   }


   updatePlayerVisuals(config: IGameplaySettings) {

      this.spineModel.setPosition(this.hitBox.x, this.hitBox.y);

      if(this.jumpTime === 1){
      this.spineModel.play("jump", false);
      } else if(this.jumpTime = -1){
         // this.spineModel.play("idle",true);
      }

      if(this.hitCharge === 1){
      this.spineModel.play("charge", false);
      }
      //update our hit box / visuals
      if (this.hitBox.active) {
         // console.log(this.activeFrames);
         if(this.activeFrames === 1){
            this.spineModel.play("whack", false);
         }
         this.hitBox.alpha = (config.hitActiveFrames - this.activeFrames) / config.hitActiveFrames;
      } else {
         this.hitBox.alpha = 0;
      }
   }

}

export class PlayerVisual extends GameObjects.Sprite {
   constructor(scene: PingScene, config: IPlayerConfig) {
      super(scene, config.intialX, config.intialY, config.skin);
   }
}
