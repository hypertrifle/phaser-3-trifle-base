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
  SHORT = 200,
  MEDIUM = 500,
  LONG = 1000
}

enum ROAD_CURVE {
  NONE = 0,
  EASY = 0.015,
  MEDIUM = 0.04,
  HARD = 0.08
}

class RaceSettings {
  roadWidth: number = 4000;
  cameraHeight: number = 1500;
  drawDistance: number = 1500;
  FOV: number = 120;
  fogDensity: number = 0;
  altLength: number = 20;
  segmentLength: number = 20;
  trackLength: number = 0;
  cameraDepth: number = 0;
  maxAccellerationPerSecond: number = 1;
  maxVelocity: number = 9;

  _closeColour:number = 0xfae873;
  _farColour:number = 0xf58c36;

  _skyBottomColor:number = 0x00dcff;
  _skyTopColor:number = 0x00c0ff;

  get closeColour(){
    return Phaser.Display.Color.ValueToColor(this._closeColour);
  }

  get farColour(){
    return Phaser.Display.Color.ValueToColor(this._farColour);
  }

  get skyBottomColor(){
    return Phaser.Display.Color.ValueToColor(this._skyBottomColor);
  }

  get skyTopColor(){
    return Phaser.Display.Color.ValueToColor(this._skyTopColor);
  }
}

class CurrentState {
  speed: number = 1;
  position: number = 0;
  playerX: number = 0;
  g:number = 0;

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

  private _horizonItems:Phaser.GameObjects.Image[] = []


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


    let bg = this.add.graphics({});

    //spedo bg
    bg.fillStyle(0x333333,1);
    bg.fillRoundedRect(10,6,210,20,4);


    //timer BG
    bg.fillRoundedRect(this.dimensions.x - 98,6,93,20,4);


    this._spedo = this.add.image(5,5,"atlas.png","bar_back.png");
    this._spedo.setOrigin(0,0);
    this._spedo.setScale(0.5,0.5);
    let fog = this.add.image(5,5,"atlas.png","bar_front.png");
    fog.setOrigin(0,0);
    fog.setScale(0.5,0.5);



    this._spedoMask = this.make.graphics({});



    this._spedo.mask = new Phaser.Display.Masks.GeometryMask(this, this._spedoMask);
    
    
    this._currentTime = this.add.text(this.dimensions.x - 50,5,"00:00:00",{
      fontFamily: "BIT",
      fontSize: "20px",
      color: "#ffffff",
      align: "center"
      
      
    }
    );
    this._currentSpeed = this.add.text(216,5,"100MPH", {
      fontFamily: "BIT",
      fontSize: "20px",
      color: "#ffffff",
      align: "center"

    });
    this._currentTime.style.setAlign("center");
    this._currentSpeed.style.setAlign("center");
    this._currentTime.setOrigin(0.5,0);
    this._currentSpeed.setOrigin(1,0);
    
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

    for(let i = 0; i < 50; i ++ ){
      //@ts-ignore
      var c:Phaser.Display.Color = this.getInterpoadtedColor(this.settings._skyTopColor, this.settings._skyBottomColor, i, 5);
      sky.fillStyle(c.color,1);
      sky.fillRect(0,i*8,this.dimensions.x,8);

    }


    
    let cloud = this.add.image(this.dimensions.x/2, 60,"atlas.png","clouds_0.png");
    cloud.setDataEnabled();
    cloud.data.set("paralax", 0.2);
    cloud.data.set("velocity", 0.005);
    this._horizonItems.push(cloud);


    // badd basic skybox layers.

    for(let i = 2; i >= 0; i --){
      let item = this.add.image(this.dimensions.x/2, 60,"atlas.png","scenery_"+i+".png");
      item.setDataEnabled();
      item.data.set("paralax", (3-i)*0.1);
      item.data.set("velocity", 0);
      this._horizonItems.push(item);
    }

