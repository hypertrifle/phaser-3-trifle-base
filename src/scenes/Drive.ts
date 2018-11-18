import BaseScene from "./BaseScene";
import Tools from "../plugins/global/Tools";
import { Scene } from "phaser";


interface SceneryConfig extends GameObjectConfig {
  frame:string;
  offset:Phaser.Geom.Point;
  isLeft?:boolean;
  }

export class Scenery extends Phaser.GameObjects.Image {

  offset:Phaser.Geom.Point;

  constructor(scene:Scene,config:SceneryConfig){
    super(scene,0,0,config.frame);
    //now what

    this.offset = config.offset;


  }
}

const SKYLINE:number = 100;

export default class DriveScene extends BaseScene {

  private _car:Phaser.GameObjects.Sprite;
  private _skyBox:Phaser.GameObjects.Image;
  private _terrain:Phaser.GameObjects.Graphics;
  private _currentLapTime:number = 0;
  private _currentDistance:number = 0;

  private _scenery:Phaser.GameObjects.Image[];
  private roadSprites:Phaser.GameObjects.Image[];
  private _bgSprites:Phaser.GameObjects.Image[];

  // private _scenery:


  constructor() {
    super({
      key: "DriveScene",
      active: false
    });
    console.log("DriveScene::constructor");
  }

  preload() {
    console.log("DriveScene::preload");
    this.load.image("skyblok", "assets/img/tmp_skybox_large.png");
    this.load.image("car", "assets/img/car_front.png");

    this.load.image("roadAlt", "assets/img/blank_road.png");
    this.load.image("road", "assets/img/road_alt.png");
    this.load.image("bg_strip", "assets/img/bgstrip1.png");
    this.load.image("bg_stripAlt", "assets/img/bgstrip2.png");

  }

  create() {

    this.cameras.main.backgroundColor = Phaser.Display.Color.HexStringToColor("#00C0FF");
    console.log("DriveScene::create");

    super.create();

    // this


    this.roadSprites = [];
    this._bgSprites = [];
    this._scenery = [];
    this.resetGraphics();

    this.renderStraightRoad();
    this._car = this.add.sprite(320,270,"car").setScale(2);

    //generate the side scenerey.

    let frames:string[] = ["palm_shadow_left.png","palm_shadow_left.png","palm_shadow_left.png","palm_shadow_left.png"]


  }

  renderStraightRoad(){

    
    let offset:number = 0;
    let alt:boolean = true;

    for(var i:number = 0; i < 360-SKYLINE+1 ; i++){
      
      console.log("addRlad");
      
    
      if(i%20 === 0){
        alt = !alt;
      }
      
      let roadScale:number = 1/(i/100);
   
      let bg_strip = this.add.image(320,360-offset,(alt)?"bg_strip":"bg_stripAlt");
      let road = this.add.image(320,360-offset, (alt)?"road":"roadAlt");
      offset += road.height;
         
      if(alt){
        road.tint = 0xeeeeee;
      }
      
      // road.setScale(roadScale);
      road.scaleX = roadScale;
      this.roadSprites.push(road);
      this._bgSprites.push(bg_strip);


    }
  }

  

  resetGraphics(){
    this._skyBox = this.add.sprite(320,SKYLINE,"skyblok");
    this._skyBox.setOrigin(0.5,1);

  }

  update(time: number, delta: number) {
    super.update(time, delta);

    let speed = 5;

      for(var i:number =0; i < this._bgSprites.length;i ++){
          let s = this.roadSprites[i];
          let b = this._bgSprites[i];
          s.y+=speed;
          b.y+=speed;
          if(s.y >360){
            s.y -= this.roadSprites.length;
            b.y -= this.roadSprites.length;
          }


         let j = s.y - 360;

      let roadScale:number = 1/(j/100)+0.35;

          s.scaleX = roadScale;
          s.x = 320 + Math.sin((time +(j*delta*0.4)) /600)*25;

      }


  }

  shutdown() {
    // drop references to anything we have in create
    this.tools = null;

    super.shutdown();
  }
}
