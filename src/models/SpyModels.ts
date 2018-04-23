export interface Member {
   name:string;
   speed:number;
   movement_speed:number;
   cost:int;
   abilities:string[];
   bio:string;
}

export interface Mission {
   name:string;
   map:TilemapConfig;
   type:string;
   budget:int;
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