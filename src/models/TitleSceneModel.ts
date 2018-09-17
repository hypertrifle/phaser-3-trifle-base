/**
 * Data that is used for the title screen.
 *
 * @export
 * @interface TitleSceneModel
 */
export class TitleSceneModel {
    /**
     * this title to of the game
     *
     * @type {string}
     * @memberof TitleSceneModel
     */
    title: string;
    /**
     * Optional body text to show on title screen.
     *
     * @type {string}
     * @memberof TitleSceneModel
     */
    body?: string;


    /**
     * background colour of this state.
     *
     * @type {number}
     * @memberof TitleSceneModel
     */
    backgroundColor?: string;
}

export default TitleSceneModel;