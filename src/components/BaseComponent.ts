import BaseScene from "../scenes/BaseScene";

export interface BaseComponentConfig {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  gameObjectName?: string;
}

export default class BaseComponent extends Phaser.GameObjects.Container {
  protected _origin: Phaser.Geom.Point;
  protected _config: BaseComponentConfig;
  scene: BaseScene;

  // protected

  constructor(scene: Phaser.Scene, config: BaseComponentConfig) {

    // default x and y
    config.x = config.x !== undefined ? config.x : scene.game.config.width as number / 2;
    config.y = config.y !== undefined ? config.y : scene.game.config.height as number / 2;

    // default width and height
    config.width = config.width !== undefined ? config.width : scene.cameras.main.width;
    config.height = config.height !== undefined ? config.height : 0;


    // create this container.
    super(scene, config.x, config.y);


    // add the object to the scene.
    scene.add.existing(this);


    // save the origin.
    this._origin = new Phaser.Geom.Point(config.x, config.y);

    // default gameObjectName - this is used for error reporting.
    config.gameObjectName = config.gameObjectName !== undefined ? config.gameObjectName : this.constructor.name;


    // save the raw confic model.
    this._config = config;

  }

  /**
   * wake, show this GameObject and set active.
   *
   * @protected
   * @param {number} delay
   * @memberof BaseComponent
   */
  wake(delay?: number, animationTime?: number) {
    console.warn("BaseComponent.wake called but nothing applied, please implement 'wake' on " + this._config.gameObjectName );
  }

  endWake() {

  }


  /**
   * sleep, animate out and set the GameObject inactive.
   *
   * @protected
   * @param {number} delay
   * @memberof BaseComponent
   */
  protected sleep(delay?: number, animationTime?: number) {
    console.warn("BaseComponent.sleep called but nothing applied, please implement 'sleep' on " + this._config.gameObjectName );

  }

  endSleep() {

  }



}
