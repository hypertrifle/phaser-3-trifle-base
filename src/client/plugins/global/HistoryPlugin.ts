import { Scene } from "phaser";


interface FragmentLocation {
   state:string;
   fragment:string;
   resumeFromFragment?:(fragment:string)=>void;
}


export default class HistoryPlugin extends Phaser.Plugins.BasePlugin {
   
  constructor(pluginManager: Phaser.Plugins.PluginManager) {
    super(pluginManager);
    this.game = pluginManager.game;
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
