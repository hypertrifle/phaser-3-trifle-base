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

   classicSteer:Phaser.GameObjects.GameObject;
   steerOrigin:number;
   steerCurrent:number;
   steerActive:boolean;
   classicA:Phaser.GameObjects.GameObject;
   classicB:Phaser.GameObjects.GameObject;


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
      this.owner = scene as Drive2Scene;

      this.cursorValues = new Phaser.Geom.Point(0,0.05);

      if (this.settings.mode === ControlMode.TANK) {

      }

      


      this.cursors = scene.input.keyboard.createCursorKeys();
      scene.input.addPointer(); 
      
      if(this.owner.game.device.os.android || this.owner.game.device.os.iOS){
        if(this.settings.mode === ControlMode.CLASSIC ){
          
          this.classicSteer = this.owner.add.rectangle((this.owner.dimensions.x/4) * 3,(this.owner.dimensions.y/4) * 3, this.owner.dimensions.x/2,this.owner.dimensions.y/2,0xFFAA00,0.3);
          
          this.classicSteer.setInteractive();
          this.classicSteer.on("pointerdown", this.steerPointerDown, this);
          this.classicSteer.on("pointermove", this.steerPointerMove, this);
          this.classicSteer.on("pointerup", this.steerPointerUp, this);

          this.classicA = this.owner.add.rectangle((this.owner.dimensions.x/8) * 1,(this.owner.dimensions.y/8) * 7, (this.owner.dimensions.x/8) * 2,(this.owner.dimensions.y/8) * 2,0x00FFAA,0.3);
          this.classicA.setInteractive();
          this.classicA.on("pointerdown", this.leftPointerDown, this);
          this.classicA.on("pointerup", this.leftPointerUp, this);



          this.classicB = this.owner.add.rectangle((this.owner.dimensions.x/16) * 3,(this.owner.dimensions.y/8) * 5, (this.owner.dimensions.x/8) * 2,(this.owner.dimensions.y/8) * 2,0xff00AA,0.3);
          this.classicB.setInteractive();
          this.classicB.on("pointerdown", this.rightPointerDown, this);
          this.classicB.on("pointerup", this.rightPointerUp, this);


        }
      }
     


   }

   steerPointerDown(e:PointerEvent){
      // console.log("controls::steerPointerDown",e);
      this.steerActive = true;
      this.steerOrigin = e.x;
      this.steerCurrent = e.x;

   }
   steerPointerMove(e:PointerEvent){
    // console.log("controls::steerPointerMove",e);


    this.steerCurrent = e.x;


   }
   steerPointerUp(e:PointerEvent){
    // console.log("controls::steerPointerUp",e);
    this.steerActive = false;
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

      // console.log(accel);



      this.cursorValues.y = Math.max(-1, Math.min(1, this.cursorValues.y + (0.05*accel)));



    }

  }

   update(time: number, delta: number, car: Car, scene: BaseScene) {
  
      if (scene.game.device.os.iOS || scene.game.device.os.android) {


        if(this.settings.mode === ControlMode.TANK){
        this.handlePointer(scene.input.pointer1);
        this.handlePointer(scene.input.pointer2);

        if(!scene.input.pointer1.isDown && !scene.input.pointer2.isDown ){
           this.cursorValues.y = Math.max(-0.8, this.cursorValues.y - 0.01);
        }

        if(scene.input.pointer1.isDown === scene.input.pointer2.isDown ){
          this.cursorValues.x *= 0.5;
        }




      } else {
        //classic controls.

        if(this.leftButtonValue === true){
          this.cursorValues.y = Math.min(1, this.cursorValues.y + 0.1);
        } else if(this.rightButtonValue === true){
           this.cursorValues.y = Math.max(-1, this.cursorValues.y - 0.1);
        } else {
          this.cursorValues.y = Math.max(-0.8, this.cursorValues.y - 0.05);
        }

        //steering
        if(this.steerActive){


          const offset:number = this.steerCurrent - this.steerOrigin;
          const offsetScaled = Math.max(-1, Math.min(1, offset/100 ));
          this.cursorValues.x = offsetScaled;
    
        } else {
          this.cursorValues.x *= 0.5;
        }


      }
    } else {

      // cursor / desktop.
  if (this.cursors.up.isDown) {
        this.cursorValues.y = Math.min(1, this.cursorValues.y + 0.1);
      } else if (this.cursors.down.isDown) {
        this.cursorValues.y = Math.max(-1, this.cursorValues.y - 0.1);
      } else {
        this.cursorValues.y = Math.max(-0.8, this.cursorValues.y - 0.05);
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