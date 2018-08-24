import GameModel from "../../models/GameModel";
import SaveModel from "../../models/SaveModel";

/*
 * A Plugin that handles common Data models for spronge projects, 
 * these are automatically loaded from json files and typed cast on boot.
 *
 * @export
 * @class GameData
 * @extends {Phaser.Plugins.BasePlugin}
 */

export default class GameData extends Phaser.Plugins.BasePlugin {

    /**
     * A raw representation of the current data model loaded into the game.
     *
     * @private
     * @type {GameModel}
     * @memberof GameData
     */
    private raw: GameModel;


    /**
     * @constructor Creates an instance of GameData plugin (that handles any extra data based functionallity).
     * @param {Phaser.Plugins.PluginManager} pluginManager
     * @memberof GameData
     */
    constructor(pluginManager: Phaser.Plugins.PluginManager) {
        super(pluginManager);

        console.log("GameData::contstuct");

    }

    /**
     * any unitilise function
     *
     * @memberof GameData
     */
    init() {
        console.log("GameData::init");
    }

    /**
     * Load a untyped data model into this DataController so we can parse and access later.
     *
     * @param {*} contentJSONObject
     * @memberof GameData
     */
    loadData(contentJSONObject: any) {
        this.raw = contentJSONObject; // this should through errors if we try and load data to our raw models that doesn't fit in with those defined above.
        console.log("loaded content to _data plugin", this.raw);
    }

    /**
     * get data from the loaded data model, a string can be used to access nested objects ie fonts.h1 would access "me" from { fonts : { h1 : "me" } }
     * 
     *
     * @param {string} [path] - the path of data property to retrieve.
     * @param {boolean} [clone] - should we refernece this object or clone it
     * @returns {*} - returns an untyped object - to be validated yourself.
     * @memberof GameData
     */
    getDataFor(path?: string, clone?: boolean): any {

        console.log(this);

        let shouldClone = clone || true;
        let obb:any = this.raw;

        //if we have a path to find
        if (path !== undefined && path.trim() !== "") {

            //recurse down (with . seperation) until we find the 
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
     * @memberof GameData
     */
    get save(): SaveModel {
        return this.raw.save;
    }


    /**
     * set the save model value and persist data if required.
     *
     * @memberof GameData
     */
    set save(newSave: SaveModel) {

        this.raw.save = newSave;

        this.persistStorage();

    }

    persistStorage() {
        if (this.getDataFor("save.shouldPersistData")) {
            console.log("persisting storage for", this.save);
            
        }

    }


}
