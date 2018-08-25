export default class UIFactory extends Phaser.Plugins.BasePlugin {
   
    /**
       * @constructor Creates an instance of the UIFactory plugin (that handles UI Elements, buttons, sliders and toggles).
       * @param {Phaser.Plugins.PluginManager} pluginManager
       * @memberof GameData
       */

    constructor(pluginManager: Phaser.Plugins.PluginManager) {
        
        super(pluginManager);
        
        console.log("UIFactory::constructor"); //
        //so this should be where we can define out methods and options for UI based element generation

        
    }

     

    button(scene:Phaser.Scene, settings:ButtonSettings):Phaser.GameObjects.Container {

        let c = new Phaser.GameObjects.Container(scene,settings.x,settings.y);
        return c;


    }

}

interface ButtonSettings {
    x: number,
    y: number,
    color_up: number,
    color_hover:number,
    color_down:number,
    colour_disabled:number,
    opacity: number,
    radius:number,
    eventString:string
}
