import { Socket, Room } from "socket.io";

  export enum RequestState {
    NONE = undefined,
    PENDING = 0,
    SENT,
    COMPLETE,
    FAILED,
    CANCELLED
  }

  export interface IRequestObject {
    key: string;
    socket: Socket;
    room?: Room;
    namespace?: string;
    action: string;
    packact?: any; // should be typed depending on action
    respose?: any; // again should be typed depending on action
    destination: RequestDestination;
    onComplete?: (request?: IRequestObject) => void;
    onFailed?: (request?: IRequestObject) => void;
    state?: RequestState;
    // todo:Mutantions?
  }

export enum RequestDestination {
    NONE = undefined,
    SELF= 0,
    ROOM,
    OTHERS_IN_ROOM,
    NAMESPACE,
    GLOBAL
 }

export interface IMessage {
    originalSocket: Socket;
    destination: RequestDestination;
 }