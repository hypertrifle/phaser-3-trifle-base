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

   cursorValues:Phaser.Geom.Point;
   
   
   get currentXVector():number {
     return this.cursorValues.x;
      
    
  }  
   get currentYVector():number {
    return this.cursorValues.y;

   }


   constructor(scene:Phaser.Scene, viewportSettings:ViewPortSettings){
      console.log("ControlSystem::contructor");
      this._viewPort = viewportSettings;
      this.settings = new ControlSystemSettings();

      this.cursorValues = new Phaser.Geom.Point(0,0);

      if(this.settings.mode === ControlMode.TANK){
        scene.input.on("touchdown", this.pointerDown.bind(this));
      }

      this.cursors = scene.input.keyboard.createCursorKeys();


   }

   pointerDown(e:TouchEvent) {
      console.log("TouchEvent",e);
   }

   update(time: number, delta: number, car:Car){
      // console.log("controls update");
      if(this.settings.mode === ControlMode.TANK){

      }

      if(this.cursors.up.isDown){
        this.cursorValues.y = Math.min(1, this.cursorValues.y+0.05);
      } else if (this.cursors.down.isDown) {
        this.cursorValues.y = Math.max(-1, this.cursorValues.y-0.05);
      } else {
        this.cursorValues.y *= 0.8;
      }

      if(this.cursors.right.isDown){
        this.cursorValues.x = Math.min(1, this.cursorValues.x+0.01);
      } else if (this.cursors.left.isDown) {
        this.cursorValues.x = Math.max(-1, this.cursorValues.x-0.01);
      }else {
        this.cursorValues.x *= 0.5;
      }


   }
 
 }