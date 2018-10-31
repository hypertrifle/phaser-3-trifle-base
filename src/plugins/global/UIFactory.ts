import GameData from "./GameData";
import UIModel from "../../models/UIModels";
import { PositionManager } from "./ScaleManager";
import BaseComponent from "../../components/BaseComponent";

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
}




export class Button extends Phaser.GameObjects.Container {
  private background: Phaser.GameObjects.Image;
  private _label: Phaser.GameObjects.Text;
  private origin: Phaser.Geom.Point;

  pauseInteraction: boolean = false;

  constructor(scene: Phaser.Scene, config: ButtonConfig) {
    super(scene, config.x, config.y);

    this.origin = new Phaser.Geom.Point(config.x, config.y);

    scene.add.existing(this);

    let frame = config.frameName ? config.frameName : "tile-button";

    this.background = scene.add.image(0, 0, "atlas.svg", frame);

    this.add(this.background);

    if (config.label) {
      let style = config.font
        ? (scene as any).sponge.data.getDataFor("fonts." + config.font)
        : (scene as any).sponge.data.getDataFor("fonts.button");
      this._label = scene.add.text(0, 0, config.label, style);
      this._label.setOrigin(0.5, 0.7);
      this.add(this._label);
    }
    // this.background.alpha = 0;
    this.background.setInteractive();
    this.setSize(this.background.width, this.background.height);
    this.setInteractive();


    this.background.input.cursor = "pointer";

    this.background.on("pointerover", function(e: Event) {
      this.tint = 0xdddddd;
    });

    this.background.on("pointerout", function(e: Event) {
      this.tint = 0xffffff;
    });
    this.background.on("pointerdown", function(e: Event) {
      this.tint = 0xbbbbbb;
      this.parentContainer.emit("pointerdown");
    });
    this.background.on("pointerup", function(e: Event) {
      this.tint = 0xdddddd;
    });

    if (config.onUp) {
      this.background.on("pointerup", function(e: Event) {
        if (!this.pauseInteraction) {
        config.onUp.call(config.eventContext);
        }
      }.bind(this));
    }

    this.background.input.enabled = true;
    this.y = this.origin.y + 10;
    this.alpha = 0;
  }

  set label(s: string) {
    this._label.text = s;
  }
  get label(): string {
    return this._label.text;
  }

  wake(delay: number = 0) {
    this.background.input.enabled = true;
    this.scene.add.tween({
      targets: this,
      y: this.origin.y,
      alpha: 1,
      ease: "Quad.easeOut",
      duration: 500,
      delay: delay
    });
  }

  sleep
  () {
    this.background.input.enabled = false;
    this.scene.add.tween({
      targets: this,
      y: this.origin.y + 10,
      alpha: 0,
      ease: "Quad.easeOut",
      duration: 500
    });
  }
}

export class BarButton extends Phaser.GameObjects.Container {
  private background: Phaser.GameObjects.Image;
  private _label: Phaser.GameObjects.Text;
  private origin: Phaser.Geom.Point;

  pauseInteraction: boolean = false;

  constructor(scene: Phaser.Scene, config: ButtonConfig) {
    super(scene, config.x, config.y);

    this.origin = new Phaser.Geom.Point(config.x, config.y);

    scene.add.existing(this);

    let frame = config.frameName ? config.frameName : "tile-button";

    this.background = scene.add.image(0, 0, "atlas.svg", frame);

    this.add(this.background);

    if (config.label) {
      let style = config.font
        ? (scene as any).sponge.data.getDataFor("fonts." + config.font)
        : (scene as any).sponge.data.getDataFor("fonts.button");
      this._label = scene.add.text(0, 0, config.label, style);
      this._label.setOrigin((config.left)? -0.4 : 1.3, 0.5);
      this.add(this._label);
    }
    // this.background.alpha = 0;
    this.background.setInteractive();
    this.setSize(this.background.width, this.background.height);
    this.setInteractive();


    this.background.input.cursor = "pointer";

    this.background.on("pointerover", function(e: Event) {
      this.tint = 0xdddddd;
    });

    this.background.on("pointerout", function(e: Event) {
      this.tint = 0xffffff;
    });
    this.background.on("pointerdown", function(e: Event) {
      this.tint = 0xbbbbbb;
      this.parentContainer.emit("pointerdown");
    });
    this.background.on("pointerup", function(e: Event) {
      this.tint = 0xdddddd;
    });

    if (config.onUp) {
      this.background.on("pointerup", function(e: Event) {
        if (!this.pauseInteraction) {
        config.onUp.call(config.eventContext);
        }
      }.bind(this));
    }

    this.background.input.enabled = true;
    this.y = this.origin.y + 10;
    this.alpha = 0;
  }

