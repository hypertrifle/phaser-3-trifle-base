
var LabelButton = require("../components/LabelButton");


var TemplateScene = new Phaser.Class({

   Extends: Phaser.Scene,

   initialize:
   function TemplateScene ()
   {
       Phaser.Scene.call(this, { key: 'flood' });

   },

   assets : {
      atlas:[],
      sounds:[],
      spriteshhets:[],
      text:[]
   },

   preload: function ()
   { 
      //called to load assets before create.

      //I want to do somthing like
      this.sys._load(assets);

   },

   resetModel: function ()
   {
      this.flags = {
         hasWon: false,
         hasFailed: false,
         isPaused: false,
         shouldRemoveItem: false
      };

      this.score = 0;
      this.lives = 3;
   },

   create: function ()
   {
      this.createView();
      this.resetModel();
      console.log("TemplateScene::Create");

  
      
      //called on open of this scene.
   },

   createView: function(){
         //where we add visual items to scene.

          //example of how to construct classes, see the labelbutton class for simple class extension.
          this.button1 = new LabelButton({
            width: 100,
            height: 50,
            label: "CLick Me",
            callback: this.onButtonOnePress,
            context: this
         });
   
         //sprites
         this.sprite1 = this.add.sprite();
   
   },
   shutdown: function ()
   {
      //on exit of state - this is where we destroy / kill / removed anything the belongs to the view.
      this.sys._unload(assets);
      

   },
   update: function ()
   {
      //update loop.
   }

});

module.exports = TemplateScene;