    let cloud2 = this.add.image(this.dimensions.x/2, 60,"atlas.png","clouds_1.png");
    cloud2.setDataEnabled();
    cloud2.data.set("paralax", 0.2);
    cloud2.data.set("velocity", 0.01);
    this._horizonItems.push(cloud2);

    
  }


  updateAboveHorizon(changeInXVel:number, delta:number){
    for(let i = 0; i < this._horizonItems.length; i ++){
      
      //any movement based on the corners (curve length scaled by speed)
      this._horizonItems[i].x -= (changeInXVel *delta *this._horizonItems[i].data.get("paralax"));

      //any basic movement based on velocity (mainly for clouds)
      this._horizonItems[i].x -= (this._horizonItems[i].data.get("velocity")*delta);

      if(this._horizonItems[i].x + (this._horizonItems[i].width/2) < 0){
        this._horizonItems[i].x += this._horizonItems[i].width + this.dimensions.x;
      }


    }
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

      let offset = Math.random();
      if(i % 20 ===1) {
        offset += 4;
      }

      this.trackSegments[i * sceneryDenisty].scenery.push({
        frameName: (i % 20 ===1)?"billboard.png" :  "palm_shadow_left.png",
        isLeft: (i % 2 === 0) ? true : false,
        offset: offset 
      }

      );
    }

    //distribute our obstacles / pickups.
    let pickupDesnity = 1000;
    let totalPickups = Math.floor(this.trackSegments.length / (pickupDesnity));

    for (let i = 0; i < totalPickups; i++) {

      this.trackSegments[i * pickupDesnity].pickups = [];
      
      this.trackSegments[i * pickupDesnity].pickups.push({
        lane:Phaser.Math.RND.integerInRange(0,2)
      });

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
    this.addRoadSegment(ROAD_LENGTH.MEDIUM, ROAD_LENGTH.MEDIUM, ROAD_LENGTH.MEDIUM, -ROAD_CURVE.MEDIUM);
    this.addRoadSegment(ROAD_LENGTH.MEDIUM, ROAD_LENGTH.MEDIUM, ROAD_LENGTH.MEDIUM, ROAD_CURVE.HARD);
    this.addRoadSegment(ROAD_LENGTH.MEDIUM, ROAD_LENGTH.MEDIUM, ROAD_LENGTH.MEDIUM, ROAD_CURVE.MEDIUM);
    this.addRoadSegment(ROAD_LENGTH.MEDIUM, ROAD_LENGTH.MEDIUM, ROAD_LENGTH.MEDIUM, -ROAD_CURVE.MEDIUM);
    this.addRoadSegment(ROAD_LENGTH.MEDIUM, ROAD_LENGTH.MEDIUM, ROAD_LENGTH.MEDIUM, -ROAD_CURVE.HARD);
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
    this.addCurve(ROAD_LENGTH.LONG, ROAD_CURVE.HARD);
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
    p.screen.w = Math.round((p.scale * roadWidth * width / 2.5));
  }

  updatePhysics(baseSegment: TrackSegment, delta: number) {
    //all we want to do is have a move the car, wile taking into account the G of the turn.

    this._state.g = baseSegment.curve;


    //CHANGE IN X 
    if (this._state.speed > 0.5) {

      // let easeIn = Math.max(3, this._state.speed)

      this._car.x = this._car.x + (this._controls.currentXVector * delta) / Math.max(3, this._state.speed);

      //g from curve
      this._car.x = this._car.x - (this._state.g * delta) * Math.max(1, this._state.speed / 2);

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
      // its accellerating.
      this._state.speed += changeInAccleration / 1000;
    } else if (changeInAccleration < 0) {

      //its braking.
      this._state.speed += changeInAccleration / 300;
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
      this.win();
    }


  }

  win() {
    console.log("END OF LAP!");
    this.ended = true;

    this.wingroup = this.add.container(this.dimensions.x / 2, this.dimensions.y / 2);

    let bg = this.add.graphics({});
    bg.fillStyle(0x000000, 0.8);
    bg.fillRect(-300,-160,600,320);

    this.wingroup.add(bg);

    let scoreText = this.add.text(0,0,this.raceTime,{
      fontFamily: "BIT",
      fontSize: "64px",
      color: "#ffffff",
      textAlign: "center",
    });
    scoreText.setOrigin(0.5,0.5);

  this.wingroup.add(scoreText);

  // buttons

  let replaybutton = this.add.image(-160,100,"replay");
  let highscores = this.add.image(160,100,"highscores");

  replaybutton.setInteractive();
  // highscores.setInteractive();

  replaybutton.on("pointerup", this.reset.bind(this));



  this.wingroup.add(replaybutton);
  this.wingroup.add(highscores);


  }

  wingroup: Phaser.GameObjects.Container|null;

  reset() {
      if (this.wingroup) {
        this.wingroup.destroy();
      }

      this. _currentTimeValue = 0;
      this._state.position = 0;
      this._state.speed = 0;
      this._state.playerX = 0;

      this.ended = false;
  }

  ended: boolean = false;

  // reset() {
  //   this._state.position = 0;
  //   this._state.speed = 0;
  //   this._state.position = 0;

  //   this._state.speed = 10;


  // }

  update(time: number, delta: number) {
    super.update(time, delta);

    this.updateUI(this._state.speed/this.settings.maxVelocity);

  

    let baseSegment = this.findSegment(this._state.position);

    


    this.updatePhysics(baseSegment, delta);
    this.updateAboveHorizon(this._state.g*(this._state.speed/this.settings.maxVelocity),delta);
    //update the controls



    this.settings.cameraDepth = 1 / Math.tan((this.settings.FOV / 2) * Math.PI / 180);
    this._state.position += this._state.speed * delta;


    if (baseSegment.pickups && baseSegment.pickups.length > 0) {
      //check we overlap with the pickup, if so enable speed boost, remove pickup

    }

    // set all segments to not visible?
    this.updateRoadModel(baseSegment);

    this.renderRoad(time, delta);

    if (this.ended) {
      this._controls.cursorValues.y = Math.max(-1, this._controls.cursorValues.y - 0.05);
      this._controls.cursorValues.x *= 0.8;
      return;
    }

    this._controls.update(time, delta, this._car, this);
    this.checkGameState(delta);

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


    let i = -1;
    let previousAlt:boolean = false;
    let tint:number = this.settings._farColour;
    //now we can render each strip?
    for (let n = this.trackSegments.length - 1; n >= 0; n--) {
      i++;
      let seg = this.trackSegments[n];

      //if this segment isn't in draw distance / we have gone past it we dont need to render.
      if (!seg.isVisible) {
        continue;
      }

      //set the track scales.
      const y = Math.abs(seg.p2.screen.y - seg.p1.screen.y) / (this.settings.segmentLength / 10);//TODO: work out why we need to /8


      //any scenery items?
      if (seg.scenery && seg.scenery.length > 0 && previousPosition !== -1) {

        //currently we can only have one item per segment so lets just grab that.
        let model = seg.scenery[0];

        //grab one from the pool.
        let s = this.getFirstAvalibleSceneryItem();
       
        s.visible = true;
        s.setFrame(model.frameName);

        //position.
        s.y = seg.p1.screen.y;
        s.x = seg.p1.screen.x + ((model.isLeft) ? -seg.p1.screen.w : seg.p1.screen.w)*(0.1*model.offset);

        // start and end items,
        
        
         
        //maybe camera.z? factor in track distance and segment legnth?
        let scale = (seg.p1.scale * this.settings.roadWidth) * 1;
        s.setScale((model.isLeft) ? scale * -1 : scale, scale);
        let a = Math.min(1, scale * 6); //todo pop in.
        s.setAlpha(a);


      }

      //any pickup items?
      if (seg.pickups && seg.pickups.length > 0 && previousPosition !== -1) {

        //currently we can only have one item per segment so lets just grab that.
        let model = seg.pickups[0];

        //grab one from the pool.
        let s = this.getFirstAvalibleSceneryItem();
       
        s.visible = true;
        s.setFrame("iceberg.png");

        //position.
        s.y = seg.p1.screen.y;
        let offset = (model.lane -1)*5000;
        s.x = seg.p1.screen.x + (seg.p1.screen.w *offset);

        // start and end items,
        
        
         
        //maybe camera.z? factor in track distance and segment legnth?
        let scale = (seg.p1.scale * this.settings.roadWidth) * 0.2;
        s.setScale(scale, scale);
        let a = Math.min(1, scale * 15); //todo pop in.
        s.setAlpha(a);


      }


      //we are going to cull certain road segments now if they overlap for performance.
      if (Math.round(seg.p1.screen.y) === Math.round(previousPosition) || previousPosition === -1 ) {
        //overlap cull
        previousPosition = seg.p1.screen.y;
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


      


      if(seg.alt != previousAlt){
        previousAlt = seg.alt;
        let shade = this.getInterpoadtedColor(this.settings._closeColour,this.settings._farColour, seg.p1.camera.z, this.settings.drawDistance * this.settings.segmentLength , previousAlt);
      
        tint = shade.color;// Phaser.Display.Color;//tint.//(seg.alt) ? this.settings.closeColour : this.settings.farColour;
      }
      visual.bg.tint = tint

      visual.bg.setScale(1, y);
      visual.fg.setScale(seg.p1.screen.w / this.dimensions.x, y);

      visual.fg.x = seg.p1.screen.x;



    }


  }

  private getInterpoadtedColor(color1:number, color2:number,value: number, total:number, alternating?: boolean):Phaser.Display.Color {
   
    let color:ColorObject = Phaser.Display.Color.Interpolate.ColorWithColor(
      Phaser.Display.Color.ValueToColor(color1), 
      Phaser.Display.Color.ValueToColor(color2), 
      total, 
      value
      );

    // @ts-ignore
    let shade = new Phaser.Display.Color(color.r, color.g, color.b);
   
      if(alternating !== undefined){
        if (alternating) {
          shade.lighten(3);
        }
        else {
          shade.darken(3);
        }
      }
   
    return shade;
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
