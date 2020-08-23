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
  identifier = "myGameId";
  /**
   * Version string number of the format X.Y.
   * X = major, Y = minor, Z = bug fixes
   *
   * @type {string}
   * @memberof SaveModel
   */
  version = "0.0.1";

  /**
   * should this save data be persistent, IE - restore when re-visiting the experience.
   *
   * @type {boolean}
   * @memberof SaveModel
   */
  shouldPersistData = false;

}
