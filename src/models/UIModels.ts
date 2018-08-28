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


interface ButtonSettings {
   color_up: number,
   color_hover:number,
   color_down:number,
   colour_disabled:number,
   opacity: number,
   radius:number,
}



export default class UIModel {
   settings:UISettings;
   buttons:ButtonSettings;
}

