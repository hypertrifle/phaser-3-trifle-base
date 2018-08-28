import GameModel from '../../models/GameModel';
import SaveModel from '../../models/SaveModel';


/**
 * An ENUM to keep track of different Tracking modes that we can connect to.
 *
 * @enum {number}
 */
enum TrackingMode {
    Off = 0,
    OfflineStoage,
    Scorm,
    Adapt,
}


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
     * the tracking mode this current project is set up to work with.
     *
     * @private
     * @type {TrackingMode}
     * @memberof GameData
     */
    private trackingMode: TrackingMode = TrackingMode.Off;


    /**
     * @constructor Creates an instance of GameData plugin (that handles any extra data based functionallity).
     * @param {Phaser.Plugins.PluginManager} pluginManager
     * @memberof GameData
     */
    constructor(pluginManager: Phaser.Plugins.PluginManager) {
        super(pluginManager);
        console.log('GameData::constructor');

    }

    /**
     * any unitilise function
     *
     * @memberof GameData
     */
    init() {

        // we now want to merge our settings, and our content for a single model, we will prefer settings over content but try and warn over overites.
        console.log('GameData::init');



        this.loadData([this.game.cache.json.get('settings'), this.game.cache.json.get('content')]);



        this.detectTrackingVersion();
    }


    /**
     * Detect and store the type of trackign system we want to use.
     *
     * @memberof GameData
     */
    detectTrackingVersion() {

        // temp
        this.trackingMode = TrackingMode.OfflineStoage;

    }

    /**
     * Load a untyped data model into this DataController so we can parse and access later.
     *
     * @param {*} contentJSONObject
     * @memberof GameData
     */
    loadData(contentJSONObject: any|Array<any>) {

        let data: any = {};

        // lets get this into an array of json objest, we are going to
        let contentJSONObjects = (Array.isArray(contentJSONObject)) ? contentJSONObject.reverse() : [contentJSONObject];


        // for each model file loaded.
        for (let i in contentJSONObjects) {

            // for each top level object.
            for (let j in contentJSONObject[i]) {

                // if the key doesn't exists.
                    if (data[j] === undefined) {
                        // just assign
                        data[j] = contentJSONObject[i][j];
                    } else {

                        // we are goining to merge properties here, maybe we should check for overwrites and inform console.
                        for (let k in data[j] ) {
                            if (contentJSONObject[i][j][k] !== undefined) {
                                console.warn('json file conflict, data for \'' + j + '.' + k + '\' has multiple definitions, will use: ' + contentJSONObject[i][j][k]);
                            }
                        }

                        // merge objects, but with priority of current
                        data[j] = Object.assign(data[j], contentJSONObject[i][j]);
                    }
            }
        }

        // finally assign our data to raw.
        this.raw = data as GameModel;

        console.log(this.raw);

        // this.raw = contentJSONObject; // this should through errors if we try and load data to our raw models that doesn't fit in with those defined above.

        // load any persistent storage we have in tranking system back into our game.
        this.persistantStorageLoad();


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

        let shouldClone = clone || true;
        let obb: any = this.raw;

        // if we have a path to find
        if (path !== undefined && path.trim() !== '') {

            // recurse down (with . seperation) until we find the
            let parts = path.split('.');
            for (let i = 0; i < parts.length; i++) {
                obb = obb[parts[i]];

                if (obb === undefined) {

                    let errObj = parts[length];
                    console.warn('game.data.get, tried to request key of: ' + path + ' but failed at getting: ', errObj);
                    return null;
                }
            }
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

        this.persistantStorageSave();

    }

    persistantStorageLoad() {


        switch (this.trackingMode) {
            case TrackingMode.OfflineStoage:
            default:

            // let
        }



        if (this.getDataFor('save.shouldPersistData')) {
            console.log('persisting storage loading to: ', this.save);

        }

    }

    persistantStorageSave() {
        if (this.getDataFor('save.shouldPersistData')) {
            console.log('persisting storage for', this.save);

        }

    }


}
