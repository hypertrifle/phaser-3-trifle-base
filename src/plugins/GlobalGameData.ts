/*
 * A Plugin that handles common Data models for spronge projects, 
 * these are automatically loaded from json files and typed cast on boot.
 *
 * @export
 * @class GlobalGameData
 * @extends {Phaser.Plugins.BasePlugin}
 */

export default class GlobalGameData extends Phaser.Plugins.BasePlugin {

    /**
     * A raw representation of the current data model loaded into the game.
     *
     * @private
     * @type {DataModel}
     * @memberof GlobalGameData
     */
    private raw: DataModel;


    /**
     * @constructor Creates an instance of GlobalGameData plugin (that handles any extra data based functionallity).
     * @param {Phaser.Plugins.PluginManager} pluginManager
     * @memberof GlobalGameData
     */
    constructor(pluginManager: Phaser.Plugins.PluginManager) {
        super(pluginManager);

        console.log("GlobalGameData::contstuct");

    }

    init() {
        console.log("GlobalGameData::init");
    }

    loadData(contentJSONObject: any) {
        this.raw = contentJSONObject; // this should through errors if we try and load data to our raw models that doesn't fit in with those defined above.
        console.log("loaded content to _data plugin", this.raw);
    }

    getDataFor(path?: string, clone?: boolean): any {
        let shouldClone = clone || true;
        let obb: any = this.raw;

        if (path !== undefined && path.trim() !== "") {
            let parts = path.split(".");
            for (var i = 0; i < parts.length; i++) {

                obb = obb[parts[i]];

                if (obb === undefined) {

                    var errObj = parts[length];
                    console.warn("game.data.get, tried to request key of: " + path + " but failed at getting: ", errObj);
                    return null;
                }
            };
        } 
        
        return (shouldClone) ? JSON.parse(JSON.stringify(obb)) : obb;

    }

    /**
     * get the current save model value
     *
     * @type {SaveDataModel}
     * @memberof GlobalGameData
     */
    get save(): SaveDataModel {
        return this.raw.save;
    }


    /**
     * set the save model value and persist data if required.
     *
     * @memberof GlobalGameData
     */
    set save(newSave: SaveDataModel) {

        this.raw.save = newSave;

        this.persistStorage();

    }

    persistStorage() {
        console.log("persisting storage for", this.save);


        // console.log("GlobalGameData::otherFunction");
    }


}

/**
 * Data Model - this holds all information that has been imported from the 
 * content.json files, and will be ready after the boot state has completed, 
 * this will need to be updated for each game to reflect the structure of the data being loaded.
 *
 * @export
 * @class DataModel
 * 
 */
export class DataModel {

    save: SaveDataModel;
    icons: Array<string>;
    title_screen: TitleScreenModel;

    customArray: Array<CustomObjectModel>;
}


/**
 * Represents any of the data required for a persistent explerience,
 * Leaner progress, version numbers and save reference are valuble here
 *
 * @export
 * @class SaveData
 */
export class SaveDataModel {

    /**
     * and id for this game, used as a unique varible sor save data
     *
     * @type {string}
     * @memberof SaveData
     */
    identifier: string;
    /**
     * Version string number of the format X.Y.
     * X = major, Y = minor, Z = bug fixes
     *
     * @type {string}
     * @memberof SaveData
     */
    version: string;

    /**
     * should this save data be persistent, IE - restore when re-visiting the experience.
     *
     * @type {boolean}
     * @memberof SaveData
     */
    shouldPersistData: boolean;

    /**
     *  a generic game progress varible, they will usually be changed per experience but just a simple counter for the moment.
     *
     * @type {number}
     * @memberof SaveData
     */
    progress: number

    /**
     * This stores the data from the save model in its current state.
     *
     * @private
     * @type {SavaDataModel}
     * @memberof SaveData
     */
    private data: SaveDataModel;

    /**
     * This is a more elegant way of determining information from data
     * we already have, This examines if the leaner is past the first 
     * level, in which we are assuming they have seen the tutorial
     *
     * @readonly
     * @memberof SaveData
     */
    get seenTutorial() {
        return (this.data.progress > 0) ? true : false;
    }


    /**
     * a way to set if somone has seen the tutorial, again this derives the info from our data.
     * so less serilised varibles required in our sae object.
     *
     * @memberof SaveData
     */
    set seenTutorial(val) {
        //if progressed passed tutorial used that or level 1, else reset to tutorial
        this.data.progress = (val) ? Math.max(this.data.progress, 1) : 0;
    }

}


export interface TitleScreenModel {
    title: string;
    body: string;

}

/**
 * an interface can be seen as a typed model, the only difference is an interface CANNOT have methods. (like custom getters and settes defined above)
 * @export
 * @interface CustomObjectModel
 */
export interface CustomObjectModel {
    prop1: string;
    prop2: number;
}