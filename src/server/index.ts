import { ServerAuthenticationController } from "./controllers/ServerAuthenticationController";
import { RoomController } from "./controllers/RoomController";
import { MessagerMiddlewareController as MessageMiddlewareController } from "./controllers/MessageMiddlewareController";
import { IncomingMessage } from "http";

const io:SocketIO.Server = require("socket.io");


//lets initilise out controlers into global scope.

//auth used for aithentivation.
const auth:ServerAuthenticationController = new ServerAuthenticationController(io);

//room control used to handle room delegation and relaying of messages
const roomControl:RoomController = new RoomController(io);

/* message middleware being somthing we discussed, 
but contains logical functions that could be required on a server
randomising teams / questions can be done here, as client side with go out of sync, with that or we set a seed on a game session */

const messageMiddwareController:MessageMiddlewareController = new MessageMiddlewareController(io);

//entry point. //can i type this?
let server:SocketIO.Server; 


restartServer();

export interface ServerResponse {
   success:boolean
}

export interface ServerRequest {

}

//I think these are the only "standard" socket events / enforced used by standard, but for most other messages we will probably create a more agnostic messaging protocol.
server.on("connection", (socket:SocketIO.Socket) => {

});

server.on('disconnect', (socket:SocketIO.Socket) => {

});

//this is all your goona need
server.on('response', (socket:SocketIO.Socket, request:RequestInfo) => 
{
   //pop to quuee for server expanadability.
});

//update respove and disptach required signalls







function restartServer(reason:string = "resart-request") {

   
   //notify all clients (ask them to attempt to reload in a certain amount of time.)
   server.clients().emit("force-close", {reason:reason});
   //close connection

   server.close();

   //reset room status / clear clients
   roomControl.reset();
   auth.reset();

   //reload settings if required.
   
   //reboot our server 
   server = io.listen(5040); 

}

message(message:IRequestObject)
message(message:IRequestObjec)

//message helpers
function rejectMessage(){

}

function acceptMessage(){

}