import Car from '../components/race/Car';
import { ControlSystem } from '../components/race/Controls';
import Obstacle from '../components/race/Obstacle';
import PickUp from '../components/race/PickUp';
import Scenery from '../components/race/Scenery';
import { FormSubmissionData } from '../plugins/global/HTMLUtils';
import Tools from '../plugins/global/Tools';
import DataUtils from '../plugins/utils/DataUtils';
import BaseScene from './BaseScene';

/**
 * the length of a single segment
 *
 * @enum {number}
 */
enum ROAD_LENGTH {
  NONE = 0,
  SHORT = 200,
  MEDIUM = 500,
  LONG = 1000
}

/**
 * the curve factor of a segment of road
 *
 * @enum {number}
 */
enum ROAD_CURVE {
  NONE = 0,
  EASY = 0.015,
  MEDIUM = 0.04,
  HARD = 0.08
}

/**
 * global properties used but the rendering / physics engine
 *
 * @class RaceSettings
 */
class RaceSettings {
  /**
   * abitry width of road - not based with any screen based varibles
   *
   * @type {number}
   * @memberof RaceSettings
   */
  roadWidth: number = 4000;
  cameraHeight: number = 1500;
  drawDistance: number = 1500;
  FOV: number = 120;
  fogDensity: number = 0;
  altLength: number = 20;
  segmentLength: number = 20;
  trackLength: number = 0;
  cameraDepth: number = 0;
  maxAccellerationPerSecond: number = 0.8;
  maxVelocity: number = 10;

  _closeColour: number = 0xfae873;
  _farColour: number = 0xf58c36;

  _skyBottomColor: number = 0x00dcff;
  _skyTopColor: number = 0x00c0ff;

  get closeColour() {
    return Phaser.Display.Color.ValueToColor(this._closeColour);
  }

  get farColour() {
    return Phaser.Display.Color.ValueToColor(this._farColour);
  }

  get skyBottomColor() {
    return Phaser.Display.Color.ValueToColor(this._skyBottomColor);
  }

  get skyTopColor() {
    return Phaser.Display.Color.ValueToColor(this._skyTopColor);
  }
}

/**
 * state of gameplay
 *
 * @class CurrentState
 */
class CurrentState {
  speed: number = 0;
  position: number = 0;
  playerX: number = 0;
  g: number = 0;

}

/**
 * settings & properties for a single scenery item
 *
 * @interface SceneryItem
 */
interface SceneryItem {
  frameName: string,
  isLeft: boolean,
  offset: number
}

/**
 * what our sever expects for a single score entry
 *
 * @interface ScoreEntry
 */
interface ScoreEntry {
  name: string;
  position: number;
  score: number;
}


/**
 * properties of a single pickup (model)
 *
 * @interface Pickup
 */
interface Pickup {
  lane: number,
  used: boolean
}

/**
 * on micro segment of a track, what we render in bands, a track segment is made up 
 * of many of these (segment size)
 *
 * @interface TrackSegment
 */
interface TrackSegment {
  index: number;
  p1: WCS;
  p2: WCS;
  alt: boolean;
  isVisible: boolean;
  curve: number;
  scenery?: SceneryItem[];
  obstacles?: Pickup[];
  pickups?: Pickup[];
}

/**
 * a display object consisiting of a single band of the drawing system
 *
 * @interface TrackDisplaySegment
 */
interface TrackDisplaySegment {
  bg: Phaser.GameObjects.Image;
  fg: Phaser.GameObjects.Image;
  hasBeenUsed: boolean;
}

const ROAD = {
  LENGTH: { NONE: 0, SHORT: 25, MEDIUM: 50, LONG: 100 }, // num segments
  CURVE: { NONE: 0, EASY: 2, MEDIUM: 4, HARD: 6 }
};


/**
 * world, camera, screen - these are the basic models of where items are in the world
 * where they should appear in the camera viewport and where they should be on the screen
 * mainly handled by the the project method.
 * 
 *
 * @interface WCS
 */
interface WCS {
  world: Phaser.Math.Vector3;
  camera: Phaser.Math.Vector3;
  screen: Phaser.Math.Vector4;
  scale: number;
}

/**
 * this is our whole gameplay scene, not ideal having
 * all of this on one class but nature of project means 
 * this was the best way to work.
 *
 * @export
 * @class Drive2Scene
 * @extends {BaseScene}
 */
export default class Drive2Scene extends BaseScene {

  /**
   * tools is a coolection of plugins that are useful in phaser, created by tricky.
   *
   * @type {Tools}
   * @memberof Drive2Scene
   */
  public tools: Tools;

  /**
   * controls handels both keyboard and touch input,
   * both produce an x and y value based on input
   * and handles control instructions.
   *
   * @private
   * @type {ControlSystem}
   * @memberof Drive2Scene
   */
  private _controls: ControlSystem;
  /**
   * settings of this gameplay
   *
   * @type {RaceSettings}
   * @memberof Drive2Scene
   */
  settings: RaceSettings;


