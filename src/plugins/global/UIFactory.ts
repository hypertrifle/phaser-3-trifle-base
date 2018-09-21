import GameData from "./GameData";
import UIModel from "../../models/UIModels";
import { PositionManager } from "./ScaleManager";

export default class UIFactory extends Phaser.Plugins.BasePlugin {
  private _model: UIModel;

  /**
   * @constructor Creates an instance of the UIFactory plugin (that handles UI Elements, buttons, sliders and toggles).
   * @param {Phaser.Plugins.PluginManager} pluginManager
   * @memberof GameData
   */

  constructor(pluginManager: Phaser.Plugins.PluginManager) {
    super(pluginManager);
    console.log("UIFactory::constructor");
    // so this should be where we can define out methods and options for UI based element generation
  }

  init() {
    // this is always called by a plugin right?
    this._model = (this.pluginManager.get("_data") as GameData).getDataFor(
      "userInterface"
    );
  }

  get canvas(): Phaser.GameObjects.Graphics {
    return this.scene.add.graphics();
  }

  // button(_conf: ButtonConfig): Phaser.GameObjects.Container {

  //     let button = this.scene.add.container(_conf.x, _conf.y);

  //     //lets save the initial config options in the buttons dataManager
  //     button.data.set("config", _conf);

  //     // lets add the shape
  //     let bg:Phaser.GameObjects.Graphics = this.canvas;
  //     CustomGraphicsTools.roundedRectangle(bg,0,0,_conf.width, _conf.height,_conf.radius);

  //     let states: Array<string> = ["up", "down", "over", "out"];

  //     //for each state lets associate the events / colours tints required.
  //     for (let i in states) {
  //         let state = states[i];

  //         button.on('pointer'+state, function () {
  //             //get the config.
  //             let _conf: ButtonConfig = this.data.get("config") as ButtonConfig;

  //             let color: number | null = null;
  //             let event: () => void | string = null;

  //             switch (state) {
  //                 case "up":
  //                     color = _conf.color_up || null;
  //                     event = _conf.onOut || null;
  //                     break;
  //                 case "down":
  //                     color = _conf.color_down || null;
  //                     event = _conf.onDown || null;

  //                     break;
  //                 case "over":
  //                     color = _conf.color_over || null;
  //                     event = _conf.onOver || null;

  //                     break;
  //                 case "out":
  //                     color = _conf.color_up || null;
  //                     event = _conf.onOut || null;
  //                     break;
  //             }

  //             //if we have a colour down.
  //             if (color) {
  //                 this.tint = color;
  //             }

  //             //if we have a callback /event string
  //             if (_conf.onDown) {
  //                 if (typeof _conf.onDown === "string") {
  //                     //event string
  //                     this.scene.events.emit(_conf.onDown);
  //                 } else {
  //                     //should expect it to be a function
  //                     _conf.onDown.apply([]);
  //                 }
  //             }

  //         });

  //     }

  //     return button;
  // }
}

class ButtonConfig {
  x: number;
  y: number;
  width: number;
  height: number;
  radius: number = 0;
  color_up: number;
  color_over: number;
  color_down: number;
  colour_disabled: number;
  opacity: number;

  eventContext: any;

  // callback can either be a function or event.
  onUp?: () => void | string;
  onDown?: () => void | string;
  onOver?: () => void | string;
  onOut?: () => void | string;
}

export class CustomGraphicsTools {
  static roundedRectangle(
    canvas: Phaser.GameObjects.Graphics,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number,
    color?: number
  ) {
    canvas.fillRoundedRect(x, y, width, height, radius);
  }
}
