import BaseScene from "./BaseScene";
import Tools from "../plugins/global/Tools";
import { ControlSystem } from "../components/race/Controls";
import { ViewPortSettings } from "../components/race/TrackSystem";
import Scenery from "../components/race/Scenery";
import Car from "../components/race/Car";
import PickUp from "../components/race/PickUp";
import { GUI } from "dat.gui";

enum ROAD_LENGTH {
  NONE = 0,
  SHORT = 500,
  MEDIUM = 1000,
  LONG = 4000
}

enum ROAD_CURVE {
  NONE = 0,
  EASY = 0.015,
  MEDIUM = 0.04,
  HARD = 0.08
}

class RaceSettings {
  roadWidth: number = 3000;
  cameraHeight: number = 1500;
  drawDistance: number = 600;
  FOV: number = 100;
  fogDensity: number = 0;
  altLength: number = 20;
  segmentLength: number = 20;
  trackLength: number = 0;
  cameraDepth: number = 0;
  maxAccellerationPerSecond: number = 1;
  maxVelocity: number = 9;

  closeColour:number = 0xfae873;
  farColour:number = 0xf58c36;

  skyBottomColor = 0x00dcff;
  skyTopColor = 0x00c0ff;
}

class CurrentState {
  speed: number = 10;
  position: number = 0;
  playerX: number = 0;

}

interface SceneryItem {
  frameName: string,
  isLeft: boolean,
  offset: number
}

interface Pickup {
  lane: number
}

interface TrackSegment {
  index: number;
  p1: WCS;
  p2: WCS;
  alt: boolean;
  isVisible: boolean;
  curve: number;
  scenery?: SceneryItem[];
  pickups?: Pickup[];
}

interface TrackDisplaySegment {
  bg: Phaser.GameObjects.Image;
  fg: Phaser.GameObjects.Image;
  hasBeenUsed: boolean;
}

const ROAD = {
  LENGTH: { NONE: 0, SHORT: 25, MEDIUM: 50, LONG: 100 }, // num segments
  CURVE: { NONE: 0, EASY: 2, MEDIUM: 4, HARD: 6 }
};

interface WCS {
  world: Phaser.Math.Vector3;
  camera: Phaser.Math.Vector3;
  screen: Phaser.Math.Vector4;
  scale: number;
}

export default class Drive2Scene extends BaseScene {

  public tools: Tools;

  private _controls: ControlSystem;
  settings: RaceSettings;


  private _skyBox: Phaser.GameObjects.Image;
  private _scenery: Scenery[];
  private _car: Car;
  private _state: CurrentState;


  private trackSegments: TrackSegment[];
  private trackDisplaySegments: TrackDisplaySegment[];

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
    // const gui: GUI = new GUI({

    // });

