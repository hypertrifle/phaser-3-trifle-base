import { Scene } from "phaser";

export enum ClientDestination {
  NONE= undefined,
  ME = 0,
  ROOM,
  OTHERS_IN_ROOM,
  ALL

}

export enum RequestState {
  NONE = undefined,
  REQUESTED = 0,
  SENT,
  COMPLETE,
  FAILED,
  CANCELLED
}

export interface IRequestObject {
  action:"string",
  packact:any;
  destination:ClientDestination,
  onComplete:(request?:IRequestObject)=>void;
  onFailed:(request?:IRequestObject)=>void;
  state?:RequestState;
}


export default class SocketIOPlugin extends Phaser.Plugins.BasePlugin {
   
  constructor(pluginManager: Phaser.Plugins.PluginManager) {
    super(pluginManager);
    this.game = pluginManager.game;


    console.log("SocketIOPlugin::constructor");
  }

  makeRequest(requestObject:IRequestObject){

  }


  update(){
    console.log("SocketUpdate")
  }








}
