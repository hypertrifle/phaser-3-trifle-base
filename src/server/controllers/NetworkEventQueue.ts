import { Socket } from "socket.io";
import { IRequestObject } from "../models/NetowrkRequest";


export interface IMessage {
   originalSocket: Socket;
   destination: RequestDestination;
}

export default class NetworkEventQueue {

   private _server: SocketIO.Server;

   private _messageQueue: IRequestObject[];

   constructor(socketServer: SocketIO.Server) {
      this._server = socketServer;
      this.reset();
   }

   reset() {
      this._messageQueue = [];
   }

   // push new netowrk request to our queue,
   addToQueue(req: IRequestObject) {
      this._messageQueue.push(req);


   }



}