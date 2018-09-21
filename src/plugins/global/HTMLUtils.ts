export default class HTMLUtils extends Phaser.Plugins.BasePlugin {
  /**
   * @constructor Creates an instance of the HTMLUtils plugin (that handles any non phaser HTML based content / functionallity).
   * @param {Phaser.Plugins.PluginManager} pluginManager
   * @memberof GameData
   */
  constructor(pluginManager: Phaser.Plugins.PluginManager) {
    super(pluginManager);
    console.log("HTMLUtils::constructor");

    // TODO: setup any dom elements that may need to be required (EI popup containers.)

    // TODO: listen to any resize events to allow ups to keep out HTML content in the same size and format of that of the game.

    // TODO: parse and validate all of our popups and look for issues now?
  }
}
