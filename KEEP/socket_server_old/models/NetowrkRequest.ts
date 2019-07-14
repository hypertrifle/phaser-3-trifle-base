import { Socket } from "socket.io";
import { Room } from "../controllers/RoomController";

  export enum RequestState {
    NONE = undefined,
    PENDING = 0,
    SENT,
    COMPLETE,
    FAILED,
    CANCELLED
  }

export enum RequestDestination {
  NONE = undefined,
  SELF= 0,
  ROOM,
  OTHERS_IN_ROOM,
  NAMESPACE,
  GLOBAL
}

  export interface IRequestObject {
    key: string;
    socket?: Socket; // only really used for serverside operations, and should probably be stripped when sending / receiving messages
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