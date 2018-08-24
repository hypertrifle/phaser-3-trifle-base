import TitleScreenModel from "../models/TitleScreenModel";
import GameData from "../plugins/global/GameData";

export default class TitleScreen extends Phaser.Scene {

    game_data: TitleScreenModel;

    constructor() {
        super({
            key: "TitleScreen", active: true
        });
        console.log("TitleSceeen::constructor");

    }

    preload() {
        console.log("titleScene::preload");

        //we can populate our models here, our data controller shold have loaded our data in by now.
        this.load.image('tiles', 'assets/img/tiles.png');
        this.load.tilemapTiledJSON('map', 'assets/json/map.json');

    }

    create() {
        console.log("titleScene:: Create");
        // this.events.emit("state:action", this._gant.model);

        this.game_data = (this.sys.plugins.get("_data") as GameData).getDataFor("titleScreen", true);



    }



    update() {

        this.events.emit("spy.update");
    }

    shutdown() {

    }

}
