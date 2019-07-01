import BaseScene from "./BaseScene";
import Player from "../components/ping/Player";

export interface IGameplaySettings {
  maxHitCharge:number;
  hitActiveFrames:number;
}

export default class PingScene extends BaseScene {

  constructor() {
    super({
      key: "PingScene",
      active: false
    });
    console.log("PingScene::constructor");
  }

  _pingers:Player[] = [undefined,undefined,undefined,undefined];
  _ball:Phaser.GameObjects.Rectangle;


  _gamePlaySetting:IGameplaySettings = {
    maxHitCharge : 50,
    hitActiveFrames : 20
  };

  preload() {
    console.log("PingScene::preload");

  }

  create() {
    super.create();
    console.log("PingScene::create");
    this.cameras.main.zoom = 0.5;
    this.physics.world.setBounds(-1280/2,-720/2,1280*2,720*2);


    this._ball = this.add.rectangle(640, 360, 20,20,0xffffff,1);
    this.physics.world.enableBody(this._ball, Phaser.Physics.Arcade.DYNAMIC_BODY);
    let _body:Phaser.Physics.Arcade.Body = this._ball.body as Phaser.Physics.Arcade.Body
    _body.setCollideWorldBounds(true);
    _body.allowGravity = false;
    _body.setVelocity(1500,1000);
    _body.setBounce(1,1);

    // this.physics.world.on('worldstep', this.updatePhysics);
  }
  

  update(time: number, delta: number) {
    super.update(time, delta);
    this.updatePhysics();

    //set up new players if controller exists and player doesn't already exist.
    for (let i = 0; i < this.input.gamepad.gamepads.length; i++){
      if(this._pingers[i] === undefined)
        this.addPlayerAtNumber(i);
    }



    for(let i = 0; i < this._pingers.length; i++){

      const _p:Player = this._pingers[i];

      if(_p === undefined){
        continue;
      }

    _p.updatePlayerVisuals(this._gamePlaySetting);

    }
  }

  updatePhysics(){
     //update each player
     for(let i = 0; i < this._pingers.length; i++){

      const _p:Player = this._pingers[i];

      if(_p === undefined){
        continue;
      }


      _p.updateHitLogic(this._gamePlaySetting);
      _p.updateMovement(this._gamePlaySetting)


      
    }
  }




  addPlayerAtNumber(i:number) {

    console.log("Adding Player", i);

      let team = i%2;

      let w = (this.game.config.width as number)/2;

      let startPosition = [w-200,w+200,w-400,w+400][i];

      this._pingers[i] = new Player(this,{
        controls: this.input.gamepad.gamepads[i],
        intialX:startPosition,
        intialY:300,
        team:team, //depending on side.
        skin:"test"
      });
  }

  shutdown() {
    super.shutdown();
  }
}
