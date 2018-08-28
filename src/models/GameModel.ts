import SaveDataModel from './SaveModel';
import  TitleScreenModel  from './TitleScreenModel';
import UIModel from './UIModels';

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
    scaling: ScalingOptions;
    icons: Array<string>;
    userInterface: UIModel;
}

export class ScalingOptions {
    expandToPartent: boolean = true;
}