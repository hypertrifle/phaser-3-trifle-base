import { Scene, GameObjects } from "phaser";

interface Corners {
   sw?:boolean, //question marks mean optional paramaters 
   se?:boolean,
   nw?:boolean,
   ne?:boolean
}



interface ButtonOptions {
   x:number,
   y:number,
   width:number,
   height:number,
   colour:string, // assuming that we will work with #
   roundedCorners:Corners,
   label:string,
   onClick:string //we are gonna ditch callback functions for events, -- more protection agaist destroyed objects, getting caught up in shit.
}

export class Button extends Phaser.GameObjects.Image {

   _clickEventString:string;

   constructor(scene:Scene, config:ButtonOptions){

      console.log("UI::Button", config);

      //anything we use in creating this button we should use in out key.
      let key = JSON.stringify({w:config.width,h:config.height,c:config.colour, corns:config.roundedCorners});

      //this this key doesn't exist, let go ahead and create the spritesheet
      if(true){
          //now we are going to create meat and veg of this button, the shapes and sterf
         
          let canvas = scene.make.graphics({x: 0, y: 0, add: false}); //todo:where we xy

          //we now want to draw each frame to the graphics object.



      }
      
      // super (as an image) which gives us the basis of our button
      // image gives us enough visual flexability along with not inheriting functionallity associated with moving objects
      // passing the key generated as above, and assuming the first from for default.
      super(scene,0,0,key,0);

      //save the event we want to use for the callback - again we will use events to avoid callbacks that doen't exist.
      this._clickEventString = config.onClick;

      //this game object will be interactive. (use the rectangle of our wh)
      this.setInteractive(new Phaser.Geom.Rectangle(0,0,config.width, config.height));


      //our input events
      this.on('pointerover', function (e:any) {
         this.setFrame(1); 
     });

      this.on('pointerout', function (e:any) {
         this.setFrame(0); 
     });

      this.on('pointerdown', function (e:any) {
         this.setFrame(2); 
     });

      this.on('pointerup', function (e:any) {
         this.setFrame(0); 
         //callback on up :)
         this.scene.events.emit(this._clickEventString)
         
     });

      //add to the scene?
      this.scene.add.existing(this);


   }
}