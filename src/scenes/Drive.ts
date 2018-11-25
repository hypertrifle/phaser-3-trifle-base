import BaseScene from "./BaseScene";
import Tools from "../plugins/global/Tools";
import { Scene, Cameras } from "phaser";
import { platform } from "os";
import { config } from "shelljs";
import Scenery from "../components/race/Scenery";
import TrackSystem from "../components/race/TrackSystem";
import { ControlSystem } from "../components/race/Controls";
import Car from "../components/race/Car";

const SKYLINE: number = 100;

export default class DriveScene extends BaseScene {

  private _track:TrackSystem;
  private _controls:ControlSystem;

  
  private _skyBox: Phaser.GameObjects.Image;
  private _scenery: Scenery[];
  private _car: Car;


  private _roadSprites: Phaser.GameObjects.Image[];
  private _bgSprites: Phaser.GameObjects.Image[];

  private _currentLapTime: number = 0;
  private _currentDistance: number = 0;


  // private _scenery:


  constructor() {
    super({
      key: "DriveScene",
      active: false
    });
    console.log("DriveScene::constructor");

    this._track = new TrackSystem();
    this._controls = new ControlSystem();

    this._roadSprites = [];
    this._bgSprites = [];
    this._scenery = [];

  }

  preload() {
    console.log("DriveScene::preload");
    this.load.image("skyblok", "assets/img/tmp_skybox_large.png");
    this.load.image("car", "assets/img/car_front.png");

    this.load.image("roadAlt", "assets/img/blank_road.png");
    this.load.image("road", "assets/img/road_alt.png");
    this.load.image("bg_strip", "assets/img/bgstrip1.png");
    this.load.image("bg_stripAlt", "assets/img/bgstrip2.png");


    this.load.image("palm", "assets/img/palm_shadow_left.png");
    this.load.image("billboard", "assets/img/sign_shadow_right.png");

  }

  create() {

    console.log("DriveScene::create");
    this.cameras.main.backgroundColor = Phaser.Display.Color.HexStringToColor("#00C0FF");
    super.create();
    this.resetGraphicItems();

    //test
    this.renderStraightRoad();

    //car
    this._car = new Car(this, {
      positionFromBottom:60
    });

    // generate the side scenerey.

    for (let i = 0; i < 300; i ++) {
      let s = new Scenery(this, {
        isLeft: i % 2 === 0,
        frame : (i % 50 === 0) ? "billboard" : "palm",
        offset : new Phaser.Geom.Point((Math.random() * 200),0),
        totalBands: 360 - SKYLINE + 1,
        owner:this
      });

      s.y = (360 / 20) * i;
      s.alpha = 1;
      this._scenery.push(s);
    }
  }

  renderStraightRoad() {


    let offset: number = 0;
    let alt: boolean = true;

    for (let i: number = 0; i < 360 - SKYLINE + 1 ; i++) {

      console.log("addRlad");


      if (i % 20 === 0) {
        alt = !alt;
      }

      let roadScale: number = 1 / (i / 100);

      let bg_strip = this.add.image(320,360 - offset,(alt) ? "bg_strip" : "bg_stripAlt");
      let road = this.add.image(320,360 - offset, (alt) ? "road" : "roadAlt");
      offset += road.height;

      if (alt) {
        road.tint = 0xeeeeee;
      }

      // road.setScale(roadScale);
      road.scaleX = roadScale;
      this._roadSprites.push(road);
      this._bgSprites.push(bg_strip);
    }
  }



  resetGraphicItems() {
    this._skyBox = this.add.sprite(320,SKYLINE,"skyblok");
    this._skyBox.setOrigin(0.5,1);

  }

  update(time: number, delta: number) {

    super.update(time, delta);

    let speed = 8;

      for (let i: number = 0; i < this._bgSprites.length;i ++) {
          let s = this._roadSprites[i];
          let b = this._bgSprites[i];
          s.y += speed;
          b.y += speed;
          if (s.y > 360) {
            s.y -= this._roadSprites.length;
            b.y -= this._roadSprites.length;
          }


         let j = s.y - 360;

      // let roadScale:number = 0.01 * (this._bgSprites.length/(j*0.05));
      let roadScale: number = 1 - ( (j / (this._bgSprites.length * 1.05 )) * -1 );

          s.scaleX = roadScale;
          s.x = 320 + Math.sin((time + (j * delta * 1)) / 10000) * 25;



          this._skyBox.x = 320 + Math.sin(time * 0.0002) * 25;
      }


      for (let i: number = 0; i < this._scenery.length;i ++) {
        let s
        = this._scenery[i];

        s.y += speed / 2;

        if (s.y > 360) {
          s.y -= this._roadSprites.length;
        }

        s.updatePosition(time,delta);


      }



  }

  shutdown() {
    // drop references to anything we have in create
    this.tools = null;

    super.shutdown();
  }
}
