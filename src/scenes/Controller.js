
//our Controller, is what used to be our game class, this is where we contain our global objects.
var Controller = new Phaser.Class({

   Extends: Phaser.Scene,

   initialize:

   function Controller ()
   {
       Phaser.Scene.call(this, { key: 'controller' });
   },

   preload: function ()
   {
       //this is the first time the game will have a chance to load any assets.
    //    this.load.
   },

   create: function ()
   {

        //load our controllers into the global sys object. actual names tbc

        //data controller
        this.sys._data = {name:"custom data model"};

        //tracking controller
        this.sys._tracking = {name:"class relating to tracking / recording progress"};

        //HTML controller
        this.sys._html = {name:"class to manipulate html objects"};

        //load our Scenes from config
        // this.sys._data.get("states").forEach(element => {
        //     // this.scene.add()
        // });

        //start which one we want.
        // this.state.start(this.sys._data.get("start_state"));


        //test reasons
        this.scene.add(TemplateScene);

      //called on boot of game
      console.log("Scene:", this);



      //boot first scene.

   }

});

module.exports = Controller;