export class ViewPortSettings {

  horizonHeight:number = 160;
  minXRoadWith:number = 100;
  maxMoadWidth:number = 600;
  linearScaling:boolean = true;
  xCurveScalar:number =  1;
  yCurveScalar:number =  1;

}

export class GameplaySettings {
  maxAccellerationPerSecond:number = 50;
  slowDownScalar:number = 0.9;
  maxVelocity:number = 100;
  turnVelocityScalar:number;

}
 export default class TrackSystem {
   
   position:number;
   viewPort:ViewPortSettings;
   gameplay:GameplaySettings;

   constructor(){
    console.log("ControlSystem::contructor");
  }
 
   // must function here will take a y position (how close it is to the car z position)
 
   getRoadScale(y:number):number{
     return 1;
   }
 
   getRoadPosition(y:number):number{
     return 0;
   }
 
   shouldCull(y:number):boolean{
     return false;
   }
 
 }
 
 
