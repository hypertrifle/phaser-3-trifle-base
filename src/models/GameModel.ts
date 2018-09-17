import SaveDataModel from './SaveModel';
import  TitleScreenModel  from './TitleScreenModel';
import UIModel from './UIModels';
import TestSceneModel from './TestSceneModel';
import DebugOverlayModel from './TestSceneModel';

/**
 * Data Model - this holds all information that has been imported from the
 * content.json AND setting.json files, and will be ready after the boot state has completed,
 * this will need to be updated for each game to reflect the structure of the data being loaded.
 *
 * @export
 * @class DataModel
 *
 */
/* These are defined in src/models/*.ts and unless they are small settings objects its a good place to abstract them to... */

export default class GameModel {
    /**
     * reference to our sae data model
     *
     * @type {SaveDataModel}
     * @memberof GameModel
     */
    save: SaveDataModel; // add we will add functionallity to the model class, we will include but we can always type some of the code we are expecting.
    scaling: ScalingModel;

    userInterface: UIModel;

    debugOverlay: DebugOverlayModel;

    global: GlobalModel;

    icons: Array<string>;

    fonts: Array<Phaser.GameObjects.Text.TextStyle>;




    // custom state models need to be added below here
    title_screen: TitleScreenModel;
}

/* small so just whack it here */
export class ScalingModel {
    expandToParent: boolean = true;
    shouldForceOrientationOnMobile: boolean = true;
    shouldForceLandscaprOnMobile: boolean = true;
    maxWidth: number = 1280;
    maxHeight: number = 720;
}

/* small so just whack it here */
export class GlobalModel {
    isDebug: boolean = true;
}