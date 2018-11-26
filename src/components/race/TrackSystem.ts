export interface TrackCorner {
  trackPosition:number;
  trackDistance:number;
  maxXoffset:number;
}


export class ViewPortSettings {

  horizonHeight:number = 160;
  minXRoadWith:number = 100;
  maxMoadWidth:number = 600;
  linearScaling:boolean = true;
  xCurveScalar:number =  1;
  yCurveScalar:number =  1;
  _alternameAmount:number = 10; //TODO this can't be linear

  gameDimensions:Phaser.Geom.Point;





  constructor(gameDimensions:Phaser.Geom.Point){
    console.log("ViewPortSettings::contructor", gameDimensions);

    this.gameDimensions = gameDimensions;


  }

  get totalBands():number{
    return this.gameDimensions.y - this.horizonHeight;
  }


  alternameAmount(yPosition:number){
    return Math.floor(this._alternameAmount);
  }

}

export class GameplaySettings {
  maxAccellerationPerSecond:number = 1;
  slowDownScalar:number = 0.9;
  maxVelocity:number = 16;
  turnVelocityScalar:number = 0.7;
  currentVelocity:number = 0.5;
  sceneryAmount:number  = 200;

  constructor() {
    
  }

}
 export default class TrackSystem {
   
   position:number = 0;
   currenDistance:number = 0;
   gameplay:GameplaySettings;
   private _viewPort:ViewPortSettings;
   trackData:TrackCorner[];

 
 
 

   
   constructor(viewportSettings:ViewPortSettings){
     console.log("ControlSystem::contructor");
     this.gameplay = new GameplaySettings();
     this._viewPort = viewportSettings;


    
     this.trackData = [];
    this.generateRandomTrack();


    }



    generateRandomTrack() {
      this.trackData.push({trackDistance:100, maxXoffset:90, trackPosition: 100});

      for(var i = 0 ; i < 50;i++){
        let previous = this.trackData[i];
        let track =  {
          trackPosition: previous.trackPosition + (previous.trackDistance*2) + Math.random()*1000,
          maxXoffset: (Math.random()-0.5)* 500,
          trackDistance : Math.random()*600 + 200
        }

        this.trackData.push(track);
      }
    }



    //some easing functions.
    easeInOutQuad (t:number) { return t<.5 ? 2*t*t : -1+(4-2*t)*t }
    easeInQuad(t:number) { return t*t }
    


   // scales linearly. 
   getScaleForSegment(y:number, total:number){
    let minScale = 0.05;
    let maxScale = 0.5;
    let inv_ratio = 1-(y/total);
   return minScale + (maxScale - minScale)*inv_ratio; 

  }


  get currentBendOffset():number{

    // for each bend if we sit in the bounds (rurn)
    for(let i = 0; i < this.trackData.length; i++){
      let td= this.trackData[i];

      // if we are in the known bounds of a bend.
      if( (td.trackPosition - (td.trackDistance)) < this.currenDistance && 
          (td.trackPosition + (td.trackDistance)) > this.currenDistance){
        
        let bendIntesisity = Math.abs(this.currenDistance - td.trackPosition) / td.trackDistance;
        
        //we are in a known bend.
        return td.maxXoffset * (1-bendIntesisity);
      }

    }


    // lerp to center of bend.


    //no bend if we arrive here.
    return 0;
  }
 
   getPositionForSegment(y:number,total:number):number{
    
    let ratio = (this.easeInQuad(y/total));

     return (this.currentBendOffset*ratio) + this._viewPort.gameDimensions.x/2;
   }

   getSceneryOffsetMin(y:number,total:number, flipped:boolean, offset:number):number{

    let ratio = (this.easeInQuad(y/total));
    let center:number =  this.getPositionForSegment(y,total);

    let roadOffset:number =  (this.getScaleForSegment(y,total)*500);

    let randomOffset:number = (this.getScaleForSegment(y,total)*offset);

    // return center;

    if(flipped){
      return center + roadOffset + randomOffset;

    } else {
      return center - roadOffset - randomOffset;

    }

   } 

   getSceneryScale(y:number, total:number){
     return  1 - (y/total);



   }
 
   shouldCull(y:number):boolean{
     return false;
   }
 
 }
 
 
