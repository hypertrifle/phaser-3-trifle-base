import BaseScene from "./BaseScene";
import Player from "../components/ping/Player";

// @ts-ignore;
// const SPINE = require("../plugins//SpineWebGLPlugin.js");

export interface IGameplaySettings {
  maxHitCharge: number;
  hitActiveFrames: number;
}

export default class PingScene extends BaseScene {

  constructor() {
    super({
      key: "PingScene",
      active: false,
    });
    console.log("PingScene::constructor");
  }

  // our players, this might want to be a map
  _pingers: Player[] = [undefined,undefined,undefined,undefined];

  // our ball - to be made into new class
  _ball: Phaser.GameObjects.Rectangle;

  // global settings relating to gameplay / physics etc
  _gamePlaySetting: IGameplaySettings = {
    maxHitCharge : 50,
    hitActiveFrames : 20
  };

  // pack: {
  //   files: [
  //       // { type: 'scenePlugin', key: 'SpineWebGLPlugin', url: 'plugins/SpineWebGLPlugin.js', sceneKey: 'spine' }
  //   ]
// }

  preload() {
    console.log("PingScene::preload");

    this.load.image("table", "assets/img/table.png");


    this.load.setPath('assets/spine/');
    //@ts-ignore
    this.load.spine('gary', 'gary.json', 'gary.atlas');  }

  create() {
    super.create();

  

    this.add.image(this.cameras.main.width/2 , this.cameras.main.height - 123,"table");
    // console.log("PingScene::create");
    // this.cameras.main.zoom = 0.5;
    // this.physics.world.setBounds(-1280/2,-720/2,1280*2,720*2);


    // this.createTempBall();
    

    // this.physics.world.on('worldstep', this.updatePhysics); // this didn't actuallywork,.
  }


  private createTempBall() {
    this._ball = this.add.rectangle(640, 360, 20, 20, 0xffffff, 1);
    this.physics.world.enableBody(this._ball, Phaser.Physics.Arcade.DYNAMIC_BODY);
    let _body: Phaser.Physics.Arcade.Body = this._ball.body as Phaser.Physics.Arcade.Body;
    _body.setCollideWorldBounds(true);
    _body.allowGravity = false;
    _body.setVelocity(1500, 1000);
    _body.setBounce(1, 1);
  }

  update(time: number, delta: number) {
    super.update(time, delta);
    // update pysics type items.
    this.updatePhysics();

    // set up new players if controller exists and player doesn't already exist.
    for (let i = 0; i < this.input.gamepad.gamepads.length; i++) {
      if (this._pingers[i] === undefined)
        this.addPlayerAtNumber(i);
    }


    // for each player
    for (let i = 0; i < this._pingers.length; i++) {

      const _p: Player = this._pingers[i];
      if (_p === undefined) {
        continue;
      }

    // update the visual for this player.
    _p.updatePlayerVisuals(this._gamePlaySetting);
    }
  }

  updatePhysics() {
     // update each player
     for (let i = 0; i < this._pingers.length; i++) {

      const _p: Player = this._pingers[i];

      if (_p === undefined) {
        continue;
      }


      _p.updateHitLogic(this._gamePlaySetting);
      _p.updateMovement(this._gamePlaySetting);



    }
  }




  addPlayerAtNumber(i: number) {

    console.log("Adding Player", i);

      let team = i % 2;

      let w = (this.game.config.width as number) / 2;

      let startPosition = [w - 200,w + 200,w - 400,w + 400][i];

      this._pingers[i] = new Player(this,{
        controls: this.input.gamepad.gamepads[i],
        intialX: startPosition,
        intialY: 300,
        team: team, // depending on side.
        skin: "test"
      });
  }

  shutdown() {
    super.shutdown();
  }
}