  /**
   * our cenery pool, a group of display items to use for scenery.
   *
   * @private
   * @type {Scenery[]}
   * @memberof Drive2Scene
   */
  private _scenery: Scenery[];

  /**
   * car class, mainly a display item,
   * physics is handle in this class
   *
   * @private
   * @type {Car}
   * @memberof Drive2Scene
   */
  private _car: Car;

  /**
   *
   * gameplay state
   * @private
   * @type {CurrentState}
   * @memberof Drive2Scene
   */
  private _state: CurrentState;


  /**
   * model of track
   *
   * @private
   * @type {TrackSegment[]}
   * @memberof Drive2Scene
   */
  private trackSegments: TrackSegment[];
  /**
   * pool of track display items.
   *
   * @private
   * @type {TrackDisplaySegment[]}
   * @memberof Drive2Scene
   */
  private trackDisplaySegments: TrackDisplaySegment[];


  /**
   * dimension of this game, phaser game.config.width|height is typed as any,
   * this is always of number type.
   *
   * @type {Phaser.Geom.Point}
   * @memberof Drive2Scene
   */
  dimensions: Phaser.Geom.Point;

  /**
   * current game time (this lap)
   *
   * @private
   * @type {number}
   * @memberof Drive2Scene
   */
  private _currentTimeValue: number = 0;
  /**
   * time display tesxt
   *
   * @private
   * @type {Phaser.GameObjects.Text}
   * @memberof Drive2Scene
   */
  private _currentTime: Phaser.GameObjects.Text;
  /**
   * speed display text
   *
   * @private
   * @type {Phaser.GameObjects.Text}
   * @memberof Drive2Scene
   */
  private _currentSpeed: Phaser.GameObjects.Text;

  /**
   * an array of items displays above the horizon
   *
   * @private
   * @type {Phaser.GameObjects.Image[]}
   * @memberof Drive2Scene
   */
  private _horizonItems: Phaser.GameObjects.Image[] = []


  /**
   * pickup display pool
   *
   * @private
   * @type {PickUp[]}
   * @memberof Drive2Scene
   */
  private _pickups: PickUp[];


  constructor() {

    super({
      key: "Drive2Scene",
      active: false
    });

    console.log("Drive2Scene::constructor");

    //initilise settings.
    this.settings = new RaceSettings();

    //initilise state.
    this._state = new CurrentState();
  }

  /**
   * any items to load
   *
   * @memberof Drive2Scene
   */
  preload() {
    console.log("Drive2Scene::preload");

    //load all required sounds
    this.load.audio('car_engine_1', ['assets/audio/car-3-pitch-1.mp3', 'assets/audio/car-3-pitch-1.ogg']);
    this.load.audio('car_engine_2', ['assets/audio/car-3-pitch-2.mp3', 'assets/audio/car-3-pitch-2.ogg']);
    this.load.audio('car_engine_3', ['assets/audio/car-3-pitch-3.mp3', 'assets/audio/car-3-pitch-3.ogg']);
    this.load.audio('car_engine_3', ['assets/audio/car-3-pitch-3.mp3', 'assets/audio/car-3-pitch-3.ogg']);
    this.load.audio('car_engine_4', ['assets/audio/car-3-pitch-4.mp3', 'assets/audio/car-3-pitch-4.ogg']);
    this.load.audio('ice_berg_crash', ['assets/audio/hit.mp3', 'assets/audio/Hit.ogg']);
    this.load.audio('pickup', ['assets/audio/sfx_coin_cluster5.mp3', 'assets/audio/sfx_coin_cluster5.ogg']);
    this.load.audio('rumble', ['assets/audio/rumble.mp3', 'assets/audio/rumble.ogg']);
    this.load.audio('ready', ['assets/audio/ready.mp3', 'assets/audio/ready.ogg']);
    this.load.audio('go', ['assets/audio/go.mp3', 'assets/audio/go.ogg']);
    this.load.audio('brake', ['assets/audio/break.mp3', 'assets/audio/break.ogg']);
    this.load.audio('music', ['assets/audio/music.mp3', 'assets/audio/music.ogg']);



  }

  /**
   * array of sengine sounds (they are still de-tunes but give illusion of gears)
   *
   * @type {Phaser.Sound.BaseSound[]}
   * @memberof Drive2Scene
   */
  engineSounds: Phaser.Sound.BaseSound[] = [];
  hitSound: Phaser.Sound.BaseSound;
  _rumbleSound: Phaser.Sound.BaseSound;
  _readySound: Phaser.Sound.BaseSound;
  _goSound: Phaser.Sound.BaseSound;
  _brakeSound: Phaser.Sound.BaseSound;
  _music: Phaser.Sound.BaseSound;
  _pickupSound: Phaser.Sound.BaseSound;


