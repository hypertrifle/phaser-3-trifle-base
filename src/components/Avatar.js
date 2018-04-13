var Avatar = new Phaser.Class({

    Extends: Phaser.GameObjects.Sprite,

    //initilise is our contstructor.
    initialize:
    function Avatar (scene, x, y)
   {
    //super the image class. (our inheritance)
    Phaser.GameObjects.Sprite.call(this, scene, { key: 'Avatar' });
    

    this.setTexture('avatar');
    this.setPosition(x,y);
    this.setOrigin(0);

    console.log(this);

    //finally add this game object to our scenes world
    scene.children.add(this);
   },

   update: function (time)
   {
        console.log("update");
        this.destroy();
   },

   destroy: function (){
        this.destroy();
   }

});


module.exports = Avatar;