  set label(s: string) {
    this._label.text = s;
  }
  get label(): string {
    return this._label.text;
  }

  wake(delay: number = 0) {
    this.background.input.enabled = true;
    this.scene.add.tween({
      targets: this,
      y: this.origin.y,
      alpha: 1,
      ease: "Quad.easeOut",
      duration: 500,
      delay: delay
    });
  }

  sleep
  () {
    this.background.input.enabled = false;
    this.scene.add.tween({
      targets: this,
      y: this.origin.y + 10,
      alpha: 0,
      ease: "Quad.easeOut",
      duration: 500
    });
  }
}


class ButtonConfig {
  x: number;
  y: number;
  label: string;
  eventContext?: any;
  font?: string;
  frameName?: string;
  left?: boolean;

  // callback can either be a function or event.
  onUp?: () => void | string;
  onDown?: () => void | string;
  onOver?: () => void | string;
  onOut?: () => void | string;
}

export class HexButton extends Phaser.GameObjects.Container {
  private background: Phaser.GameObjects.Image;
  private label: Phaser.GameObjects.Text;
  private origin: Phaser.Geom.Point;

  private _isOpen: boolean;

  get isOpen() {
    return this._isOpen;
  }

  set isOpen(value: boolean) {
    this._isOpen = value;

    if (this._isOpen) {
      this.background.tint = 0x498c9b;
      this.background.alpha = 1;
    } else {
      this.background.tint = 0x00000;
      this.background.alpha = 0.5;
    }
  }

  toggleOpen(): void {
    this.isOpen = !this.isOpen;
  }

  constructor(scene: Phaser.Scene, config: ButtonConfig) {
    super(scene, config.x, config.y);

    this.origin = new Phaser.Geom.Point(config.x, config.y);

    scene.add.existing(this);

    this.background = scene.add.image(0, 0, "atlas.svg", "global-hex-button");
    this.background.tint = 0x000000;
    this.background.alpha = 0.3;
    this.add(this.background);

    if (config.label) {
      let style = (scene as any).sponge.data.getDataFor("fonts.hexButton");
      this.label = scene.add.text(0, 0, config.label, style);
      this.label.setOrigin(0.5, 0.6);
      this.add(this.label);
    }
    // this.background.alpha = 0;
    this.background.setInteractive();

    this.background.input.cursor = "pointer";

    this.background.on("pointerover", function(e: Event) {
      if (!this.isOpen)
      this.background.alpha = 0.5;
    }.bind(this));

    this.background.on("pointerout", function(e: Event) {
      if (!this.isOpen)
      this.background.alpha = 0.3;
    }.bind(this));
    this.background.on("pointerdown", function(e: Event) {
      if (!this.isOpen)
      this.background.alpha = 0.7;
    }.bind(this));
    this.background.on("pointerup", function(e: Event) {
      if (!this.isOpen)
      this.background.alpha = 0.5;
    }.bind(this));

    this.background.on("pointerup", function(e: Event) {
      this.toggleOpen();
      if (config.onUp) {
        config.onUp.call(config.eventContext, this.isOpen);
      }
      }.bind(this));

    this.background.input.enabled = true;
    this.y = this.origin.y + 10;
    this.alpha = 0;
  }

  wake(delay: number = 0) {
    this.background.input.enabled = true;
    this.scene.add.tween({
      targets: this,
      y: this.origin.y,
      alpha: 1,
      ease: "Quad.easeOut",
      duration: 500,
      delay: delay
    });
  }

  sleep
  () {
    this.background.input.enabled = false;
    this.scene.add.tween({
      targets: this,
      y: this.origin.y + 10,
      alpha: 0,
      ease: "Quad.easeOut",
      duration: 500
    });
  }
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
