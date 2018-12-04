import BaseScene from "./BaseScene";
import Tools from "../plugins/global/Tools";
import { ControlSystem } from "../components/race/Controls";
import { ViewPortSettings } from "../components/race/TrackSystem";
import Scenery from "../components/race/Scenery";
import Car from "../components/race/Car";
import PickUp from "../components/race/PickUp";
import {GUI} from "dat.gui";

enum ROAD_LENGTH {
  NONE = 0,
  SHORT = 50,
  MEDIUM = 100,
  LONG = 200
}

enum ROAD_CURVE {
  NONE = 0,
  EASY = 1,
  MEDIUM = 2,
  HARD = 3
}

class RaceSettings {
  roadWidth:number = 2000;
  cameraHeight:number = 1000;
  drawDistance:number = 300;
  FOV: number = 100;
  fogDensity:number = 0;
  altLength:number  = 3;    
  segmentLength:number = 100;
  trackLength:number = 0;
  cameraDepth:number = 0;
}

class CurrentState {
  speed:number = 10;
  position:number = 0;
  playerX:number = 0;
}

interface TrackSegment {
  // bg: Phaser.GameObjects.Image;
  // fg: Phaser.GameObjects.Image;
  index: number;
  p1: WCS;
  p2: WCS;
  alt:boolean;
  isVisible:boolean;
  curve:number;
}

interface TrackDisplaySegment {
  bg:Phaser.GameObjects.Image;
  fg:Phaser.GameObjects.Image;
  hasBeenUsed:boolean;
}

const ROAD = {
  LENGTH: { NONE: 0, SHORT:  25, MEDIUM:  50, LONG:  100 }, // num segments
  CURVE:  { NONE: 0, EASY:    2, MEDIUM:   4, HARD:    6 }
};



interface WCS {
  world:Phaser.Math.Vector3;
  camera:Phaser.Math.Vector3;
  screen:Phaser.Math.Vector4;
  scale:number;
}

export default class Drive2Scene extends BaseScene {

  public tools: Tools;

  private _controls: ControlSystem;
  settings: RaceSettings;


  private _skyBox: Phaser.GameObjects.Image;
  private _scenery: Scenery[];
  private _car: Car;
  private _state:CurrentState;


  private trackSegments:TrackSegment[];
  private trackDisplaySegments:TrackDisplaySegment[];

  private _currentLapTime: number = 0;
  private _currentDistance: number = 0;

  dimensions: Phaser.Geom.Point;

  private _currentTimeValue: number = 0;
  private _currentTime: Phaser.GameObjects.Text;
  private _currentSpeed: Phaser.GameObjects.Text;


  private _pickups: PickUp[];
  constructor() {
    super({
      key: "Drive2Scene",
      active: false
    });
    console.log("Drive2Scene::constructor");

    this.settings = new RaceSettings();
    this._state = new CurrentState();
    const gui: GUI = new GUI({

    });

    gui.add(this.settings,"roadWidth",1000,2100);
    gui.add(this.settings,"cameraHeight",650,2000);
    gui.add(this.settings,"drawDistance",10, 300);
    gui.add(this.settings,"FOV",50,100);
    // gui.add(this.settings,"fogDensity");


  }

  preload() {
    console.log("Drive2Scene::preload");

  }

  create() {
    super.create();
    this.dimensions = new Phaser.Geom.Point(this.game.config.width as number, this.game.config.height as number);

    this._controls = new ControlSystem(this);
    this.resetRoad();
    this.genRoadDisplayPool();
    

  }

  genRoadDisplayPool() {
    this.trackDisplaySegments = [];
    for(var n = 0 ; n < 500 ; n++) { // arbitrary amount of images to 

      let bg_strip = this.add.sprite(this.dimensions.x/2,0,"atlas.png" , "bgstrip1.png");
      let road = this.add.sprite(this.dimensions.x/2,0,  "atlas.png" , "blank_road.png");

      bg_strip.setOrigin(0.5,0);
      road.setOrigin(0.5,0);

      this.trackDisplaySegments.push({
        bg:bg_strip,
        fg:road,
        hasBeenUsed:false
      });
    }

 
  }

  addSegment(curve:number) {
    var n = this.trackSegments.length;
    this.trackSegments.push({
      index: n,
      p1: { world: new Phaser.Math.Vector3(0,0,n*this.settings.segmentLength), camera: new Phaser.Math.Vector3(), screen:new Phaser.Math.Vector4(), scale:0 },
      p2: { world: new Phaser.Math.Vector3(0,0,(n+1)*this.settings.segmentLength), camera: new Phaser.Math.Vector3(), screen:new Phaser.Math.Vector4(), scale:0 },
      alt: Math.floor(n/this.settings.altLength)%2 ? true : false,
     isVisible:false,
     curve:curve
   });
  }

