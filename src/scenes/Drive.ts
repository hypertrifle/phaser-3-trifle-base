import BaseScene from "./BaseScene";
import Tools from "../plugins/global/Tools";
import { Scene, Cameras } from "phaser";
import { platform } from "os";
import { config } from "shelljs";
import Scenery from "../components/race/Scenery";
import TrackSystem, { ViewPortSettings, TrackCorner } from "../components/race/TrackSystem";
import { ControlSystem } from "../components/race/Controls";
import Car from "../components/race/Car";
import { runInThisContext } from "vm";
import PickUp from "../components/race/PickUp";

export default class DriveScene extends BaseScene {

  private _track: TrackSystem;
  private _controls: ControlSystem;
  viewPort: ViewPortSettings;


  private _skyBox: Phaser.GameObjects.Image;
  private _scenery: Scenery[];
  private _car: Car;


  private trackSegments: {bg: Phaser.GameObjects.Image,fg: Phaser.GameObjects.Image;}[];

  private _currentLapTime: number = 0;
  private _currentDistance: number = 0;

  dimensions: Phaser.Geom.Point;

  private _currentTimeValue: number = 0;
  private _currentTime: Phaser.GameObjects.Text;
  private _currentSpeed: Phaser.GameObjects.Text;


  private _pickups: PickUp[];


  // private _scenery:


  constructor() {
    super({
      key: "DriveScene",
      active: false
    });
    console.log("DriveScene::constructor");
    this.dimensions = new Phaser.Geom.Point(640, 360);

    this.viewPort = new ViewPortSettings(this.dimensions);
    this._track = new TrackSystem(this.viewPort, this);

    this.trackSegments = [];
    this._scenery = [];
    this._pickups = [];



  }

  preload() {
    console.log("DriveScene::preload");
    this.load.image("roadAlt", "assets/img/blank_road.png");


    this.load.image("button", "assets/img/buttonOne.png");

    this.load.image("replay", "assets/img/replay-button.png");
    this.load.image("highscores", "assets/img/highscores-button.png");

  }

  create() {
    super.create();

    this._track.trackData = this.tools.data.getDataFor("track") as TrackCorner[];
    this._track.gameplay.currentVelocity = 0;

    console.log("TRAK LLOADED",this._track.trackData );

    console.log("DriveScene::create");

    this.cameras.main.backgroundColor = Phaser.Display.Color.HexStringToColor("#00C0FF");
    this.resetGraphicItems();

    // car
    this._car = new Car(this, {
      positionFromBottom: 10,
      scale: 1
    });

    this.BuildScenery();
    this.generatePickups();
    this.buildUI();
    this._controls = new ControlSystem(this,this.viewPort);

    // this.win();

  }

  private BuildScenery() {
    for (let i = 0; i < this._track.gameplay.sceneryAmount; i++) {
      let s = new Scenery(this, {
        isLeft : Math.random() > 0.5,
        frame: (i % 50 === 0) ? "sign_shadow_right.png" : "palm_shadow_left.png",
        offset: new Phaser.Geom.Point((Math.random() * 1000), 0),
        totalBands: this.viewPort.totalBands,
        owner: this
      });
      s.y = (360 / 20) * i;
      s.alpha = 1;
      this._scenery.push(s);
    }

  }

  private generatePickups() {



    for (let i = 0; i < this._track.gameplay.pickupsPerLap; i++) {

      let offsetMax = (this._track.gameplay.lapDistance / (this._track.gameplay.pickupsPerLap + 3)) * 0.1;

      let s = new PickUp(this, {
        frame: "palm_shadow_left.png",
        totalBands: this.viewPort.totalBands,
        owner: this,
        lane: Math.round(Math.random() * 2),
        roadPosition: (this._track.gameplay.lapDistance / (this._track.gameplay.pickupsPerLap + 2) * i + 2) + Math.floor(Math.random() * offsetMax)
      });
      s.y = (360 / 20) * i;
      s.alpha = 1;
      this._pickups.push(s);
    }

    console.log("pickups generated:",this._pickups);
  }

