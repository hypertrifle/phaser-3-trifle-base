import { Scene } from "phaser";
import * as io from 'socket.io-client';

export interface INetworkConnectionSettings {
  host: string,

}

export enum ClientDestination {
  NONE= undefined,
  ME = 0,
  ROOM,
  OTHERS_IN_ROOM,
  ALL
}

export enum RequestState {
  NONE = undefined,
  PENDING = 0,
  SENT,
  COMPLETE,
  FAILED,
  CANCELLED
}

export interface IRequestObject {
  action:string,
  packact?:any; //should be typed depending on action
  respose?:any; //again should be typed depending on action
  destination:ClientDestination,
  onComplete?:(request?:IRequestObject)=>void;
  onFailed?:(request?:IRequestObject)=>void;
  state?:RequestState;
  //todo:Mutantions?
}

export interface IGameState {
  uniqueID:string,
  data:any; //cast per game, but this is maybe the easiest way to do it.
}

export class TestState implements IGameState {
  uniqueID: "DemoGameState"
  data: {
    players:[],
    options: {
      death:number;
    }
  }
}


export default class SocketIOPlugin extends Phaser.Plugins.BasePlugin {


  private _requestQueue:IRequestObject[];
  private _socket:SocketIOClient;
  public state:TestState = new TestState(); // todo: doesn't belong in this class, controller needs to be agnostic to the plugin.

   
  constructor(pluginManager: Phaser.Plugins.PluginManager) {
    super(pluginManager);
    this.game = pluginManager.game;
    console.log("SocketIOPlugin::constructor");
  }

  connect(conf:INetworkConnectionSettings){
    console.log("AttemptinToConnectWithDetail::", conf)
  }

  requestAndSyncState(){
    this.makeRequest({
      action:"state-request",
      destination: ClientDestination.ME,
    onCOmplete: () = > {
      this.state.data = 
    }
    })
  }

  makeRequest(requestObject:IRequestObject){

  }


  update(){
    console.log("SocketUpdate")
  }








}