  addRoadSegment(enter:number, hold:number, leave:number, curve:number) {
    var n;
    for(n = 0 ; n < enter ; n++)
      this.addSegment(this.easeIn(0, curve, n/enter));
    for(n = 0 ; n < hold  ; n++)
      this.addSegment(curve);
    for(n = 0 ; n < leave ; n++)
      this.addSegment(this.easeInOut(curve, 0, n/leave));
  }

  addStraight(num:number = ROAD_LENGTH.MEDIUM) {
    this.addRoadSegment(num, num, num, 0);
  }

  addCurve(num:number = ROAD_LENGTH.MEDIUM, curve:number = ROAD_CURVE.MEDIUM) {
    this.addRoadSegment(num, num, num, curve);
  }

  addSCurves() {
    this.addRoadSegment(ROAD_LENGTH.MEDIUM, ROAD_LENGTH.MEDIUM, ROAD_LENGTH.MEDIUM,  -ROAD_CURVE.EASY);
    this.addRoadSegment(ROAD_LENGTH.MEDIUM, ROAD_LENGTH.MEDIUM, ROAD_LENGTH.MEDIUM,   ROAD_CURVE.MEDIUM);
    this.addRoadSegment(ROAD_LENGTH.MEDIUM, ROAD_LENGTH.MEDIUM, ROAD_LENGTH.MEDIUM,   ROAD_CURVE.EASY);
    this.addRoadSegment(ROAD_LENGTH.MEDIUM, ROAD_LENGTH.MEDIUM, ROAD_LENGTH.MEDIUM,  -ROAD_CURVE.EASY);
    this.addRoadSegment(ROAD_LENGTH.MEDIUM, ROAD_LENGTH.MEDIUM, ROAD_LENGTH.MEDIUM,  -ROAD_CURVE.MEDIUM);
  }


  //easing functions from racer demo
  easeIn(a:number,b:number,percent:number):number{ return a + (b-a)*Math.pow(percent,2);                           }
  easeOut(a:number,b:number,percent:number):number { return a + (b-a)*(1-Math.pow(1-percent,2));                     }
  easeInOut(a:number,b:number,percent:number):number { return a + (b-a)*((-Math.cos(percent*Math.PI)/2) + 0.5);        }


  resetRoad() {
    this.trackSegments = [];

    this.addStraight(ROAD_LENGTH.SHORT/4);
    this.addSCurves();
    this.addStraight(ROAD_LENGTH.LONG);
    this.addCurve(ROAD_LENGTH.MEDIUM, ROAD_CURVE.MEDIUM);
    this.addCurve(ROAD_LENGTH.LONG, ROAD_CURVE.MEDIUM);
    this.addStraight();
    this.addSCurves();
    this.addCurve(ROAD_LENGTH.LONG, -ROAD_CURVE.MEDIUM);
    this.addCurve(ROAD_LENGTH.LONG, ROAD_CURVE.MEDIUM);
    this.addStraight();
    this.addSCurves();
    this.addCurve(ROAD_LENGTH.LONG, -ROAD_CURVE.EASY);


    // for(var n = 0 ; n < 500 ; n++) { // arbitrary road length
    //   this.trackSegments.push({
    //      index: n,
    //      p1: { world: new Phaser.Math.Vector3(0,0,n*this.settings.segmentLength), camera: new Phaser.Math.Vector3(), screen:new Phaser.Math.Vector4(), scale:0 },
    //      p2: { world: new Phaser.Math.Vector3(0,0,(n+1)*this.settings.segmentLength), camera: new Phaser.Math.Vector3(), screen:new Phaser.Math.Vector4(), scale:0 },
    //      alt: Math.floor(n/this.settings.altLength)%2 ? true : false,
    //     isVisible:false,
    //     curve : 0.5
    //   });
    // }
  
    this.settings.trackLength = this.trackSegments.length * this.settings.segmentLength;
  }

  findSegment(z:number):TrackSegment {
    return this.trackSegments[Math.floor(z/this.settings.segmentLength) % this.trackSegments.length];
  }


