import GameData from "../plugins/global/GameData";
import HUDModel from "../models/HUDModel";

export default class HUDOverlay extends Phaser.Scene {

    private _model: HUDModel;

    constructor() {
        super({
            key: "HUDOverlay", active: true
        });
        console.log("HUD BOOT");

    }

    preload() {

        //we can populate our models here, our data controller shold have loaded our data in by now.
        //this.load.image('tiles', 'assets/img/tiles.png');

    }

    create() {
        this._model = (this.sys.plugins.get("_data") as GameData).getDataFor("HUDOverlay", true); //true is a clone.

    }



    update() {

        this.events.emit("spy.update");
    }

    shutdown() {

    }

}
