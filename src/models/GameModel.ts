import SaveDataModel from "./SaveModel";
import { TitleSceneModel } from "../../KEEP/TitleSceneModel";
import UIModel from "./UIModels";

/**
 * Data Model - this holds all information that may be required, some
 * content.json AND setting.json files, and will be ready after the boot state has completed,
 * this will need to be updated for each game to reflect the structure of the data being loaded.
 *
 * @export
 * @class DataModel
 *
 */
/* These are defined in src/models/*.ts and unless they are small settings objects its a good place to abstract them to... */


export default class GameModel {

  // constants are good for quick checks of things.
  /**
   * reference to our sae data model
   *
   * @type {SaveDataModel}
   * @memberof GameModel
   */
  save: SaveDataModel; // add we will add functionallity to the model class, we will include but we can always type some of the code we are expecting.
  scaling: ScalingModel;
  userInterface: UIModel;
  fonts: Array<Phaser.GameObjects.Text.TextStyle>;

}

/* small so just whack it here */
export class ScalingModel {
  resizeToParent:boolean = true; //priority.
  expandToParent: boolean = true;
  shouldForceOrientationOnMobile: boolean = true;
  shouldForceLandscaprOnMobile: boolean = true;
  maxWidth: number = undefined;
  maxHeight: number = undefined;
}
