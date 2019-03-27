import { Socket } from "socket.io";

export enum RoomState {
   NONE= undefined,
   ACCEPTING_PLAYERS = 0,
   IS_FULL,
   IN_GAMEPLAY,
   PAUSED,
   ENDED
}
export interface Room {
   id?: string;
   clients?: GameClient[];
   roomState?: RoomState;
}

export interface GameClient {
   socket: SocketIO.Socket;
   assignedToRoom?: string;
   globalClient?: boolean;
   clientSecret: string;
}

export class RoomController {

   private _rooms: { [index: string]: Room };
   private _clients: GameClient[];
   private _server: SocketIO.Server;

   constructor(socketServer: SocketIO.Server) {

      this._server = socketServer;
      this.reset();
   }

   reset() {
      this._rooms = {};
      this._clients = [];
   }


   getRoomForClient(socket: Socket): Room | undefined {
      for (let r in this._rooms) {
         let room = this._rooms[r];
         for (let c in this._rooms[r].clients) {
            (room.clients[c].socket === socket);
               return room;
         }
      }

      return undefined;
   }


   clientJoinRoom() {

   }

   registerCLient() {

   }

   unregisterClient() {

   }

   messageForAllRooms() {

   }

   messageForMyRoom() {

   }

   get roomCurrentList(): string[] {
      return Object.keys(this._rooms);
   }

   newRoom(name: string): Room|boolean {

      if (Object.keys(this._rooms).indexOf(name) > -1) {
         console.warn("Room with that name exists.");
         return false;
      }

      let r =  this._rooms[name] = {
      };

      return r;
   }

}