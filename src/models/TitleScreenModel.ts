/**
 * Data that is used for the title screen.
 *
 * @export
 * @interface TitleScreenModel
 */
interface TitleScreenModel {
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
}

export default TitleScreenModel;