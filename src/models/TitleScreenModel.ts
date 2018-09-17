/**
 * Data that is used for the title screen.
 *
 * @export
 * @interface TitleScreenModel
 */
export class TitleScreenModel {
    /**
     * this title to of the game
     *
     * @type {string}
     * @memberof TitleScreenModel
     */
    title: string;
    /**
     * Optional body text to show on title screen.
     *
     * @type {string}
     * @memberof TitleScreenModel
     */
    body?: string;


    /**
     * background colour of this state.
     *
     * @type {number}
     * @memberof TitleScreenModel
     */
    backgroundColor?: string;
}

export default TitleScreenModel;