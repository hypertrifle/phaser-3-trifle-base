export interface Member {
   name:string;
   rank:number;
   speed:number;
   _id:int;
}

export interface Tile {
   id:number
   position:Phaser.Geom.Point;
}

export enum Action {
   IDLE = 0,
   MOVE,
   ATTACK,
   HACK,
   STEAL,
   EXIT,
}

export enum Side {
   UP = 0,
   DOWN,
   LEFT,
   RIGHT,
}

export interface SpyTimedAction {
   owner:int;
   startTime:int;
   hasError:int;
   action:Action;
   target:Tile;
   targetSide:Side;

   startUpTime:int; //walking to target location
   coolDownTime:int;
}


export interface SpyTimeline {
   members:Member[];
   entries:SpyTimedAction[];
   draft:SpyTimedAction;

}