import GameModel from '../../models/GameModel';
import SaveModel from '../../models/SaveModel';
import HyperScorm from '../../libs/HyperScorm';


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
      * our instnace of the pipwreks-esque scorm wrapper
      *
      * @type {HyperScorm}
      * @memberof GameData
      */
     _scorm: HyperScorm;

    /**
     * any unitilise function
     *
     * @memberof GameData
     */
    public init() {

        // we now want to merge our settings, and our content for a single model, we will prefer settings over content but try and warn over overites.
        console.log('GameData::init');

        this.loadData([this.game.cache.json.get('settings'), this.game.cache.json.get('content')]);
        this.detectTrackingVersion();
    }


    /**
     *
     *
     * @param {(any|Array<any>)} contentJSONObject - either a json object to load, or an array of objects, later in the array will be prioritised.
     * @memberof GameData
     */
    private loadData(contentJSONObject: any|Array<any>) {

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
    public getDataFor(path?: string, clone?: boolean): any {

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

        // assign the save model
        this.raw.save = newSave;

        // make it persistent if required.
        this.persistantStorageSave();

    }


// ================================================
//
//   ####   ####   #####   #####    ###    ###
//  ##     ##     ##   ##  ##  ##   ## #  # ##
//   ###   ##     ##   ##  #####    ##  ##  ##
//     ##  ##     ##   ##  ##  ##   ##      ##
//  ####    ####   #####   ##   ##  ##      ##
//
// ================================================

    /**
   * Detect and store the type of trackign system we want to use.
   *
   * @memberof GameData
   */
    private detectTrackingVersion() {

        // if our tracking is explicitly disabled, lets jus set it off and return
        if (!this.raw.save.shouldPersistData) {
            this.trackingMode = TrackingMode.Off;
            return;
        }

        // try our instance of HyperScorm.
        this._scorm = HyperScorm.Instance;

        // if connected used that
        if (this._scorm.connected) {
            this.trackingMode = TrackingMode.Scorm;
        } else {
            // if not use offline storage.
            this._scorm = null; // drop an instance of if for MM
            this.trackingMode = TrackingMode.OfflineStoage;

        }

        console.log('tracking enabled with: ', this.trackingMode);
    }

    private getScorm(modelPath: string): string {
        let ret = this._scorm.get(modelPath);
        this.saveScorm();
        return ret;
    }

    private setScorm(modelPath: string, value: string) {
        this._scorm.set(modelPath, value);
        return this.saveScorm();

    }

    private saveScorm() {
        this.game.events.emit('systems.scorm.save', this.save);
        return this._scorm.save();
    }


    /**
     * loads persistent save data from current tracking system.
     *
     * @memberof GameData
     */
    private persistantStorageLoad() {

        let raw: string = '';

        switch (this.trackingMode) {
            case TrackingMode.Off:
                console.warn('ommititing load of persistent storage as we have it disabled');
                return;
            case TrackingMode.OfflineStoage:
                raw = localStorage.getItem(this.save.identifier);
                break;
            case TrackingMode.Scorm:
                raw = this.getScorm('cmi.suspend_data');
            default:
                break;
        }


        // convert to a Javascript Object and do any error checking required.
        let rawObj;
        try {
            rawObj = JSON.parse(raw);
        } catch (e) {
            console.warn('error trying to parse load, bu wit suspend data object, errors, roaw strong loaded: ', raw);
        }

        // finally assign to our global save.
        this.save = rawObj;
    }

    /**
     * save persistent save data into current tracking system
     *
     * @memberof GameData
     */
    private persistantStorageSave() {

        let serilized = (this.trackingMode === TrackingMode.Off) ? '' : JSON.stringify(this.save);

        switch (this.trackingMode) {
            case TrackingMode.Off:
                console.warn('ommititing save of persistent storage as we have it disabled');
                return;

            case TrackingMode.OfflineStoage:
                // set the loacal storage item.
                localStorage.setItem(this.save.identifier, serilized);
                break;

            case TrackingMode.Scorm:
                // set the scorm suspend_data Item
                let raw = this.setScorm('cmi.suspend_data', serilized );
                break;

            default:
                console.warn("Attempting to persist storage but no tracking system selected");
                break;

        }

        // Any errorchecking on the save model now that it has restored?
        // possibly itterate through the keys and add any extas in that are in our models, but are not in the


    }


}
