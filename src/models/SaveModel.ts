/**
 * Represents any of the data required for a persistent explerience,
 * Leaner progress, version numbers and save reference are valuble here
 *
 * @export
 * @class SaveModel
 */
export default class SaveModel {

    /**
     * and id for this game, used as a unique varible sor save data
     *
     * @type {string}
     * @memberof SaveModel
     */
    identifier: string;
    /**
     * Version string number of the format X.Y.
     * X = major, Y = minor, Z = bug fixes
     *
     * @type {string}
     * @memberof SaveModel
     */
    version: string;

    /**
     * should this save data be persistent, IE - restore when re-visiting the experience.
     *
     * @type {boolean}
     * @memberof SaveModel
     */
    shouldPersistData: boolean;

    /**
     *  a generic game progress varible, they will usually be changed per experience but just a simple counter for the moment.
     *
     * @type {number}
     * @memberof SaveModel
     */
    progress: number;


    /**
     * This is a more elegant way of determining information from data
     * we already have, This examines if the leaner is past the first
     * level, in which we are assuming they have seen the tutorial
     *
     * @readonly
     * @memberof SaveModel
     */
    get seenTutorial() {
        return (this.progress > 0) ? true : false;
    }


    /**
     * a way to set if somone has seen the tutorial, again this derives the info from our data.
     * so less serilised varibles required in our sae object.
     *
     * @memberof SaveModel
     */
    set seenTutorial(val) {
        // if progressed passed tutorial used that or level 1, else reset to tutorial
        this.progress = (val) ? Math.max(this.progress, 1) : 0;
    }

}