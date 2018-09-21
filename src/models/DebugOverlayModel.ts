/**
 * Data used for the Test / Debug Screen
 *
 * @export
 * @class TestSceneModel
 */
export default class DebugOverlayModel {
  /**
   * show broswer information
   *
   * @type {boolean}
   * @memberof TestSceneModel
   */
  showBrowserSpecificion: boolean = true;
  /**
   * show quick navigation to states
   *
   * @type {boolean}
   * @memberof TestSceneModel
   */
  showLinksToStates: boolean = true;
  /**
   * show quick scorm options for testing
   *
   * @type {boolean}
   * @memberof TestSceneModel
   */
  showScormDebugOptions: boolean = true;
  /**
   * display a list of avalible popups and a way to preview
   *
   * @type {boolean}
   * @memberof TestSceneModel
   */
  showAvailiblePopups: boolean = true;
  /**
   * export a copy of your save model - usefull for debugging.
   *
   * @type {boolean}
   * @memberof TestSceneModel
   */
  showExportSaveDataButton: boolean = true;
}
