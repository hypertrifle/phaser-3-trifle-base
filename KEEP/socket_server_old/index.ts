import { ServerAuthenticationController } from "./controllers/ServerAuthenticationController";
import { RoomController, Room } from "./controllers/RoomController";
import { IRequestObject } from "./models/NetowrkRequest";
import NetworkEventQueue from "./controllers/NetworkEventQueue";
import IServerSettings from "./models/ServerSettings";

import * as socketio from 'socket.io';


export default class GameServer {

   auth: ServerAuthenticationController;
   roomControl: RoomController;
   eventQueue: NetworkEventQueue;
   server: socketio.Server;
   updateTimer: NodeJS.Timeout;
   settings: IServerSettings;


   constructor() {

      this.server.on("connection", (socket: SocketIO.Socket) => {

      });

      this.server.on('disconnect', (socket: SocketIO.Socket) => {

      });

      // this is all we are gonna need i think, the only message sent to server should be a "request", the request details will contain information
      // about designation data to emit and other settings requied.

      this.server.on('request', (socket: SocketIO.Socket, request: IRequestObject) => {

         // first assign our socket if not alread
         request.socket = socket;

         // so we can infur a few more bits of data from this request, such as current room / namesapce.
         let exisistInRoom = this.roomControl.getRoomForClient(socket);

         if (exisistInRoom !== undefined) {
            request.room = exisistInRoom as Room;
         }

         // finally pop to queue for server expanadability.
         this. eventQueue.addToQueue(request);

      });


      // finally restart our server
      this.restartServer();
   }

   restartServer(reason: string = "restart-request") {

      // clear our current running update loop.
      if (this.updateTimer) {
         clearInterval(this.updateTimer);
      }

      // TODO: reload any server settings.
      this.settings = {
         fps: 30,
         port: 5000
      };


      // notify all clients (ask them to attempt to reload in a certain amount of time.)
      this.server.clients().emit("force-close", {reason: reason});
      // close connection

      this.server.close();

      // reset room status / clear clients
      this.roomControl.reset();
      this.auth.reset();



      // reboot our server
      this.server = socketio.listen(this.settings.port);

      // set up a polling speed / and call

      this.updateTimer = setInterval(this.updateServer, 1000 / this.settings.fps);
   }

   updateServer() {
      this.eventQueue.parseQueue();
   }


}

// entry
new GameServer();
