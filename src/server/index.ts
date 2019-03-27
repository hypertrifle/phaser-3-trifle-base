import { ServerAuthenticationController } from "./controllers/ServerAuthenticationController";
import { RoomController } from "./controllers/RoomController";
import { IRequestObject } from "./models/NetowrkRequest";
import NetworkEventQueue from "./controllers/NetworkEventQueue";

const io: SocketIO.Server = require("socket.io");


// lets initilise out controlers into global scope.

// auth used for aithentivation.
const auth: ServerAuthenticationController = new ServerAuthenticationController(io);

// room control used to handle room delegation and relaying of messages
const roomControl: RoomController = new RoomController(io);

// queue used to help scaling / batching and keeping track of game events.
const eventQueue: NetworkEventQueue = new NetworkEventQueue(io);

// entry point. //can i type this?
let server: SocketIO.Server;


restartServer();

export interface ServerResponse {
   success: boolean;
}

export interface ServerRequest {

}

// I think these are the only "standard" socket events / enforced used by standard, but for most other messages we will probably create a more agnostic messaging protocol.
server.on("connection", (socket: SocketIO.Socket) => {

});

server.on('disconnect', (socket: SocketIO.Socket) => {

});

// this is all your goona need
server.on('request', (socket: SocketIO.Socket, request: IRequestObject) => {

   // first assign our socket if not alread
   request.socket = socket;

   // pop to quuee for server expanadability.

   // so we can infur a few more bits of data from this request, such as current room / namesapce.
   let exisistInRoom = roomControl.getRoomForClient(socket);

   if (exisistInRoom !== undefined) {
      request.room = exisistInRoom;
   }


});

// update respove and disptach required signalls


function restartServer(reason: string = "resart-request") {


   // notify all clients (ask them to attempt to reload in a certain amount of time.)
   server.clients().emit("force-close", {reason: reason});
   // close connection

   server.close();

   // reset room status / clear clients
   roomControl.reset();
   auth.reset();

   // reload settings if required.

   // reboot our server
   server = io.listen(5040);

}

function message(message: IRequestObject) {

}

// message helpers
function rejectMessage() {

}

function acceptMessage() {

}