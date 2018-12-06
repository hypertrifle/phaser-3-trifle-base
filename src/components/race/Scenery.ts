import Drive2Scene from "../../scenes/Drive2";
import BaseScene from "../../scenes/BaseScene";

 interface SceneryConfig extends GameObjectConfig {

}

export default class Scenery extends Phaser.GameObjects.Image {

  hasBeenUsed:boolean = false;
  owner: Drive2Scene;

   constructor(scene: Phaser.Scene,config: SceneryConfig) {
     super(scene,500,20,"atlas.png", "palm_shadow_left.png");
     this.owner = scene as Drive2Scene;
     scene.add.existing(this);
     this.visible = false;
     this.setOrigin(0.5, 1-0.03)
   }


   

 }