  private buildUI() {

      console.log(this.tools.data.getDataFor("fonts.speed"));


    this._currentTime = this.add.text(this.dimensions.x - 130,5,"00:00:00",{
      fontFamily: "BIT",
      fontSize: "32px",
      color: "#ffffff",
      textAlign: "center"


  }
);
    this._currentSpeed = this.add.text(5,5,"100MPH", {
      fontFamily: "BIT",
      fontSize: "24px",
      color: "#ffffff"
  });
    this._currentTime.setOrigin(0,0);
    this._currentSpeed.setOrigin(0,0);

    // this._currentSpeed.x = this.dimensions.x - this._currentSpeed.width - 2;

  }

  resetGraphicItems() {


    // badd basic skybox layers.
    this._skyBox = this.add.sprite(320,this.viewPort.horizonHeight,"atlas.png","tmp_skybox_large.png");
    this._skyBox.setOrigin(0.5,1);


    let offset: number = 0;
    let alt: boolean = true;

    for (let i: number = 0; i < this.viewPort.totalBands + 1 ; i++) {

      if (i % this.viewPort.alternameAmount(i) === 0) {
        alt = !alt;
      }

      let roadScale: number = 1 / (i / 100);


      let bg_strip = this.add.sprite(320,360 - offset,"atlas.png" , "bgstrip1.png");
      let road = this.add.sprite(320,360 - offset,  "atlas.png" , "blank_road.png");
      offset += bg_strip.height;

      this.trackSegments.push({fg: road, bg: bg_strip});
    }
  }

  updatePhysics(time: number, delta: number) {

    let changeInAccleration = this._controls.currentYVector * this._track.gameplay.maxAccellerationPerSecond * delta;


    if (changeInAccleration > 0 ) {
      // its breaking or declerating
      this._track.gameplay.currentVelocity += changeInAccleration / 1000;
    } else if (changeInAccleration < 0) {

      this._track.gameplay.currentVelocity += changeInAccleration  / 100;
      // is accellerating
    }

    // topspeed
    this._track.gameplay.currentVelocity = Math.min(this._track.gameplay.currentVelocity,this._track.gameplay.maxVelocity);

    // no reverse
    this._track.gameplay.currentVelocity = Math.max(this._track.gameplay.currentVelocity,0);

    // apply any breaking from side of road();



    this._track.currenDistance += this._track.gameplay.currentVelocity;


    // handle the horizontal car control.
    this._car.x += (this._controls.currentXVector * this._track.gameplay.turnVelocityScalar * delta);

    // but we also want to apply any turning force.
    this._car.x -= this._track.currentBendOffset * 0.005 * this._track.gameplay.currentVelocity;

    // min and max then decelerate heavily

    let bounds = 100;


    if (this._car.x < bounds || this._car.x > this.dimensions.x - bounds) {
      if (this._car.x < this.dimensions.x / 2) {
        this._car.x = bounds;
      } else {
        this._car.x = this.dimensions.x - bounds;

      }


      this._track.gameplay.currentVelocity *= 0.98;
    }


    // TODO UPDATE VELOCITY ON ANYTHING ELSE


  }
  updateRender(time: number, delta: number) {

    this.updateTrack(time,delta);
    this.updateScenery(time,delta);
    this.updatePickups(time, delta);
  }

  updatePickups(time: number, delta: number){


    for (let i: number = 0; i < this._pickups.length;i ++) {


      let positionFromCamera = this._pickups[i].roadPosition - this._track.currenDistance;
      if(positionFromCamera < 0 || positionFromCamera > (this.dimensions.y-this.viewPort.horizonHeight)){
        this._pickups[i].setVisible(false);

        continue;
      }

      else {
        this._pickups[i].setVisible(true);
        let scale = this._track.getPickupScale(positionFromCamera,this.trackSegments.length);
        this._pickups[i].setScale(scale);
        this._pickups[i].x = this._track.getPickupLocation(positionFromCamera,this.trackSegments.length,this._pickups[i].roadPosition ); // position the road parts based on bend
        this._pickups[i].y = this.dimensions.y - positionFromCamera*0.5;
      }
      
    }

  }

