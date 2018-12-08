import Car from "./Car";
import { ViewPortSettings } from "./TrackSystem";
import DriveScene from "../../scenes/Drive";
import BaseScene from "../../scenes/BaseScene";
import Drive2Scene from "../../scenes/Drive2";

enum ControlMode {
   CLASSIC = "CLASSIC",
   TANK = "TANK_STYLE"
   }

   export class ControlSystemSettings {
     mode: ControlMode = ControlMode.CLASSIC;
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

   owner:Drive2Scene;


   get currentXVector(): number {
     return this.cursorValues.x;


  }
   get currentYVector(): number {
    //  console.log(this.cursorValues.y)
    return this.cursorValues.y;

   }


   constructor(scene: Phaser.Scene) {
      console.log("ControlSystem::contructor");
      this.settings = new ControlSystemSettings();

      this.cursorValues = new Phaser.Geom.Point(0,0);

      if (this.settings.mode === ControlMode.TANK) {

      }

      this.owner = scene as Drive2Scene;

      this.cursors = scene.input.keyboard.createCursorKeys();
      scene.input.addPointer(); // second pointer


      // this.leftButton = scene.add.graphics({});
      // this.leftButton.fillStyle(0xff00aa, 0);
      // this.leftButton.fillRect(0,0,this.owner.dimensions.x/2, this.owner.dimensions.y);

      // this.rightButton = scene.add.graphics({});
      // this.rightButton.fillStyle(0xff00aa, 0);
      // this.rightButton.fillRect(this.owner.dimensions.x/2,0,this.owner.dimensions.x/2, this.owner.dimensions.y);

      // // this.rightButton.alpha = this.leftButton.alpha = 1;

      
      // this.leftButton.setInteractive(new Phaser.Geom.Rectangle(0,0,this.owner.dimensions.x/2, this.owner.dimensions.y),Phaser.Geom.Rectangle.Contains);
      // this.leftButton.on("pointerdown", this.leftPointerDown.bind(this));
      // this.leftButton.on("pointerup", this.leftPointerUp.bind(this));
      
      // this.rightButton.setInteractive(new Phaser.Geom.Rectangle(this.owner.dimensions.x/2,0,this.owner.dimensions.x/2, this.owner.dimensions.y), Phaser.Geom.Rectangle.Contains);
      // this.rightButton.on("pointerdown", this.rightPointerDown.bind(this));
      // this.rightButton.on("pointerup", this.rightPointerUp.bind(this));
      
      // console.log(this.rightButton, this.leftButton);

   }

   leftButtonValue: boolean = false;
   rightButtonValue: boolean = false;

   leftPointerDown() {
    //  console.log("leftPointerDown");
     this.leftButtonValue = true;
   }

   leftPointerUp() {
    // console.log("leftPointerUp");
    this.leftButtonValue = false;

  }

   rightPointerDown() {
    //  console.log("rightPointerDown");
     this.rightButtonValue = true;

   }

   rightPointerUp() {
    // console.log("rightPointerUp");
    this.rightButtonValue = false;

  }

  handlePointer(pointer:Phaser.Input.Pointer){
    if(pointer.isDown){




      if(pointer.position.x< 320){
        // left
        this.cursorValues.x = Math.max(-1, this.cursorValues.x - 0.1);
      } else {
        //right
        this.cursorValues.x = Math.min(1, this.cursorValues.x + 0.1);
      }


      let accel = ((pointer.position.y/this.owner.dimensions.y) - 0.5)*-3;
      accel = Math.max(-1,accel);
      accel = Math.min(1,accel);

      console.log(accel);

      this.cursorValues.y = Math.max(-1, Math.min(1, this.cursorValues.y + (0.05*accel)));



    }

  }

   update(time: number, delta: number, car: Car, scene: BaseScene) {
  
      if (scene.game.device.os.iOS || scene.game.device.os.android) {
        this.handlePointer(scene.input.pointer1);
        this.handlePointer(scene.input.pointer2);

        if(!scene.input.pointer1.isDown && !scene.input.pointer2.isDown ){
           this.cursorValues.y = Math.max(-1, this.cursorValues.y - 0.01);
        }

        if(scene.input.pointer1.isDown === scene.input.pointer2.isDown ){
          this.cursorValues.x *= 0.5;
        }
    } else {

      // cursor / desktop.
  if (this.cursors.up.isDown) {
        this.cursorValues.y = Math.min(1, this.cursorValues.y + 0.1);
      } else if (this.cursors.down.isDown) {
        this.cursorValues.y = Math.max(-1, this.cursorValues.y - 0.1);
      } else {
        this.cursorValues.y = Math.max(-1, this.cursorValues.y - 0.05);
      }

      if (this.cursors.right.isDown) {
        this.cursorValues.x = Math.min(1, this.cursorValues.x + 0.1);

      } else if (this.cursors.left.isDown) {
    
        this.cursorValues.x = Math.max(-1, this.cursorValues.x - 0.1);
    
      } else {
        this.cursorValues.x *= 0.5;
      }

    }

  }

 }