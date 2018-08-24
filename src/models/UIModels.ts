export interface Corners {
   sw?:boolean,
   se?:boolean,
   nw?:boolean,
   ne?:boolean
}


export class UISettings {
   static radius:number = 10;
   static corners:Corners = {sw:true};
}