  /**
   * phasers main entry point for creating display items.
   *
   * @memberof Drive2Scene
   */
  create() {
    super.create();
    this.dimensions = new Phaser.Geom.Point(this.game.config.width as number, this.game.config.height as number);

    //model
    this.resetRoad();

    //view
    this.gernerateAboveHorizon();

    //disaply items
    this.genRoadDisplayPool();

    //add scenery to model
    this.generateScenery();

    //init car
    this._car = new Car(this, {
      positionFromBottom: 40,
      scale: 1
    })


    //init controls
    this._controls = new ControlSystem(this);

    //update just to normalise
    this._controls.update(0, 16, this._car, this);


    //load sounds.
    this.hitSound = this.sound.add("ice_berg_crash", { volume: 1 });
    this._pickupSound = this.sound.add("pickup", { volume: 1 });
    this._rumbleSound = this.sound.add("rumble", { volume: 0.3 });
    this._readySound = this.sound.add("ready", { volume: 0.5 });
    this._goSound = this.sound.add("go", { volume: 0.5 });

    this._brakeSound = this.sound.add("brake", { volume: 0.4, detune: -700 });
    this._music = this.sound.add("music", { volume: 0.7, loop: true });
    this._music.play();
    this.engineSounds = [];

    for (let i = 1; i < 5; i++) {
      this.engineSounds[i - 1] = this.sound.add("car_engine_" + i, { loop: true, volume: 0.3 });
      this.engineSounds[i - 1].stop();

    }


    //top layer UI items.
    this.addUI();

    //start the game endend
    this.ended = true;

    //with leaderboard disaply.
    this.showScoresDisplay();


    //add controls propmpt if nessicery on first load.
    this._controls.addPromt();





  }





  /**
   * coloured bar of speedo contents
   *
   * @private
   * @type {Phaser.GameObjects.Image}
   * @memberof Drive2Scene
   */
  private _spedo: Phaser.GameObjects.Image;
  /**
   * masked used for speedo.
   *
   * @private
   * @type {Phaser.GameObjects.Graphics}
   * @memberof Drive2Scene
   */
  private _spedoMask: Phaser.GameObjects.Graphics;

  /**
   * build UI visuals
   *
   * @memberof Drive2Scene
   */
  addUI() {


    let bg = this.add.graphics({});

    //spedo bg
    bg.fillStyle(0x333333, 1);
    bg.fillRoundedRect(10, 6, 210, 20, 4);


    //timer BG
    bg.fillRoundedRect(this.dimensions.x - 98, 6, 93, 20, 4);


    this._spedo = this.add.image(5, 5, "atlas.png", "bar_back.png");
    this._spedo.setOrigin(0, 0);
    this._spedo.setScale(0.5, 0.5);
    let fog = this.add.image(5, 5, "atlas.png", "bar_front.png");
    fog.setOrigin(0, 0);
    fog.setScale(0.5, 0.5);



    this._spedoMask = this.make.graphics({});



    this._spedo.mask = new Phaser.Display.Masks.GeometryMask(this, this._spedoMask);


    this._currentTime = this.add.text(this.dimensions.x - 50, 3, "00:00:00", {
      fontFamily: "charybdisregular",
      fontSize: "24px",
      color: "#ffffff",
      align: "center"


    }
    );

    //TODO: add shodow to fonts.
    this._currentSpeed = this.add.text(217, 3, "100MPH", {
      fontFamily: "charybdisregular",
      fontSize: "24px",
      color: "#ffffff",
      align: "center"

    });
    this._currentTime.style.setAlign("center");
    this._currentSpeed.style.setAlign("center");
    this._currentTime.setOrigin(0.5, 0);
    this._currentSpeed.setOrigin(1, 0);


    this.countDownDisplay = this.add.text(this.dimensions.x / 2, this.dimensions.y / 3, "3", {
      fontFamily: "charybdisregular",
      fontSize: "128px",
      color: "#16bdf7",
      align: "center",
      stroke: "#ffffff",
      strokeThickness: 8
    });
    this.countDownDisplay.visible = false;

    this.countDownDisplay.setOrigin(0.5, 0.5)

    this.updateUI(0.5);
  }

  /**
   *update ui to reflect current game state
   *
   * @param {number} speedPercent
   * @param {number} [time=10000]
   * @memberof Drive2Scene
   */
  updateUI(speedPercent: number, time: number = 10000) {
    speedPercent = Math.min(1,speedPercent);
    this._spedoMask.clear();
    this._spedoMask.fillStyle(0xffffff, 1);
    this._spedoMask.fillRect(this._spedo.x, this._spedo.y, this._spedo.width * this._spedo.scaleX * speedPercent, this._spedo.height * this._spedo.scaleY);
    this._currentSpeed.text = Math.floor(speedPercent * 220).toString() + " MPH";
    this._currentTime.text = this.timeString(this._currentTimeValue);


    let engineSpeed = Math.round((1 - speedPercent) * this.engineSounds.length);
    for (let i = 0; i < this.engineSounds.length; i++) {
      if (i === engineSpeed) {

        this.engineSounds[i].stop();
        this.engineSounds[i] = this.sound.add("car_engine_" + (i + 1), { loop: true, volume: 0.3, detune: speedPercent * 1000 });
        this.engineSounds[i].play();

      } else {
        this.engineSounds[i].stop();

      }
    }

    //   this.engineSound.stop();
    //   this.engineSound.play(null,{ loop:true, 
    //     volume:Math.min(0.1,speedPercent),
    //     detune:speedPercent*1000
    //   }

    //  )
    // this.sound.setDetune(speedPercent*1000);
    // this.sound.volume = speedPercent;


  }



