import Car from "./Car";
import { ViewPortSettings } from "./TrackSystem";

enum ControlMode {
   CLASSIC = "CLASSIC",
   TANK = "TANK_STYLE"
   }
   
   export class ControlSystemSettings {
     mode:ControlMode;
     verticleAnalougeMin:number = 0;
     verticleAnalougeMax:number = 0;
     horizontalAnalougeMin:number = 0;
     horizontalAnalougeMax:number = 0;
   }

export class ControlSystem {
   settings:ControlSystemSettings;
   private _viewPort:ViewPortSettings;
   
   leftAnalougePosition:number;
   righAnalougePosition:number;

   steeringPosition:number;
   accelleratorButton:Boolean = false;
   brakeButton:Boolean = false;
   cursors:Phaser.Input.Keyboard.CursorKeys;
   
   
   get currentXVector():number {
      if(this.cursors.left.isDown){
        return -1;
      } else if (this.cursors.right.isDown) {
        return 1;
      }
      

      

      return 0;
   }  
   get currentYVector():number {
    if(this.cursors.up.isDown){
      return 1;
    } else if (this.cursors.down.isDown) {
      return -1;
    }



    return 0;
   }


   constructor(scene:Phaser.Scene, viewportSettings:ViewPortSettings){
      console.log("ControlSystem::contructor");
      this._viewPort = viewportSettings;
      this.settings = new ControlSystemSettings();

      if(this.settings.mode === ControlMode.TANK){
        scene.input.on("touchdown", this.pointerDown.bind(this));
      }

      this.cursors = scene.input.keyboard.createCursorKeys();


   }

   pointerDown(e:TouchEvent) {
      console.log("TouchEvent",e);
   }

   update(time: number, delta: number, car:Car){

      if(this.settings.mode === ControlMode.TANK){

      }

   }
 
 }