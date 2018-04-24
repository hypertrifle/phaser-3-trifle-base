export interface Member {
   name:string;
   speed:number;
   movement_speed:number;
   cost:number;
   abilities:string[];
   bio:string;
}

export interface Mission {
   name:string;
   map:TilemapConfig;
   type:string;
   budget:number;
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
   owner:number;
   startTime:number;
   hasError:number;
   action:Action;
   target:Tile;
   targetSide:Side;

   startUpTime:number; //walking to target location
   coolDownTime:number;
}


export interface SpyTimeline {
   members:Member[];
   entries:SpyTimedAction[];
   draft:SpyTimedAction;

}