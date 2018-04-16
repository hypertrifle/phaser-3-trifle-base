import DataController from '../controllers/DataController.js';
import HTMLController from '../controllers/HTMLController.js';
import TrackingController from '../controllers/TrackingController.js';

export default class Controller extends Phaser.Scene {

   private svg:Phaser.GameObjects.Image;

   constructor()
   {

        //super the scene class
        super({ key: 'controller' });    

        //data controller
      //   this.sys._data = new DataController();

      //   //tracking controller
      //   this.sys._tracking = new TrackingController();

      //   //HTML controller
      //   this.sys._html = new HTMLController();
        
       
   }

   preload()
   {
       //this is the first time the game will have a chance to load any assets.
      //  this.load.image('avatar', 'assets/logo.png');
      //  this.load.svg('test', 'assets/svg/test.svg');
      //  this.load.json("settings", "assets/json/settings.json");
      //  this.load.json("content", "assets/json/content.json");


   }

   create()
   {
        //now that we have assets avalilible we can load the settings files
      //   this.sys._data.loadModel(this.cache.json.get("settings"));

      //   //see if we have any save data
      //   try {
      //       this.sys._tracking.loadModel(this.sys._data.save);
      //   } catch(e){
      //       console.warn("error initilising tracking controller");
      //   }


        //load our Scenes from config
        // this.sys._data.get("states").forEach(element => {
        //     // this.scene.add()
        // });

        //start which one we want.
        // this.state.start(this.sys._data.get("start_state"));


        //test reasons
        // this.scene.add(TemplateScene);

      //called on boot of game
      console.log("Scene:", this);

      this.testSVG();


      

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
