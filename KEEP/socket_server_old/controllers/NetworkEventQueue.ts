import { Socket } from "socket.io";
import { IRequestObject } from "../models/NetowrkRequest";


export interface IMessage {
   originalSocket: Socket;
   destination: RequestDestination;
}

export default class NetworkEventQueue {

   private _server: SocketIO.Server;

   private _messageQueue: IRequestObject[];
   private _messageHistory: IRequestObject[];
   private _failedMessageHistory: IRequestObject[];

   constructor(socketServer: SocketIO.Server) {
      this._server = socketServer;
      this.reset();
   }

   reset() {
      this._messageQueue = [];
      this._messageHistory = [];
      this._failedMessageHistory = [];
   }

   // push new netowrk request to our queue,
   addToQueue(req: IRequestObject) {

      this._messageQueue.push(req);

   }

   parseQueue() {
      if (!this._messageQueue) {
         return 0;
      }

      while (this._messageQueue.length > 0) {
         let action: IRequestObject = this._messageQueue.shift();


         // here we must validate and apply the newwork action
         if (!this.resolveAction(action)) {
            console.warn("Action Unresolved", action.action, action.key, action.packact);
            this._failedMessageHistory.push(action);
            continue;
         }


         // middleware can be applied here.

         // tell the clients that want to know

         // and notifiy the sender of the success / faluire and why


      }


   }


   resolveAction(action: IRequestObject): boolean {
      return true;
   }

   broadcastAction(action: IRequestObject) {

   }

   finaliseAction(action: IRequestObject) {
      this._messageHistory.push(action);
   }



}