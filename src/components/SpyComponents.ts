import { Scene } from "phaser";
import { CanvasTools, Button } from "../utils/UI";
import { SpyTimeline } from "../models/SpyModels";
import { BaseComponent } from "./BaseComponent";

export class InteractableTile {
    x:number;
    y:number;
    index:number;
    button:Button;
}

export class SpyMap extends BaseComponent {

    model:SpyTimeline;
    layer:Phaser.Tilemaps.StaticTilemapLayer;
    buttons:Map<string, InteractableTile>;

   constructor(owner:Scene, config:any){
      
        super(owner,config);
       
      var map = this.scene.make.tilemap({ key: 'map' });

      // The first parameter is the name of the tileset in Tiled and the second parameter is the key
      // of the tileset image used when loading the file in preload.
      var tiles = map.addTilesetImage('tiles', 'tiles');
  
      // You can load a layer from the map using the layer name from Tiled, or by using the layer
      // index (0 in this case).
      this.layer = map.createStaticLayer(0, tiles, 0, 0);
      this.layer.setScale(0.25,0.25);
      this.layer.setPosition(140,0);
      this.container.add(this.layer);

      this.buttons = new Map<string , InteractableTile>();
      this.setupInteractables();

      this.setupEvents();

   }

   setupEvents(){
       this.scene.events.on("state:action", this.highlightButtons);
   }

   setupInteractables(){
    console.warn(this.layer.tilemap.getTileAt(5,1));

    // let button = new Button(this.scene,{x:0,y:0});
    // //we essentially want to add buttons to our components property
    // this.buttons.set(button.x+"x"+button.y,button);

   }

   enableButtons(){
        this.buttons.forEach(function(button,key){
            
        },this);
   }

   disableButtons(){

   }

   highlightButtons(){

   }
   
}

export class SpyGant extends BaseComponent {
   background:Phaser.GameObjects.Image;
   tl:Phaser.Geom.Point;
   model:SpyTimeline;
   draftContainer:Phaser.GameObjects.Container;

   memberDisplayItems:Map<string, any>;



   constructor(owner:Scene, config:any){

        super(owner, config);

    this.model = {
        members : [],
        entries:[],
        turns:15
    };

      this.initDisplay();
      this.setupEvents();
   }


   setupEvents() {
       this.scene.events.on("spy.redraw",this.redraw,this);
   }

   initDisplay(){

       //background
       let g = this.scene.make.graphics({x:0,y:0,add: false});
       CanvasTools.rectangle(g,{x:-this._config.width/2,y:-this._config.height/2, width:this._config.width, height:this._config.height, color:0xffffff, radius:0});
       this.container.add(g);

       //render the 'turn' seperation markers.


       //create our maps of groups of items
       this.memberDisplayItems = new Map<string, any>();
       
   }


   redraw(){
       //lets update any display objects.


       //some mesurements for our display objects.
       let row_height = this._config.height/this.model.members.length;
       
       let ability_display_size = row_height / Math.max(...this.model.members.map(o => o.abilities.length)); //this is an nice es6 function - https://stackoverflow.com/questions/4020796/finding-the-max-value-of-an-attribute-in-an-array-of-objects?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa

       //but if there is one we should only display one fat boy.
       
       
       ability_display_size = Math.min(ability_display_size,row_height);
      
       //this size of our draggable items (minus the avatars and UI items)
       let gant_size = this._config.width - row_height - ability_display_size;

       //this size of a section of the gant chart
       let turn_size = gant_size / this.model.turns; 

       let ui_base_margin = 6; //MUST BE EVEN PLZ





    // lets render each member
    for (let i = 0; i  < this.model.members.length; i++) {
       
        let memeber = this.model.members[i];

        let dsp = this.memberDisplayItems.get(memeber.name);

        //if we dont not have a display object for this member lets render it.
        if(dsp === undefined){
            dsp = {}
            this.memberDisplayItems.set(memeber.name, dsp);
            
            //render avatar
            dsp.avatar = this.scene.add.image(0,0,memeber.avatar);
            this.absInContainer(0,row_height*i,row_height,row_height,dsp.avatar);
            
            this.container.add(dsp.avatar);
            
            dsp.abilityButtons = [];
            //render ability buttons
            for(let j = 0; j < memeber.abilities.length; j ++){

               let abilitySettings = [
                   {
                       id:"attack",
                       colors: [0xe78815, 0xa9691b, 0x6e4717],
                       icon:"\uf255"
                   },
                   {
                    id:"steal",
                    colors: [0x7fc423, 0x446814, 0x20310a],
                    icon:"\uf256"
                },
                {
                    id:"hack",
                    colors: [0x23ade5, 0x056caf, 0x013b60],
                    icon:"\uf109"
                }
               ]

               let ability = null;
               for(let k in abilitySettings){
                   if(abilitySettings[k].id === memeber.abilities[j]){
                       ability = abilitySettings[k];
                       break;
                   }
               }

              let btn = new Button(this.scene, {
                       x:0,
                       y:0,
                       label: ability.icon, 
                       font: {
                        fontFamily: "fontawesome",
                        fontSize: "64px",
                        align: "center"
                       },
                       roundedCorners: { sw: true },
                       width:100,
                       height: 100,
                       color:ability.colors,
                       onClick:"ui.buttons.action",
                       radius:0,
                    });

                //postion it
                 this.absInContainer(row_height,row_height*i + (ability_display_size*j),ability_display_size,ability_display_size,btn);

                //add to our container
                this.container.add(btn);
                this.container.add(btn._label);

                //and save to our obj
                dsp.abilityButtons.push(btn);
            }



            // render timeline background maybe?


        }


       

      

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