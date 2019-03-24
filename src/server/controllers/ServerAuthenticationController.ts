export class ServerAuthenticationController {

   private _server:SocketIO.Server;

   constructor(socketServer:SocketIO.Server){
      this._server = socketServer;
   }

   authenticate(){
      return true;
   }

   reset(){

   }

}