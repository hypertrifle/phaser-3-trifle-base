import { Scene } from "phaser";

export default class HTMLUtils extends Phaser.Plugins.BasePlugin {
  /**
   * @constructor Creates an instance of the HTMLUtils plugin (that handles any non phaser HTML based content / functionallity).
   * @param {Phaser.Plugins.PluginManager} pluginManager
   * @memberof GameData
   */
  constructor(pluginManager: Phaser.Plugins.PluginManager) {
    super(pluginManager);
    console.log("HTMLUtils::constructor");

    // TODO: setup any dom elements that may need to be required (EI popup containers.)

    // TODO: listen to any resize events to allow ups to keep out HTML content in the same size and format of that of the game.

    // TODO: parse and validate all of our popups and look for issues now?
  }

  get support():boolean{
    return (!window || !window.location || !window.location.hash );
       
   }
 
 
   public postBoot(bootState: Scene) {
    // this is called when all states and systems are loaded.
 
 
    this.restoryHistoryFragment();
 
 
   }
 
   navigate(fragment:string){
 
   }
 
 
 
   restoryHistoryFragment(){
    if (this.support && window.location.hash.length > 1) {
       let target = window.location.hash.replace("#","");
 
       }
 
   }
}