  /**
   * format millisections into a string if format mm:ss:msms
   *
   * @param {number} time
   * @returns {string}
   * @memberof Drive2Scene
   */
  timeString(time: number): string {

    if (time <= 0) {
      return "00:00:00";
    }

    let ms = Math.floor(time / 10) % 100;
    let seconds = Math.floor(time / 1000);

    return this.pad(Math.floor(seconds / 60) + "", 2) + ":" + this.pad((seconds % 60).toString(), 2) + ":" + this.pad(ms.toString(), 2);


  }

  /**
   * pad a string toa certain length with a certain charecter
   *
   * @param {string} n
   * @param {number} width
   * @param {string} [z="0"]
   * @returns
   * @memberof Drive2Scene
   */
  pad(n: string, width: number, z: string = "0") {
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
  }
  /**
   * build visuals above horizon
   *
   * @memberof Drive2Scene
   */
  gernerateAboveHorizon() {
    let sky = this.add.graphics();

    for (let i = 0; i < 50; i++) {
      //@ts-ignore
      var c: Phaser.Display.Color = this.getInterpoadtedColor(this.settings._skyTopColor, this.settings._skyBottomColor, i, 5);
      sky.fillStyle(c.color, 1);
      sky.fillRect(0, i * 8, this.dimensions.x, 8);

    }


    //bacgroound clouds
    let cloud = this.add.image(this.dimensions.x / 2, 60, "atlas.png", "clouds_0.png");
    cloud.setDataEnabled();
    cloud.data.set("paralax", 0.2);
    cloud.data.set("velocity", 0.005);
    this._horizonItems.push(cloud);


    // badd basic skybox layers.

    for (let i = 2; i >= 0; i--) {
      let position = 0;
      //offset the city visuals to left then right.
      if (i === 2) {
        position -= 100;
      } else if (i === 1) {
        position += 100;

      }

      let item = this.add.image((this.dimensions.x / 2) + position, 60, "atlas.png", "scenery_" + i + ".png");
      item.setDataEnabled();
      item.data.set("paralax", (3 - i) * 0.1);
      item.data.set("velocity", 0);


      this._horizonItems.push(item);
    }

    //forground clouds
    let cloud2 = this.add.image(this.dimensions.x / 2, 60, "atlas.png", "clouds_1.png");
    cloud2.setDataEnabled();
    cloud2.data.set("paralax", 0.2);
    cloud2.data.set("velocity", 0.01);
    this._horizonItems.push(cloud2);

    let blimp = this.add.image(this.dimensions.x / 1.5, 30, "atlas.png", "blimp.png");
    blimp.setDataEnabled();
    blimp.data.set("paralax", 0.4);
    blimp.data.set("velocity", 0.005);
    this._horizonItems.push(blimp);


  }


  /**
   * move our skybox items
   *
   * @param {number} changeInXVel
   * @param {number} delta
   * @memberof Drive2Scene
   */
  updateAboveHorizon(changeInXVel: number, delta: number) {
    for (let i = 0; i < this._horizonItems.length; i++) {

      //any movement based on the corners (curve length scaled by speed)
      this._horizonItems[i].x -= (changeInXVel * delta * this._horizonItems[i].data.get("paralax"));

      //any basic movement based on velocity (mainly for clouds)
      this._horizonItems[i].x -= (this._horizonItems[i].data.get("velocity") * delta);

      if (this._horizonItems[i].x + (this._horizonItems[i].width / 2) < 0) {
        this._horizonItems[i].x += this._horizonItems[i].width + this.dimensions.x;
      }


    }
  }

