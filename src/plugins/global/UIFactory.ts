import GameData from './GameData';
import UIModel from '../../models/UIModels';
import { PositionManager } from './ScaleManager';

export default class UIFactory extends Phaser.Plugins.BasePlugin {


    private _model: UIModel;

    /**
       * @constructor Creates an instance of the UIFactory plugin (that handles UI Elements, buttons, sliders and toggles).
       * @param {Phaser.Plugins.PluginManager} pluginManager
       * @memberof GameData
       */

    constructor(pluginManager: Phaser.Plugins.PluginManager) {
        super(pluginManager);
        console.log('UIFactory::constructor');
        // so this should be where we can define out methods and options for UI based element generation
    }

    init() {
        // this is always called by a plugin right?
        this._model = (this.pluginManager.get('_data') as GameData).getDataFor('userInterface');

    }


    get canvas():Phaser.GameObjects.Graphics{
        return this.scene.add.graphics();
    }




    button(_conf: ButtonConfig): Phaser.GameObjects.Container {


        let button = this.scene.add.container(_conf.x, _conf.y);

        //lets save the initial config options in the buttons dataManager
        button.data.set("config", _conf);
        


        // lets add the shape
        let bg:Phaser.GameObjects.Graphics = this.canvas;
        CustomGraphicsTools.roundedRectangle(bg,0,0,_conf.width, _conf.height,_conf.radius);
        
        //add Events
        button.on('pointerdown', function () {
            //get the config.
            let _conf:ButtonConfig = this.data.get("config") as ButtonConfig;

            //if we have a colour down.
            if(_conf.color_down){
                this.tint = _conf.color_down;
            }

            //if we have a callback /event string
            if(_conf.onDown){
                if(typeof _conf.onDown === "string"){
                    //event string
                    this.scene.events.emit(_conf.onDown);
                } else {
                    //should expect it to be a function
                    _conf.onDown.apply([]);
                }
            }

        });
        button.on('pointerup', function () {
        
        });
        button.on('pointerover', function () {
        
        });
        button.on('pointerout', function () {
        
        });
        






        return button;
    }

}

class ButtonConfig {

    x: number;
    y: number;
    width:number;
    height:number;
    radius:number = 0;
    color_up: number;
    color_hover: number;
    color_down: number;
    colour_disabled: number;
    opacity: number;

    eventContext:any;

    //callback can either be a function or event.
    onUp?:() => void | string;
    onDown?:() => void | string;
    onOver?:() => void | string;
    onOut?:() => void | string;

 
}


export class CustomGraphicsTools{

    static roundedRectangle(canvas:Phaser.GameObjects.Graphics,x:number, y:number,width:number, height:number, radius:number, color?:number){
        canvas.fillRoundedRect(x,y,width,height,radius);
    }



    
}