    // gui.add(this.settings, "roadWidth", 500, 2100);
    // gui.add(this.settings, "cameraHeight", 650, 2000);
    // // gui.add(this.settings,"drawDistance",10, 300);
    // gui.add(this.settings, "FOV", 50, 100);
    // // gui.add(this.settings,"fogDensity");


  }

  preload() {
    console.log("Drive2Scene::preload");

  }

  create() {
    super.create();
    this.dimensions = new Phaser.Geom.Point(this.game.config.width as number, this.game.config.height as number);

    this.resetRoad();


    this.gernerateAboveHorizon();

    this.genRoadDisplayPool();

    
    this.generateScenery();
    this._car = new Car(this, {
      positionFromBottom: 40,
      scale: 1
    })
    
    this._controls = new ControlSystem(this);

    this.addUI();
  }

  private _spedo:Phaser.GameObjects.Image;
  private _spedoMask:Phaser.GameObjects.Graphics;

  addUI(){
    this._spedo = this.add.image(10,10,"atlas.png","bar_back.png");
    this._spedo.setOrigin(0,0);
    this._spedo.setScale(0.5,0.5);
    let fog = this.add.image(10,10,"atlas.png","bar_front.png");
    fog.setOrigin(0,0);
    fog.setScale(0.5,0.5);



    this._spedoMask = this.make.graphics({});



    this._spedo.mask = new Phaser.Display.Masks.GeometryMask(this, this._spedoMask);
    
    
    this._currentTime = this.add.text(this.dimensions.x - 70,5,"00:00:00",{
      fontFamily: "BIT",
      fontSize: "32px",
      color: "#ffffff",
      textAlign: "center"
      
      
    }
    );
    this._currentSpeed = this.add.text(194,8,"100MPH", {
      fontFamily: "BIT",
      fontSize: "24px",
      color: "#ffffff"
    });
    this._currentTime.setOrigin(0.5,0);
    this._currentSpeed.setOrigin(0.5,0);
    
    this.updateUI(0.5);
  }

  updateUI(speedPercent:number, time:number = 10000){
    this._spedoMask.clear();
    this._spedoMask.fillStyle(0xffffff,1);
    this._spedoMask.fillRect(this._spedo.x, this._spedo.y,this._spedo.width*this._spedo.scaleX*speedPercent, this._spedo.height*this._spedo.scaleY );
    this._currentSpeed.text = Math.floor(speedPercent*220).toString() + " KPH";
    this._currentTime.text = this.raceTime;

  }

  get raceTime(): string {
    let ms = Math.floor(this._currentTimeValue / 10) % 100;
    let seconds = Math.floor(this._currentTimeValue / 1000);

    return this.pad(Math.floor(seconds / 60) + "",2) + ":" + this.pad((seconds % 60).toString(),2) + ":" + this.pad(ms.toString(),2);


  }

  pad(n: string, width: number, z: string = "0") {
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
  }
  gernerateAboveHorizon(){
    let sky = this.add.graphics();

    for(let i = 0; i < 5; i ++ ){
      //@ts-ignore
      var c:any = Phaser.Display.Color.Interpolate.ColorWithColor(new Phaser.Display.Color(this.settings.skyTopColor), new Phaser.Display.Color(this.settings.skyBottomColor), 5, i);
      console.log(c);
      // sky.fillStyle(c,1);

    }

    // badd basic skybox layers.
  }

  generateScenery() {
    //TODO: generate a pool of scenery items and add the sky box
 


    this._scenery = [];

    //generate our visual items to use.
    for (let i = 0; i < this.settings.drawDistance / 4; i++) {
      let sceneryItem = new Scenery(this, {});
      this._scenery.push(sceneryItem);
    }

    //distrubut our items in the models throughout the track
    let sceneryDenisty = 100;
    let totalTrees = Math.floor(this.trackSegments.length / (sceneryDenisty)); //divide for 2 for bothsides.

    for (let i = 0; i < totalTrees; i++) {
      let roadPosition = i * sceneryDenisty;
      this.trackSegments[i * sceneryDenisty].scenery = [];
      this.trackSegments[i * sceneryDenisty].scenery.push({
        frameName: "palm_shadow_left.png",
        isLeft: (i % 2 === 0) ? true : false,
        offset: Math.random() * 10
      }

      );
    }



  }

  gerenateAndDistributePickups() {

  }

  genRoadDisplayPool() {
    this.trackDisplaySegments = [];
    for (var n = 0; n < this.settings.drawDistance; n++) { // arbitrary amount of images to 

      let bg_strip = this.add.sprite(this.dimensions.x / 2, 0, "atlas.png", "bgstrip1.png");
      let road = this.add.sprite(this.dimensions.x / 2, 0, "atlas.png", "blank_road.png");

      bg_strip.setOrigin(0.5, 0);
      road.setOrigin(0.5, 0);


      this.trackDisplaySegments.push({
        bg: bg_strip,
        fg: road,
        hasBeenUsed: false
      });
    }


  }

  addSegment(curve: number) {
    var n = this.trackSegments.length;
    this.trackSegments.push({
      index: n,
      p1: { world: new Phaser.Math.Vector3(0, 0, n * this.settings.segmentLength), camera: new Phaser.Math.Vector3(), screen: new Phaser.Math.Vector4(), scale: 0 },
      p2: { world: new Phaser.Math.Vector3(0, 0, (n + 1) * this.settings.segmentLength), camera: new Phaser.Math.Vector3(), screen: new Phaser.Math.Vector4(), scale: 0 },
      alt: Math.floor(n / this.settings.altLength) % 2 ? true : false,
      isVisible: false,
      curve: curve
    });
  }

  addRoadSegment(enter: number, hold: number, leave: number, curve: number) {
    var n;
    for (n = 0; n < enter; n++)
      this.addSegment(this.easeIn(0, curve, n / enter));
    for (n = 0; n < hold; n++)
      this.addSegment(curve);
    for (n = 0; n < leave; n++)
      this.addSegment(this.easeInOut(curve, 0, n / leave));
  }

  addStraight(num: number = ROAD_LENGTH.MEDIUM) {
    this.addRoadSegment(num, num, num, 0);
  }

  addCurve(num: number = ROAD_LENGTH.MEDIUM, curve: number = ROAD_CURVE.MEDIUM) {
    this.addRoadSegment(num, num, num, curve);
  }

  addSCurves() {
    this.addRoadSegment(ROAD_LENGTH.MEDIUM, ROAD_LENGTH.MEDIUM, ROAD_LENGTH.MEDIUM, -ROAD_CURVE.EASY);
    this.addRoadSegment(ROAD_LENGTH.MEDIUM, ROAD_LENGTH.MEDIUM, ROAD_LENGTH.MEDIUM, ROAD_CURVE.MEDIUM);
    this.addRoadSegment(ROAD_LENGTH.MEDIUM, ROAD_LENGTH.MEDIUM, ROAD_LENGTH.MEDIUM, ROAD_CURVE.EASY);
    this.addRoadSegment(ROAD_LENGTH.MEDIUM, ROAD_LENGTH.MEDIUM, ROAD_LENGTH.MEDIUM, -ROAD_CURVE.EASY);
    this.addRoadSegment(ROAD_LENGTH.MEDIUM, ROAD_LENGTH.MEDIUM, ROAD_LENGTH.MEDIUM, -ROAD_CURVE.MEDIUM);
  }


  //easing functions from racer demo
  easeIn(a: number, b: number, percent: number): number { return a + (b - a) * Math.pow(percent, 2); }
  easeOut(a: number, b: number, percent: number): number { return a + (b - a) * (1 - Math.pow(1 - percent, 2)); }
  easeInOut(a: number, b: number, percent: number): number { return a + (b - a) * ((-Math.cos(percent * Math.PI) / 2) + 0.5); }


  resetRoad() {
    this.trackSegments = [];

    this.addStraight(ROAD_LENGTH.SHORT / 4);
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


    this.settings.trackLength = this.trackSegments.length * this.settings.segmentLength;
    this.addStraight();
    this.addStraight();

  }

  findSegment(z: number): TrackSegment {
    return this.trackSegments[Math.floor(z / this.settings.segmentLength) % this.trackSegments.length];
  }


  project(p: WCS, cameraX: number, cameraY: number, cameraZ: number, cameraDepth: number, width: number, height: number, roadWidth: number) {
    p.camera.x = (p.world.x || 0) - cameraX;
    p.camera.y = (p.world.y || 0) - cameraY;
    p.camera.z = (p.world.z || 0) - cameraZ;
    p.scale = cameraDepth / p.camera.z;
    p.screen.x = Math.round((width / 2) + (p.scale * p.camera.x * width / 2));
    p.screen.y = Math.round((height / 4.6) - (p.scale * p.camera.y * height / 2));
    p.screen.w = Math.round((p.scale * roadWidth * width / 2));
  }

  updatePhysics(baseSegment: TrackSegment, delta: number) {
    //all we want to do is have a move the car, wile taking into account the G of the turn.

    let g = baseSegment.curve;


    //CHANGE IN X 
    if (this._state.speed > 0.5) {

      // let easeIn = Math.max(3, this._state.speed)

      this._car.x = this._car.x + (this._controls.currentXVector * delta) / Math.max(3, this._state.speed);

      //g from curve
      this._car.x = this._car.x - (g * delta) * Math.max(1, this._state.speed / 2);

    }


    if (this._car.x < 100) {
      this._car.x = 100;
      this._state.speed *=  (1-( 0.001* delta));
      //TODO: add rumble.


      //TODO: scale decelleration by delta.

    } else if (this._car.x > this.dimensions.x - 100) {
      this._car.x = this.dimensions.x - 100;
      this._state.speed *=  (1-( 0.001* delta));

    }


    let changeInAccleration = this._controls.currentYVector * this.settings.maxAccellerationPerSecond * delta;


    if (changeInAccleration > 0) {
      // its accellerating
      this._state.speed += changeInAccleration / 1000;
    } else if (changeInAccleration < 0) {

      this._state.speed += changeInAccleration / 100;
      // is accellerating
    }

    // topspeed
    this._state.speed = Math.min(this._state.speed, this.settings.maxVelocity);

    // no reverse
    this._state.speed = Math.max(this._state.speed, 0);



    if (this._controls.currentXVector > 0.2 && this._state.speed > 0.5) {
    
      this._car.setFrame("car_left.png");
    } else if (this._controls.currentXVector < -0.2 && this._state.speed > 0.5) {
      this._car.setFrame("car_right.png");
    } else {
      this._car.setFrame("car_neutral.png");
    }

  }

  checkGameState(delta: number) {
    //check to see we are over the finish line, if so we want to dhow the scores overlay, and reset to allow quick restart.
    this._currentTimeValue += delta;

    if (this._state.position > this.settings.trackLength) {
      this.reset();
    }


  }

  reset() {
    this._state.position = 0;
    this._state.speed = 0;
    this._state.position = 0;

    this._state.speed = 10;


  }

  update(time: number, delta: number) {
    super.update(time, delta);

    this.checkGameState(delta);

    let baseSegment = this.findSegment(this._state.position);


    this.updatePhysics(baseSegment, delta);
    this.updateUI(this._state.speed/this.settings.maxVelocity);

    //update the controls
    this._controls.update(time, delta, this._car, this);



    this.settings.cameraDepth = 1 / Math.tan((this.settings.FOV / 2) * Math.PI / 180);
    this._state.position += this._state.speed * delta;


    if (baseSegment.pickups && baseSegment.pickups.length > 0) {
      //check we overlap with the pickup, if so enable speed boost, remove pickup

    }

    // set all segments to not visible?
    this.updateRoadModel(baseSegment);

    this.renderRoad(time, delta);
  }

  private updateRoadModel(baseSegment: TrackSegment) {

    //reset them all
    for (let n = 0; n < this.trackSegments.length; n++) {
      this.trackSegments[n].isVisible = false;
    }


    let x = 0;
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
        x = x + dx;
        dx = dx + segment.curve;
      }
    }
  }

  renderRoad(time: number, delta: number) {

    //todo:reset all road display items
    this.resetDisplayItems();



    let previousPosition: number = -1;



    //now we can render each strip?
    for (let n = this.trackSegments.length - 1; n >= 0; n--) {
      let seg = this.trackSegments[n];

      //if this segment isn't in draw distance / we have gone past it we dont need to render.
      if (!seg.isVisible) {
        continue;
      }

      //set the track scales.
      const y = Math.abs(seg.p2.screen.y - seg.p1.screen.y) / (this.settings.segmentLength / 10);//TODO: work out why we need to /8


      //any scenery items?
      if (seg.scenery && seg.scenery.length > 0) {
        //todo render scenery item.

        let model = seg.scenery[0];

        let s = this.getFirstAvalibleSceneryItem();
        s.visible = true;
        s.y = seg.p1.screen.y;

        s.x = seg.p1.screen.x + ((model.isLeft) ? -seg.p1.screen.w : seg.p1.screen.w)*0.1;

        console.log();
        //maybe camera.z? factor in track distance and segment legnth?
        let scale = (seg.p1.scale * this.settings.roadWidth) * 1;
        s.setScale((model.isLeft) ? scale * -1 : scale, scale);
        let a = Math.min(1, scale * 4); //todo pop in.
        s.setAlpha(a);


      }

      //any pickup items?
      if (seg.pickups && seg.pickups.length > 0) {
        //todo render pickup item.
      }


      //we are going to cull certain road segments now if they overlap for performance.
      if (Math.round(seg.p1.screen.y) === Math.round(previousPosition)) {
        //overlap cull
        // console.log("cull");
        continue;

      }
      //get a display item
      let visual: TrackDisplaySegment = this.getFirstAvalibleRoadItem();

      //set all its props.
      visual.bg.visible = true;
      visual.fg.visible = true;


      visual.bg.y = visual.fg.y = previousPosition = seg.p1.screen.y;



      // alternate tints based on track properties.
      visual.fg.setFrame((seg.alt) ? "blank_road.png" : "road_alt.png");

      
      visual.fg.tint = (seg.alt) ? 0xffffff : 0xeeeeee;
      visual.bg.tint = (seg.alt) ? this.settings.closeColour : this.settings.farColour;



      visual.bg.setScale(1, y);
      visual.fg.setScale(seg.p1.screen.w / this.dimensions.x, y);

      visual.fg.x = seg.p1.screen.x;



    }


  }

  resetDisplayItems() {
    ///basicly reset all our display segments.
    for (let i = 0; i < this.trackDisplaySegments.length; i++) {
      const seg = this.trackDisplaySegments[i];
      seg.hasBeenUsed = false;
      seg.bg.visible = false;
      seg.fg.visible = false;
    }

    for (let i = 0; i < this._scenery.length; i++) {
      const seg = this._scenery[i];
      seg.hasBeenUsed = false;
      seg.visible = false;

    }
  }

  getFirstAvalibleRoadItem(): TrackDisplaySegment {
    //returns the first road display item not in use.
    for (let i = 0; i < this.trackDisplaySegments.length; i++) {
      const seg = this.trackDisplaySegments[i];

      if (!seg.hasBeenUsed) {
        seg.hasBeenUsed = true;
        return seg;
      }

    }

    console.log("out of road visuals");
  }

  getFirstAvalibleSceneryItem(): Scenery {
    //returns the first road display item not in use.
    for (let i = 0; i < this._scenery.length; i++) {
      const s = this._scenery[i];

      if (!s.hasBeenUsed) {
        s.hasBeenUsed = true;
        return s;
      }


    }
    // console.log("out of road scenery visual elements");
  }

  shutdown() {
    // drop references to anything we have in create
    this.tools = null;

    super.shutdown();
  }
}
