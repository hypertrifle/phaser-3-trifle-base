export default class Avatar extends Phaser.GameObjects.Sprite {

    constructor(scene:Phaser.Scene, x:integer, y:integer)
   {
    //super the image class. (our inheritance)
    super(scene, x, y ,"Avatar");
    

    this.setTexture('avatar');
    this.setPosition(x,y);
    this.setOrigin(0);

    console.log(this);

    //finally add this game object to our scenes world
    // scene.children.add(this);
   }

   update():void
   {

    
   }

   destroy():void{
        super.destroy();
   }

}