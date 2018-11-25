
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
   setttings:ControlSystemSettings;
   leftAnalougePosition:number;
   righAnalougePosition:number;

   steeringPosition:number;
   accelleratorButton:Boolean = false;
   brakeButton:Boolean = false;
   
   getCurrentCarXForce():number {
     return 0;
   }

   constructor(){
      console.log("ControlSystem::contructor");
   }
 
 }