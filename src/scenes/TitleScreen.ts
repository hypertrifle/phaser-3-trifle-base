import GlobalGameData, { DataModel, TitleScreenModel } from "../plugins/GlobalGameData";

export default class TitleScreen extends Phaser.Scene {

    game_data: TitleScreenModel;

    constructor() {
        super({
            key:"TitleScreen"
        });

        console.log("TitleSceeen::constructor",this);

        this.game_data = (this.sys.plugins.get("_data") as GlobalGameData).getDataFor("titleScreen", true);

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

        


    }



    update() {

        this.events.emit("spy.update");
    }

    shutdown() {

    }

}
