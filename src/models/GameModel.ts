import SaveDataModel from "./SaveModel";
import  TitleScreenModel  from "./TitleScreenModel";

/**
 * Data Model - this holds all information that has been imported from the 
 * content.json files, and will be ready after the boot state has completed, 
 * this will need to be updated for each game to reflect the structure of the data being loaded.
 *
 * @export
 * @class DataModel
 * 
 */
export default class GameModel {

    save: SaveDataModel;
    icons: Array<string>;
    title_screen: TitleScreenModel;
}