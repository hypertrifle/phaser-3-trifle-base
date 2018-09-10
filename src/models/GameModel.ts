import SaveDataModel from './SaveModel';
import  TitleScreenModel  from './TitleScreenModel';
import UIModel from './UIModels';
import TestSceneModel from './TestSceneModel';

/**
 * Data Model - this holds all information that has been imported from the
 * content.json AND setting.json files, and will be ready after the boot state has completed,
 * this will need to be updated for each game to reflect the structure of the data being loaded.
 *
 * @export
 * @class DataModel
 *
 */
export default class GameModel {

    save: SaveDataModel; // add we will add functionallity to the model class, we will include but we can always type some of the code we are expecting.
    title_screen: TitleScreenModel;
   

    /* These are defined in src/models/*.ts and unless they are small settings objects its a good place to abstract them to... */ 
    scaling: ScalingModel;
    userInterface: UIModel;
    testScreen: TestSceneModel;
    global: GlobalModel;


    icons: Array<string>;
    fonts: Array<Phaser.GameObjects.Text.TextStyle>;

}

/* small so just whack it here */
export class ScalingModel {
    expandToPartent: boolean = true;
    shouldForceOrientationOnMobile: boolean = true;
    shouldForceLandscaprOnMobile: boolean = true;

}

/* small so just whack it here */
export class GlobalModel {
    isDebug: boolean = true;
}