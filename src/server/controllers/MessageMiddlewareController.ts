import { Socket } from "socket.io";

export enum DestinationType {
   NONE = undefined,
   SELF= 0,
   ROOM,
   NAMESPACE,
   GLOBAL
}

export interface IMessage {
   originalSocket:Socket;
   destination:DestinationType;
}

export class MessagerMiddlewareController {

   private _server:SocketIO.Server;

   private _messageQueue:IMessage[];

   constructor(socketServer:SocketIO.Server){
      this._server = socketServer;
   }

   
   reset(){

   }

}