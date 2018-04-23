import PlanningScene from "./PlanningScene";
import Splene from "./Splene";
import {StateModel} from "../models/Global";

export default class Controller extends Splene {

   private svg:Phaser.GameObjects.Image;

   constructor()
   {

        super({ key: 'controller' });    
        console.log(this);

   }

   preload()
   {
      //  this.load.image('avatar', 'assets/logo.png');
      //  this.load.svg('test', 'assets/svg/test.svg');
      //  this.load.json("settings", "assets/json/settings.json");
      //  this.load.json("content", "assets/json/content.json");


   }

   create()
   {
        //now that we have assets avalilible we can load the settings files
      this._data.loadModel(this.cache.json.get("settings"));

        //see if we have any save data
        try {
            this._tracking.loadModel(this._data.save);
        } catch(e){
            console.warn("error initilising tracking controller");
        }


        // load our Scenes from config
        // this._data.get("states",true).forEach(e:StateModel => {
            // this.scene.add()
        // });

        //start which one we want.
        // this.scene.start(this._data.get("start_state", true));


        //test reasons
        this.scene.add("PlanningScene",PlanningScene,true);

      //called on boot of game
    //   console.log("Scene:", this);

    //   this.testSVG();
      

      //boot first scene.

   }

   update(t:integer,dt:number){

   
   }



   testSVG():void{
    console.log("testing svg featureset");

    this.svg = this.add.image(this.cameras.main.width/2, this.cameras.main.height/2, 'test');
    this.svg.setScale(2,2);
    console.log(this.svg);
   }

}