  updateTrack(time: number, delta: number) {
    let alt = true;




    for (let i: number = 0; i < this.trackSegments.length;i ++) {

      // ferefences to forground (s) amd background (b)
      let s = this.trackSegments[i].fg;
      let b = this.trackSegments[i].bg;


      // j is neg from 0 => - horizon; for vaishing perspective.
      let j = s.y - 360;

      let scaledPosition = 1 - (i / this.trackSegments.length);

      let trakPositionFromCar = Math.abs(j);
      // console.log(trakPositionFromCar, time)


      s.scaleX = this._track.getScaleForSegment(trakPositionFromCar,this.trackSegments.length); // this handles our sclaing

      s.x = this._track.getPositionForSegment(trakPositionFromCar,this.trackSegments.length); // position the road parts based on bend

      // set correct texture and tinting for the banding effect.
      // Math.sign(Math.sin(this._track.currenDistance-i*0.5))

      let alt = (Math.sign(Math.sin(i * 0.2 + (this._track.currenDistance))) === 1);



      // alternate tints based on a signed sine wave.
      s.setFrame((alt) ? "blank_road.png" : "road_alt.png");
      s.tint = (alt) ? 0xffffff : 0xeeeeee;
      b.tint = (alt) ? 0xffffff : 0xeeeeee;



  }
  }
  updateScenery(time: number, delta: number) {
    for (let i: number = 0; i < this._scenery.length;i ++) {
      let s = this._scenery[i];

      // move them based on speed?!?!
      s.moveAndReset(this._track.gameplay.currentVelocity * delta * 0.025);



      let roadOffsetY = Math.min(Math.abs((s.y ) - this.dimensions.y), this.dimensions.y - this.viewPort.horizonHeight);

      let distanceToEdge: number = this._track.getSceneryOffsetMin(roadOffsetY,this.trackSegments.length,s.isLeft,s.offset.x);


      let scale = this._track.getSceneryScale(roadOffsetY,this.trackSegments.length);

      if (s.y < this.dimensions.y) {
        s.x = distanceToEdge;
        s.setScale(scale, scale);
      }

      // (we want to do some alpha?
      let alpha = Math.min(1, (scale * 0.1));


      // let relavativeYpostion:number = x.y




    }



    // temp skyboxx stuff
    this._skyBox.x = 320 + Math.sin(time * 0.0002) * 25;

  }

  updateUI(time: number, delta: number) {
      this._currentTime.text = this.raceTime;
      this._currentSpeed.text = Math.floor(this._track.gameplay.currentVelocity * 14).toString() + " KPH";

  }
  pad(n: string, width: number, z: string = "0") {
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
  }

  get raceTime(): string {
    let ms = Math.floor(this._currentTimeValue / 10) % 100;
    let seconds = Math.floor(this._currentTimeValue / 1000);

    return this.pad(Math.floor(seconds / 60) + "",2) + ":" + this.pad((seconds % 60).toString(),2) + ":" + this.pad(ms.toString(),2);


  }

  update(time: number, delta: number) {




    if (
      this._track.currenDistance > this._track.gameplay.lapDistance && !this.ended
    ) {
      this.win();
    }

    this._currentTimeValue += delta;

    super.update(time, delta);
    this._controls.update(time, delta, this._car, this);
    this.updatePhysics(time, delta);
    this.updateRender(time, delta);

    if (this.ended) {
      return;
    }
    this.updateUI(time, delta);

    // this.scene.switch("boot");
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
      this._track.currenDistance = 0;
      this._track.gameplay.currentVelocity = 0;

      this.ended = false;
  }

  ended: boolean = false;

  shutdown() {
    // drop references to anything we have in create
    this.tools = null;

    super.shutdown();
  }
}
