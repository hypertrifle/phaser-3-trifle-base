class Avatar extends Phaser.GameObjects.Sprite {

    constructor(scene, x, y)
   {
    //super the image class. (our inheritance)
    super({ key: 'Avatar' });
    

    this.setTexture('avatar');
    this.setPosition(x,y);
    this.setOrigin(0);

    console.log(this);

    //finally add this game object to our scenes world
    scene.children.add(this);
   }

   update(time)
   {
        console.log("update");
        this.destroy();
   }

   destroy(){
        this.destroy();
   }

}

module.exports = Avatar;