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




    button(_conf: ButtonConfig): Phaser.GameObjects.Container {
        let button = this.scene.add.container(_conf.x, _conf.y);

        // generate a button and return it.

        return button;
    }

}

interface ButtonConfig {
    x: number;
    y: number;

}
