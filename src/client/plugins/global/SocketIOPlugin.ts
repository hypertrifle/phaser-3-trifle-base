import { Scene } from "phaser";
import * as SocketIOCLient from 'socket.io-client';
import DataUtils from "../utils/DataUtils";
import { IRequestObject, RequestDestination, RequestState } from "../../../server/models/NetowrkRequest";

export interface INetworkConnectionSettings {
  host: string;

}

// global properties for any connection model
export interface IGameStateDefaults {
  uniqueID: string;
}

// model of primatives, no instatiated models.
export interface TestModel extends IGameStateDefaults {
  players: number[];
  options: {
    death: 2
  };
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

  // man we should be also able to handle multiple socket connections, but that can be added alter.
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



    StyleSheetList;
  }




  connect(conf: INetworkConnectionSettings) {
    console.log("AttemptinToConnectWithDetail::", conf);
    this._socket = SocketIOCLient();

    this.connect({
      host: "localhost",
      // port: 5040
    });

    this._socket.on("respose",this.socketIn); // do I rallly need to bind?

  // finally connect
  this._socket.connect();

  }

  requestAndSyncState() {
    this.request({
      key: DataUtils.quickHash(),
      action: "state-request",
      destination: RequestDestination.SELF,
      onComplete: this.persisteGameState,
      onFailed: this.errorWithRequest.call(this, 0, "Failed to Sync"),
      
    });
  }

  persisteGameState(requestObject: IRequestObject) {

    // almost definatly need error checking here.

    this.state = Object.apply(this.state, requestObject.respose.state);

  }

  errorWithRequest(level: number, reason: string|any) {
    console.warn("E:", reason);
  }

  request(requestObject: IRequestObject) {

    if (!this.socketAvalible) {
      // mark as failed.
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
    console.log("SocketUpdate");
    this.ResolveReqestQueue();
    }

  private ResolveReqestQueue() {
    if (this._requestQueue.length > 0) {

      // for each queue item
      for (let i = 0; i < this._requestQueue.length; i++) {

        let serverAction: IRequestObject = this._requestQueue[i];

        // depending on the state
        switch (serverAction.state) {

          // we should emit
          case RequestState.PENDING:
            this.socketOut(serverAction);
            break;

          // if previously sent, we should check to see if we have a respose.
          case RequestState.SENT:

            // for each response
            for (let r = 0; this._resposeQueue.length; r++)
                this.matchAndResoveNetworkAction(this._requestQueue[i], this._resposeQueue[r]);

          break;
          default:
          console.warn("UNKNOWN network connection state, ommiting", serverAction);
          break;
        }
      }
    }
  }

  private matchAndResoveNetworkAction(req: IRequestObject, res: IRequestObject): boolean {

    if (req.key !== res.key) {
      // these are not the same;
      return false;
    }

    // this really should be the same request object, we just nee to confirm update status and apply any callbacks.

    // if they match lets remove from repsonse queue to redoce duplucation.
  }


  private socketOut(action: IRequestObject) {
    this._socket.send("request", action);
    action.state = RequestState.SENT;
  }



  private socketIn(action: IRequestObject) {
    this._resposeQueue.push(action);
  }


}




