
export interface BaseComponentConfig {
   x?:number,
   y?:number,
   width?:number,
   height?:number
}

export class BaseComponent {
   
    public position: Phaser.Geom.Point;
    
    public scene: Phaser.Scene;
    
   protected container:Phaser.GameObjects.Container;
   
   protected _config:any;


   constructor(scene:Phaser.Scene, config:any){
      this.scene = scene;


      //default x and y
      config.x = (config.x !== undefined)? config.x : 0;
      config.y = (config.y !== undefined)? config.y : 0;

      //default width and height
      config.width = (config.width !== undefined)? config.width : scene.cameras.main.width;
      config.height = (config.height !== undefined)? config.height : 0;

      //we might want to pass in some sort of bounds object through the configuration object, I'm going to assume we want top left anchoring. TODO: anchor point.
      this.container = this.scene.add.container(config.x + config.width/2, config.y + config.height/2);

       this._config = config;
   }


   add(child:Phaser.GameObjects.GameObject | Phaser.GameObjects.GameObject[]):Phaser.GameObjects.Container{

      return this.container.add(child);
   }

   absInContainer(x:number,y:number,w:number,h:number, img:Phaser.GameObjects.Image) {

      //we are scaling based on desired size.
      img.setScale(w/img.width,h/img.height);

      //we are moving the anchor from top left to center.
      img.setPosition(x - this._config.width/2 + w/2, y - this._config.height/2 + h/2);


 }

   

}