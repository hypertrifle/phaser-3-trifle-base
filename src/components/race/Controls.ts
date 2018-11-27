import Car from "./Car";
import { ViewPortSettings } from "./TrackSystem";
import DriveScene from "../../scenes/Drive";

enum ControlMode {
   CLASSIC = "CLASSIC",
   TANK = "TANK_STYLE"
   }

   export class ControlSystemSettings {
     mode: ControlMode;
     verticleAnalougeMin: number = 0;
     verticleAnalougeMax: number = 0;
     horizontalAnalougeMin: number = 0;
     horizontalAnalougeMax: number = 0;
   }

export class ControlSystem {
   settings: ControlSystemSettings;
   private _viewPort: ViewPortSettings;

   leftAnalougePosition: number;
   righAnalougePosition: number;

   steeringPosition: number;
   accelleratorButton: Boolean = false;
   brakeButton: Boolean = false;
   cursors: Phaser.Input.Keyboard.CursorKeys;

   cursorValues: Phaser.Geom.Point;


   get currentXVector(): number {
     return this.cursorValues.x;


  }
   get currentYVector(): number {
    return this.cursorValues.y;

   }


   constructor(scene: Phaser.Scene, viewportSettings: ViewPortSettings) {
      console.log("ControlSystem::contructor");
      this._viewPort = viewportSettings;
      this.settings = new ControlSystemSettings();

      this.cursorValues = new Phaser.Geom.Point(0,0);

      if (this.settings.mode === ControlMode.TANK) {

      }

      this.cursors = scene.input.keyboard.createCursorKeys();
      scene.input.addPointer(); // second pointer


      this.leftButton = scene.add.image(0,0,"button");
      this.leftButton.setOrigin(0,0);

      this.rightButton = scene.add.image(640,0,"button");
      this.rightButton.setOrigin(1,0);

      this.rightButton.alpha = this.leftButton.alpha = 0.001;

      this.rightButton.setInteractive();
      this.rightButton.on("pointerdown", this.rightPointerDown.bind(this));
      this.rightButton.on("pointerup", this.rightPointerUp.bind(this));

      this.leftButton.setInteractive();
      this.leftButton.on("pointerdown", this.leftPointerDown.bind(this));
      this.leftButton.on("pointerup", this.leftPointerUp.bind(this));


   }

   leftButtonValue: boolean = false;
   rightButtonValue: boolean = false;

   leftPointerDown() {
     console.log("leftPointerDown");
     this.leftButtonValue = true;
   }

   leftPointerUp() {
    console.log("leftPointerUp");
    this.leftButtonValue = false;

  }

   rightPointerDown() {
     console.log("rightPointerDown");
     this.rightButtonValue = true;

   }

   rightPointerUp() {
    console.log("rightPointerUp");
    this.rightButtonValue = false;

  }

   rightButton: Phaser.GameObjects.Image;
   leftButton: Phaser.GameObjects.Image;

   pointerDown(e: TouchEvent) {
      console.log("TouchEvent",e);
   }

   right: Phaser.Input.Pointer;
   left: Phaser.Input.Pointer;

   private registerTouchEventControl(pointer: Phaser.Input.Pointer, scene: DriveScene) {
    if (pointer.downX < scene.dimensions.x / 2) {
      // handle this as a left
      this.left = pointer;
    } else {
      this.right = pointer;
    }
  }


   update(time: number, delta: number, car: Car, scene: DriveScene) {
      // console.log("controls update");


      //   if(scene.input.pointer1.isDown){
      //     this.registerTouchEventControl(scene.input.pointer1, scene);
      //   }

      //   if(scene.input.pointer2.isDown){
      //     this.registerTouchEventControl(scene.input.pointer1, scene);
      //   }

      //   if(this.left !== undefined && this.right !== undefined && scene.input.pointer1.isDown && scene.input.pointer2.isDown){
      //     // console.log("controls to update.")



      //     /*

      //     let controlBounts:number = 50;

      //     let inputZeroLeft = scene.dimensions.y / 2; //this.left.downY
      //     let inputZeroRight = scene.dimensions.y / 2; //this.right.downY

      //     let changeInY = ((inputZeroLeft - this.left.y) + (inputZeroRight - this.right.y)) /2;
      //     changeInY = Math.max(-controlBounts,changeInY);
      //     changeInY = Math.min(controlBounts,changeInY);
      //     changeInY = changeInY/controlBounts;


      //     let changeInX = ((inputZeroLeft - this.left.y) + (inputZeroRight - this.right.y)) /2;
      //     changeInX = Math.max(-controlBounts,changeInX);
      //     changeInX = Math.min(controlBounts,changeInX);
      //     changeInX = changeInX/controlBounts;

      //     console.log(changeInY, changeInX);

      //     this.cursorValues.y = Math.min(1, this.cursorValues.y+(0.05*changeInY));
      //     this.cursorValues.y = Math.max(-1, this.cursorValues.y);

      //     this.cursorValues.x = Math.min(1, this.cursorValues.x+(0.05*changeInX));
      //     this.cursorValues.x = Math.max(-1, this.cursorValues.x);

      //     */







      //   if(this.left.isDown && !this.right.isDown){
      //     this.cursorValues.y = Math.min(1, this.cursorValues.y+0.05*0.5);
      //     this.cursorValues.x = Math.max(-1, this.cursorValues.x-0.01);

      //   } else if (!this.left.isDown && this.right.isDown) {
      //     this.cursorValues.y = Math.min(1, this.cursorValues.y+0.05*0.5);
      //     this.cursorValues.x = Math.min(1, this.cursorValues.x-0.01);
      //   } else if(this.left.isDown && this.right.isDown) {
      //     this.cursorValues.y = Math.min(1, this.cursorValues.y+0.05);

      //   } else if(!this.left.isDown && !this.right.isDown) {
      //     this.cursorValues.y = Math.min(1, this.cursorValues.y+0.05);

      //   }

      // }



      if (scene.game.device.os.iOS || scene.game.device.os.android) {

      if (this.leftButtonValue && this.rightButtonValue) {

        this.cursorValues.y = Math.min(1, this.cursorValues.y + 0.05);

      } else if (!this.leftButtonValue && !this.rightButtonValue) {

        this.cursorValues.y = Math.max(-1, this.cursorValues.y - 0.05);

      } else if (this.leftButtonValue || this.rightButtonValue) {
        this.cursorValues.y = Math.max(-1, this.cursorValues.y - 0.05);
      } else {
        this.cursorValues.y *= 0.8;

      }

      if (this.leftButtonValue && !this.rightButtonValue) {
        this.cursorValues.x = Math.max(-1, this.cursorValues.x - 0.05);

      } else if (!this.leftButtonValue && this.rightButtonValue) {
        this.cursorValues.x = Math.min(1, this.cursorValues.x + 0.05);
      } else {
        this.cursorValues.x *= 0.5;
      }

    } else {
  if (this.cursors.up.isDown) {
        this.cursorValues.y = Math.min(1, this.cursorValues.y + 0.05);
      } else if (this.cursors.down.isDown) {
        this.cursorValues.y = Math.max(-1, this.cursorValues.y - 0.05);
      } else {
        this.cursorValues.y *= 0.8;
      }

      if (this.cursors.right.isDown) {
        this.cursorValues.x = Math.min(1, this.cursorValues.x + 0.01);
      } else if (this.cursors.left.isDown) {
        this.cursorValues.x = Math.max(-1, this.cursorValues.x - 0.01);
      } else {
        this.cursorValues.x *= 0.5;
      }

    }










   }



 }