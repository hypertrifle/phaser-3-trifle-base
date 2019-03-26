import { Scene } from "phaser";
import * as SocketIOCLient from 'socket.io-client';
import DataUtils from "../utils/DataUtils";

export interface INetworkConnectionSettings {
  host: string,

}

export enum ClientDestination {
  NONE = undefined,
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
  key:string,
  action: string,
  packact?: any; //should be typed depending on action
  respose?: any; //again should be typed depending on action
  destination: ClientDestination,
  onComplete?: (request?: IRequestObject) => void;
  onFailed?: (request?: IRequestObject) => void;
  state?: RequestState;
  //todo:Mutantions?
}

//global properties for any connection model
export interface IGameStateDefaults {
  uniqueID: string,
}

//model of primatives, no instatiated models.
export interface TestModel extends IGameStateDefaults {
  players: number[];
  options: {
    death: 2
  }
}

// an instance of our model, add functionallity that can be infured from the model,
// allows mutations, and handle when new updates may be required.
export class TestState {
  data: TestModel;

  constructor(dataModel: TestModel) {
    this.data = dataModel;
  }

  get example(): number {
    return this.data.players.length;
  }


}


export default class SocketIOPlugin extends Phaser.Plugins.BasePlugin {

  private _requestQueue: IRequestObject[];
  private _resposeQueue: IRequestObject[];

  //man we should be also able to handle multiple socket connections, but that can be added alter.
  private _socket: SocketIOClient.Socket;

  public state: TestState = new TestState({
    uniqueID: "DemoGame",
    players: [],
    options: {
      death: 2
    }
  }); // todo: doesn't belong in this class, controller needs to be agnostic to the plugin.


  constructor(pluginManager: Phaser.Plugins.PluginManager) {
    super(pluginManager);
    this.game = pluginManager.game;
    console.log("SocketIOPlugin::constructor");

   

    StyleSheetList
  }




  connect(conf: INetworkConnectionSettings) {
    console.log("AttemptinToConnectWithDetail::", conf);
    this._socket = SocketIOCLient();

    this.connect({
      host: "localhost",
      // port: 5040
    })

    this._socket.on("respose",this.socketIn); // do I rallly need to bind?
      
  //finally connect    
  this._socket.connect()

  }

  requestAndSyncState() {
    this.request({
      key:DataUtils.quickHash(),
      action: "state-request",
      destination: ClientDestination.ME,
      onComplete: this.persisteGameState,
      onFailed: this.errorWithRequest.call(this, 0, "Failed to Sync")
    })
  }

  persisteGameState(requestObject: IRequestObject) {

    //almost definatly need error checking here.

    this.state = Object.apply(this.state, requestObject.respose.state);

  }

  errorWithRequest(level:number, reason: string|any){
    console.warn("E:", reason);
  }

  request(requestObject: IRequestObject) {

    if (!this.socketAvalible) {
      //mark as failed.
      requestObject.state = RequestState.CANCELLED;
      this._requestQueue.push(requestObject);
    }

  }



  get socketAvalible(): boolean {
    if (this._socket !== undefined) {
      return false;
    }


    return true;
  }




  update() {
    console.log("SocketUpdate")

    if (this._requestQueue.length > 0) {
      for (var i = 0; i < this._requestQueue.length; i++) {

        let serverAction: IRequestObject = this._requestQueue[i];

        switch (serverAction.state) {

          case RequestState.PENDING:
            this.socketOut(serverAction);

            break;
          case RequestState.SENT:
          //check fro requests
          for(var r =0; this._resposeQueue.length; r++)
          //check local reviece logs have returned sucesses. {
            if(this._resposeQueue[r]
              // compare objects? they are pointers raeally? or use a hash. 
            )
          }

        }

      }
    }
  

  private socketOut(action: IRequestObject) {
    this._socket.send("request", action);
    action.state = RequestState.SENT;
  }



  private socketIn(action: IRequestObject){
    this._resposeQueue.push(action)
  }


}