  /**
   * reset the models of scenery, pickups and obstacles
   *
   * @memberof Drive2Scene
   */
  resetRoadExtras(){
        //distrubut our items in the models throughout the track
        let sceneryDenisty = 100;
        let totalTrees = Math.floor(this.trackSegments.length / (sceneryDenisty)); //divide for 2 for bothsides.
    
    for (let i = 0; i < totalTrees; i++) {
      let roadPosition = i * sceneryDenisty;
      this.trackSegments[i * sceneryDenisty].scenery = [];

      let offset = Math.random();

      if (i % 20 === 17) {
      }

      let frame: string = "palm_shadow_left.png";

      if (i % 20 === 17) {
        offset += 4;
        frame = "billboard.png"
      } else if (i % 20 === 6) {
        offset += 8;
        frame = "billboard2.png"
      }


      this.trackSegments[i * sceneryDenisty].scenery.push({
        frameName: frame,
        isLeft: (i % 2 === 0) ? true : false,
        offset: offset
      }

      );



    }


    this.trackSegments[200].scenery = [];
    this.trackSegments[200].scenery.push({
      frameName: "end.png",
      isLeft: false,
      offset: 0
    });

    this.trackSegments[this.trackSegments.length - (3000)].scenery = [];
    this.trackSegments[this.trackSegments.length - (3000)].scenery.push({
      frameName: "start.png",
      isLeft: false,
      offset: 0
    });

    //distribute our obstacles 
    let obstacleDensity = 2000;
    let totalObstacles = Math.floor(this.trackSegments.length / (obstacleDensity));

    for (let i = 0; i < totalObstacles; i++) {

      this.trackSegments[i * obstacleDensity].obstacles = [];

      this.trackSegments[i * obstacleDensity].obstacles.push({
        lane: Phaser.Math.RND.integerInRange(0, 2) - 1,
        used: false
      });
    }


    //distribute our pickups.
    let pickupDesnity = 3566;
    let totalPickups = Math.floor(this.trackSegments.length / (pickupDesnity));

    for (let i = 0; i < totalPickups; i++) {

      this.trackSegments[i * pickupDesnity].pickups = [];

      this.trackSegments[i * pickupDesnity].pickups.push({
        lane: Phaser.Math.RND.integerInRange(0, 2) - 1,
        used: false
      });
    }



  }

  /**
   * genreate our scenery display pool
   *
   * @memberof Drive2Scene
   */
  generateScenery() {

    this.anims.create({ key: 'pickup-animation', frames: this.anims.generateFrameNames('atlas.png', {suffix:".png", prefix: 'pickup/pickup_', start:17 , end: 29, zeroPad: 5 }), repeat: -1 });

    this.anims.create({ key: 'pickup-kill', frames: this.anims.generateFrameNames('atlas.png', {suffix:".png", prefix: 'pickup/pickup_', start:29 , end: 36, zeroPad: 5 }), repeat: -1 });

    this._pickups = [];

    for (let i = 0; i < 5; i++) {
      let pickup = new PickUp(this,{
      });
      this._pickups.push(pickup);
    }



    this._scenery = [];

    //generate our visual items to use.
    for (let i = 0; i < 25; i++) {
      let sceneryItem = new Scenery(this, {});
      this._scenery.push(sceneryItem);
    }

    


  


    this.resetRoadExtras();
  }