  project(p:WCS, cameraX:number, cameraY:number, cameraZ:number, cameraDepth:number, width:number, height:number, roadWidth:number) {
    p.camera.x     = (p.world.x || 0) - cameraX;
    p.camera.y     = (p.world.y || 0) - cameraY;
    p.camera.z     = (p.world.z || 0) - cameraZ;
    p.scale = cameraDepth/p.camera.z;
    p.screen.x     = Math.round((width/2)  + (p.scale * p.camera.x  * width/2));
    p.screen.y     = Math.round((height/2) - (p.scale * p.camera.y  * height/2));
    p.screen.w     = Math.round(             (p.scale * roadWidth   * width/2));
  }

  updatePhysics(){
    //all we want to do is have a move the car, wile taking into account the G of the turn.

  }

  checkGameState(){
    //check to see we are over the finish line, if so we want to dhow the scores overlay, and reset to allow quick restart.


  }

  update(time: number, delta: number) {    
    super.update(time, delta);

    this.checkGameState();

    this.updatePhysics();

      //update the controls
      this._controls.update(time, delta,this._car,this);


    
    this.settings.cameraDepth = 1 / Math.tan((this.settings.FOV/2) * Math.PI/180);

    this._state.position += this._state.speed*delta;

    let baseSegment = this.findSegment(this._state.position);

    // set all segments to not visible?
    this.updateRoadModel(baseSegment);



    this.renderRoad(time,delta);
  }

  private updateRoadModel(baseSegment: TrackSegment) {

    //reset them all
    for (let n = 0; n < this.trackSegments.length; n++) {
      this.trackSegments[n].isVisible = false;
    }


    let x  = 0;
    let dx = 0;

    // project them all and decide if we want to render it.
    for (let n = 0; n < this.settings.drawDistance; n++) {
      let segment = this.trackSegments[(baseSegment.index + n) % this.trackSegments.length];
      this.project(segment.p1, (this._state.playerX * this.settings.roadWidth) - x, this.settings.cameraHeight, this._state.position, this.settings.cameraDepth, this.dimensions.x, this.dimensions.y, this.settings.roadWidth);
      this.project(segment.p1, (this._state.playerX * this.settings.roadWidth) - x - dx, this.settings.cameraHeight, this._state.position, this.settings.cameraDepth, this.dimensions.x, this.dimensions.y, this.settings.roadWidth);
      if ((segment.p1.camera.z <= this.settings.cameraDepth) || (segment.p2.screen.y >= this.dimensions.y)) {
        segment.isVisible = false;
      }
      else {
        segment.isVisible = true;
        x  = x + dx;
        dx = dx + segment.curve;
      }
    }
  }

  renderRoad(time: number, delta: number){

    //todo:reset all road display items
    this.resetDisplayItems();



    //now we can render each strip?
    for(let n = this.trackSegments.length-1 ; n >=0 ; n--) {
      let seg = this.trackSegments[n];

      //if this segment isn't in draw distance / we have gone past it we dont need to render.
      if(!seg.isVisible){
        continue;
      }

      //get a display item
      let visual:TrackDisplaySegment = this.getFirstAvalibleRoadItem();

      //set all its props.
      visual.bg.visible = true;
      visual.fg.visible = true;


      visual.bg.y = visual.fg.y = seg.p1.screen.y;


      
      // alternate tints based on track properties.
      visual.fg.setFrame((seg.alt) ? "blank_road.png" : "road_alt.png");
      visual.fg.tint = (seg.alt) ? 0xffffff : 0xeeeeee;
      visual.bg.tint = (seg.alt) ? 0xffffff : 0xeeeeee;

      //set the track scales.
      const y = Math.abs(seg.p2.screen.y - seg.p1.screen.y) / (this.settings.segmentLength/8);//TODO: work out why we need to /8

      visual.bg.setScale(1,y);
      visual.fg.setScale(seg.p1.screen.w/this.dimensions.x,y);

      visual.fg.x = seg.p1.screen.x;
      




    }


  }

  resetDisplayItems(){
    ///basicly reset all our display segments.
    for(let i=0; i< this.trackDisplaySegments.length; i++){
      const seg = this.trackDisplaySegments[i];
      seg.hasBeenUsed = false;
      seg.bg.visible = false;
      seg.fg.visible = false;
    }
  }

  getFirstAvalibleRoadItem():TrackDisplaySegment{
    //returns the first road display item not in use.
    for(let i=0; i< this.trackDisplaySegments.length; i++){
      const seg = this.trackDisplaySegments[i];
  
      if(!seg.hasBeenUsed){
        seg.hasBeenUsed = true;
        return seg;
      }
  
      }

      console.log("out of road visuals");
  }

  shutdown() {
    // drop references to anything we have in create
    this.tools = null;

    super.shutdown();
  }
}
