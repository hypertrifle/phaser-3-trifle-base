import { Scene } from "phaser";
import { CanvasTools } from "../utils/UI";
import { SpyTimeline } from "../models/SpyModels";

export class SpyMap {
   scene:Scene;
   container:Phaser.GameObjects.Container;


   constructor(owner:Scene, config:any){
      this.scene = owner;
      this.container = this.scene.add.container(config.x+config.width/2, config.y+config.height/2);

      var map = this.scene.make.tilemap({ key: 'map' });

      // The first parameter is the name of the tileset in Tiled and the second parameter is the key
      // of the tileset image used when loading the file in preload.
      var tiles = map.addTilesetImage('tiles', 'tiles');
  
      // You can load a layer from the map using the layer name from Tiled, or by using the layer
      // index (0 in this case).
      var layer = map.createStaticLayer(0, tiles, 0, 0);

      layer.setScale(0.25,0.25);
      layer.setPosition(140,0);
      this.container.add(layer);


   }
   
}

export class SpyGant {
   scene:Scene;
   container:Phaser.GameObjects.Container;

   background:Phaser.GameObjects.Image;
   tl:Phaser.Geom.Point;

   model:SpyTimeline;

   draftContainer:Phaser.GameObjects.Container;

   private _config:any;



   constructor(owner:Scene, config:any){
      this.scene = owner;
      this._config = config;

      //we might want to pass in some sort of bounds object through the configuration object.
      this.container = this.scene.add.container(config.x+config.width/2, config.y+config.height/2);
    //   this.tl = new Phaser.Geom.Point(config.x/2, config.y/2);

    this.model = {
        members : [],
        entries:[],
        turns:15
    };

      this.initDisplay();
      this.redraw();

      



   }

   initDisplay(){

       //background
       let g = this.scene.make.graphics({x:0,y:0,add: false});
       CanvasTools.rectangle(g,{x:0,y:0, width:this._config.width, height:this._config.height, color:0xff0000, radius:0});
       g.generateTexture('panelKey',this._config.w, this._config.h);
       this.background = this.scene.add.image(0,0, "panelKey");
       this.container.add(this.background);

       //render the 'turn' seperation markers.
       
   }


   redraw(){
       //lets update any display objects.


       //some mesurements for our display objects.

       let row_height = this._config.height/this.model.members.length;
       let ability_display_size = Math.max(...this.model.members.map(o => o.abilities.length)); //this is an ice es6 function - https://stackoverflow.com/questions/4020796/finding-the-max-value-of-an-attribute-in-an-array-of-objects?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa

       //but if there is one we should only display one fat boy.
       
       
       ability_display_size = Math.min(ability_display_size,this._config.height);
       
       //this size of our draggable items (minus the avatars and UI items)
       let gant_size = this._config.width - row_height - ability_display_size;

       //this size of a section of the gant chart
       let turn_size = gant_size / this.model.turns; 

       let ui_base_margin = 6; //MUST BE EVEN PLZ





    // lets render each member
    for (let i in this.model.members) {

        

        //render avatar


        //render ability buttons


        // render timeline background maybe?

      

    }

    for (let i in this.model.entries){
        //render each action on the timeline.

        //render wait time line

        //reunder action block


    }

    if(this.model.draft){
        //we are drawing a draft

        //render wait timeline

        //render action block

    }
       

   }
}


export interface SpyGameControllerSettings {
    members:number[],
    level:number
}

export class SpyGameplayController {
   scene:Scene;

   constructor(owner:Scene, config:SpyGameControllerSettings){
      this.scene = owner;
      this.resgisterEvents();
   }


   resgisterEvents(){
      this.scene.events.on("spy.recalculate", this.recalculate, this);
   }

   recalculate(e:any){
      console.log(e);
   }
}