  /**
   * generate our road display item pool,
   * made up of a background (full width of screen)
   * and the road (projected based on camera)
  *
   * @memberof Drive2Scene
   */
  genRoadDisplayPool() {
    this.trackDisplaySegments = [];
    for (var n = 0; n < 200; n++) { // arbitrary amount of images to 

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

  /**
   * take a road segment and build the mini segments that make that curve.
   *
   * @param {number} curve
   * @memberof Drive2Scene
   */
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

  /**
   * andd a single segment with properties.
   *
   * @param {number} enter
   * @param {number} hold
   * @param {number} leave
   * @param {number} curve
   * @memberof Drive2Scene
   */
  addRoadSegment(enter: number, hold: number, leave: number, curve: number) {
    var n;
    for (n = 0; n < enter; n++)
      this.addSegment(this.easeIn(0, curve, n / enter));
    for (n = 0; n < hold; n++)
      this.addSegment(curve);
    for (n = 0; n < leave; n++)
      this.addSegment(this.easeInOut(curve, 0, n / leave));
  }

  /**
   * add a striaght bit of road.
   *
   * @param {number} [num=ROAD_LENGTH.MEDIUM]
   * @memberof Drive2Scene
   */
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

    // this.addStraight(ROAD_LENGTH.LONG);
    // this.addStraight(ROAD_LENGTH.LONG);
    // this.addStraight(ROAD_LENGTH.LONG);
    // this.addStraight(ROAD_LENGTH.LONG);
    // this.addStraight(ROAD_LENGTH.LONG);
    // this.addStraight(ROAD_LENGTH.LONG);
    // this.addStraight(ROAD_LENGTH.LONG);


    this.addStraight(ROAD_LENGTH.SHORT / 4);
    this.addStraight(ROAD_LENGTH.MEDIUM);
    this.addSCurves();
    this.addStraight(ROAD_LENGTH.SHORT);
    this.addCurve(ROAD_LENGTH.LONG, -ROAD_CURVE.HARD);
    this.addStraight(ROAD_LENGTH.SHORT);
    this.addCurve(ROAD_LENGTH.LONG, -ROAD_CURVE.MEDIUM);
    this.addCurve(ROAD_LENGTH.LONG, ROAD_CURVE.MEDIUM);
    this.addCurve(ROAD_LENGTH.LONG, -ROAD_CURVE.EASY);
    this.addStraight(ROAD_LENGTH.SHORT);
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
    if (this._state.speed > 0.2) {

      // let easeIn = Math.max(3, this._state.speed)

      this._car.x = this._car.x + (this._controls.currentXVector * delta) / Math.max(2, (this._state.speed / 2.5));

      //g from curve
      this._car.x = this._car.x - (this._state.g * delta) * Math.max(0.1, this._state.speed * 0.8);

    }

    this._car.update(delta);
    this._car.resetRumble();


    if (this._car.x < 100 && this._state.speed > 0.2) {
      this._state.speed *= (1 - (0.006 * delta));

      this._car.rumble();
      this.cameras.main.shake(250, 0.005);
      if (!this._rumbleSound.isPlaying) {
        this._rumbleSound.play();
      }



    } else if (this._car.x > this.dimensions.x - 100 && this._state.speed > 0.2) {
      this._state.speed *= (1 - (0.006 * delta));
      this._car.rumble();
      this.cameras.main.shake(250, 0.005);
      if (!this._rumbleSound.isPlaying) {
        this._rumbleSound.play();
      }


    }
    this._car.x = Math.min(this._car.x, this.dimensions.x - 50);
    this._car.x = Math.max(this._car.x, 50);

    if (!this.ended && !this.inCountDown) {
      if (this._controls.currentYVector < -0.8 && this._state.speed > 1) {
        this._car.rumble();
        this._brakeSound.play();
        // console.log("car breaking",this._controls.currentYVector );
      }
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
    // this._state.speed = Math.min(this._state.speed, this.settings.maxVelocity);

    if(this._state.speed > this.settings.maxVelocity){
      this._state.speed -= delta/500;
    }

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


    this.tools.html.addFormAndlistenForSubmit(this.onHTMLFormSubmit, this, this.timeString(this._currentTimeValue));


  }

  onHTMLFormSubmit(object?:FormSubmissionData){
    if(object){
      this.showScoresDisplay(object);
    } else {
      this.showScoresDisplay();

    }
  }


  showScoresDisplay(submitData?:FormSubmissionData) {
    this.wingroup = this.add.container(this.dimensions.x / 2, this.dimensions.y / 2);

  

   

    let bg = this.add.graphics({});
    bg.fillStyle(0x000000, 0.8);
    bg.fillRect(-300, -160, 600, 320);

    this.wingroup.add(bg);

    let replaybutton = this.add.image(0, 100, "atlas.png", "replay_up.png");

    replaybutton.setInteractive();
    // highscores.setInteractive();

    replaybutton.on("pointerup", this.reset.bind(this));
    this.wingroup.add(replaybutton);

    
    let scoreString = "";
    
    //if we have submitted our score.
    if(submitData){
      
      
      let scores:{score:number, name?:string, client_secret:string, email?:string, marketing?:string} = 
      {
        score: Math.round(this._currentTimeValue),
        name: submitData.name,
        client_secret : DataUtils.getTokenForKey("nu"),
        email: submitData.email,
        marketing: submitData.marketing
      }
      
      scoreString ="s=" + btoa(JSON.stringify(scores)).replace(/[a-zA-Z]/g,
        function(c){
          //@ts-ignore
          return String.fromCharCode((c<="Z"?90:122)>=(c=c.charCodeAt(0)+13)?c:c-26);
        });
      }
      
      try {
        //  load the scores for the current player.
        let http = new XMLHttpRequest();
        let url = 'scores.php';
        let params = scoreString;
        http.open('POST', url, true);

        //Send the proper header information along with the request
        http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

        http.onreadystatechange = function() {//Call a function when the state changes.
            if(http.readyState == 4 && http.status == 200) {
                this.popuplateScores(http.responseText);
            }
        }.bind(this);




      
        http.send(params);
        } catch(e){
          console.error("error retrieving scores.... maybe none exist?");
        }



    this.load.start();
  }

  popuplateScores(scoresJSON?:any) {
    if(!scoresJSON){
      return;
    }
    let scoresString = "";
    // let scores: ScoreEntry[] = this.cache.json.get("high_score_results");

    let scores: ScoreEntry[] = JSON.parse(scoresJSON);


    if(scores !== undefined){

    for (let i = 0; i < scores.length; i++) {
      let entry = scores[i];


      //rank
      scoresString += this.pad(entry.position.toString(), 4, " ");
      scoresString += this.pad(entry.name, 15, " ");
      scoresString += this.pad(this.timeString(entry.score), 15, " ");
      scoresString += "\n";

    }

  } else {
    //invalid scores recived
    scoresString = "  UNABLE TO LOAD SCORES\nPLEASE TRY AGAIN LATER..."
  }

    let scoreText = this.add.text(2, -140, scoresString, {
      fontFamily: "charybdisregular",
      fontSize: "32px",
      color: "#ffffff",
      textAlign: "center"
    });

    scoreText.setOrigin(0.5, 0.0);

    scoreText.style.baselineX = 40;

    this.wingroup.add(scoreText);
  }

  wingroup: Phaser.GameObjects.Container | null;

  reset() {
    if (this.wingroup) {
      this.wingroup.destroy();
    }
    this.resetRoad();
    this.resetRoadExtras();

    this._currentTimeValue = -3;
    this._state.position = 0;//this.settings.trackLength -1000;
    this._state.speed = 0;
    this._state.playerX = 0;

    this.ended = false;
    this.inCountDown = true;
    this.countDownValue = 3;
  }
  inCountDown: boolean = false;
  countDownValue: number = 3;
  previousCountDown: number = 4;


  ended: boolean = false;

  // reset() {
  //   this._state.position = 0;
  //   this._state.speed = 0;
  //   this._state.position = 0;

  //   this._state.speed = 10;


  // }

  update(time: number, delta: number) {
    super.update(time, delta);

    this._controls.checkPrompt();

    this.updateUI(this._state.speed / this.settings.maxVelocity);



    let baseSegment = this.findSegment(this._state.position);




    this.updatePhysics(baseSegment, delta);
    this.updateAboveHorizon(this._state.g * (this._state.speed / this.settings.maxVelocity), delta);
    //update the controls



    this.settings.cameraDepth = 1 / Math.tan((this.settings.FOV / 2) * Math.PI / 180);
    this._state.position += this._state.speed * delta;


    if (baseSegment.obstacles && baseSegment.obstacles.length > 0) {
      //check we overlap with the pickup, if so enable speed boost, remove pickup

    }

    // set all segments to not visible?
    this.updateRoadModel(baseSegment);

    this.renderRoad(time, delta);

    if (this.inCountDown) {

      this.countDownValue -= (delta / 1000);
      if (this.countDownValue < 0) {
        this._goSound.play();
        this.inCountDown = false;
        this.countDownDisplay.visible = false;



      } else {


        if (Math.ceil(this.countDownValue) != this.previousCountDown) {

          this._readySound.play();
          this.previousCountDown = Math.ceil(this.countDownValue);


          this.countDownDisplay.visible = true;
          this.countDownDisplay.text = "" + this.previousCountDown;
        }
      }
      return;
    }

    if (this.ended) {
      this._controls.cursorValues.y = Math.max(-1, this._controls.cursorValues.y - 0.05);
      this._controls.cursorValues.x *= 0.8;
      return;
    }
    this._controls.update(time, delta, this._car, this);

    this.checkGameState(delta);

  }

  countDownDisplay: Phaser.GameObjects.Text;

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

    this.resetDisplayItems();

    let previousPosition: number = -1;


    let previousAlt: boolean = false;
    let tint: number = this.settings._farColour;
    //now we can render each strip?
    for (let n = this.trackSegments.length - 1; n >= 0; n--) {
      let seg = this.trackSegments[n];

      //if this segment isn't in draw distance / we have gone past it we dont need to render.
      if (!seg.isVisible) {
        continue;
      }

      //set the track scales.
      const y = Math.abs(seg.p2.screen.y - seg.p1.screen.y) / (this.settings.segmentLength / 10); // this 10 is not really based on anything, I think it is to do with camerea projection.


      //any scenery items?
      if (seg.scenery && seg.scenery.length > 0 && previousPosition !== -1) {

        for (let k: number = 0; k < seg.scenery.length; k++) {

          //currently we can only have one item per segment so lets just grab that.
          let model = seg.scenery[k];

          //grab one from the pool.
          let s = this.getFirstAvalibleSceneryItem();

          s.visible = true;
          s.setFrame(model.frameName);

          //position.
          s.y = seg.p1.screen.y;

          if (model.frameName === "start.png" || model.frameName === "end.png") {
            s.x = seg.p1.screen.x;
          } else {
            s.x = seg.p1.screen.x + ((model.isLeft) ? -seg.p1.screen.w : seg.p1.screen.w) * (0.1 * model.offset);
          }

          // start and end items,



          //maybe camera.z? factor in track distance and segment legnth?
          let scale = (seg.p1.scale * this.settings.roadWidth) * 1;
          s.setScale((model.isLeft) ? scale * -1 : scale, scale);
          let a = Math.min(1, scale * 12); //pop in.
          s.setAlpha(a);

        }
      }

      //any obstacle items?
      if (seg.obstacles && seg.obstacles.length > 0 && previousPosition !== -1) {



        //currently we can only have one item per segment so lets just grab that.
        let model = seg.obstacles[0];

        if (!model.used) {

          //grab one from the pool.
          let s = this.getFirstAvalibleSceneryItem();

          s.visible = true;
          s.setFrame("iceberg.png");

          //position.
          s.y = seg.p1.screen.y;

          // s.x = seg.p1.screen.x + ((seg.p1.screen.w *offset)*1000);
          s.x = seg.p1.screen.x + (seg.p1.screen.w) * (0.24 * model.lane);

          // start and end items,



          //maybe camera.z? factor in track distance and segment legnth?
          let scale = (seg.p1.scale * this.settings.roadWidth) * 0.2;
          s.setScale(scale, scale);
          let a = Math.min(1, scale * 15); //pop in.
          s.setAlpha(a);

          if (Phaser.Geom.Rectangle.Overlaps(s.getBounds(), this._car.bounds)) {
            model.used = true;
            this._state.speed *= 0.25;
            this.hitSound.play();
            this.cameras.main.shake(250, 0.02);
            console.log("hit");
          }
        }




      }


      //any pickup items?
      if (seg.pickups && seg.pickups.length > 0 && previousPosition !== -1) {



        //currently we can only have one item per segment so lets just grab that.
        let model = seg.pickups[0];

        if (!model.used) {

          //grab one from the pool.
          let s = this.getFirstAvaliblePickupItem();

          s.visible = true;
          // s.setFrame("iceberg.png");
          // s.play("pickup-animation");

          //position.
          s.y = seg.p1.screen.y;

          // s.x = seg.p1.screen.x + ((seg.p1.screen.w *offset)*1000);
          s.x = seg.p1.screen.x + (seg.p1.screen.w) * (0.24 * model.lane);


          let scale = (seg.p1.scale * this.settings.roadWidth) * 2;
          s.setScale(scale, scale);

          let a = Math.min(1, scale * 15); //pop in.

          s.setAlpha(a);

          if (Phaser.Geom.Rectangle.Overlaps(s.getBounds(), this._car.bounds)) {
            model.used = true;
            this._state.speed *= 1.3;
            this._pickupSound.play();
            // this.cameras.main.shake(250, 0.02);
          }
        } 




      }


      //we are going to cull certain road segments now if they overlap for performance.
      if (Math.round(seg.p1.screen.y) === Math.round(previousPosition) || previousPosition === -1) {
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





      if (seg.alt != previousAlt) {
        previousAlt = seg.alt;
        let shade = this.getInterpoadtedColor(this.settings._closeColour, this.settings._farColour, seg.p1.camera.z, this.settings.drawDistance * this.settings.segmentLength, previousAlt);

        tint = shade.color;// Phaser.Display.Color;//tint.//(seg.alt) ? this.settings.closeColour : this.settings.farColour;
      }
      visual.bg.tint = tint

      visual.bg.setScale(1, y);
      visual.fg.setScale(seg.p1.screen.w / this.dimensions.x, y);

      visual.fg.x = seg.p1.screen.x;


    }

    // console.log("Pool sizes used (scenery, track)", this.benchCount, this.benchCountRoad)

  }

  private getInterpoadtedColor(color1: number, color2: number, value: number, total: number, alternating?: boolean): Phaser.Display.Color {

    let color: ColorObject = Phaser.Display.Color.Interpolate.ColorWithColor(
      Phaser.Display.Color.ValueToColor(color1),
      Phaser.Display.Color.ValueToColor(color2),
      total,
      value
    );

    // @ts-ignore
    let shade = new Phaser.Display.Color(color.r, color.g, color.b);

    if (alternating !== undefined) {
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

    this.benchCount = 0;
    this.benchCountRoad = 0;
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
    for (let i = 0; i < this._pickups.length; i++) {
      const p = this._pickups[i];
      p.hasBeenUsed = false;
      p.visible = false;

    }
  }

  getFirstAvalibleRoadItem(): TrackDisplaySegment {
    //returns the first road display item not in use.
    for (let i = 0; i < this.trackDisplaySegments.length; i++) {
      const seg = this.trackDisplaySegments[i];

      if (!seg.hasBeenUsed) {
        this.benchCountRoad++;
        seg.hasBeenUsed = true;
        return seg;
      }

    }

    console.log("out of road visuals");
  }


  private benchCount = 0;
  private benchCountRoad = 0;

  getFirstAvalibleSceneryItem(): Scenery {
    //returns the first road display item not in use.
    for (let i = 0; i < this._scenery.length; i++) {
      const s = this._scenery[i];

      if (!s.hasBeenUsed) {
        this.benchCount++;
        s.hasBeenUsed = true;
        return s;
      }


    }
    // console.log("out of road scenery visual elements");
  }

  getFirstAvaliblePickupItem(): PickUp {
    //returns the first pickup item not in use..
    for (let i = 0; i < this._pickups.length; i++) {
      const s = this._pickups[i];

      if (!s.hasBeenUsed) {
        s.hasBeenUsed = true;
        return s;
      }


    }
  }

  shutdown() {
    // drop references to anything we have in create
    this.tools = null;

    super.shutdown();
  }
}
