import BaseScene from "./BaseScene";

export interface TopDisplayConfig {

    maxItems: number;
    playerColours: number[];

}

export class TopDisplayBar {

    scene: BaseScene;

    backgrounds: Phaser.GameObjects.Polygon[];


    constructor(scene: BaseScene, config: TopDisplayConfig) {
        this.scene = scene;

        const width = 160;
        const height = 160;
        const points = [0, 0, width, 0, width, height, 0, height];

        const gridWidth = scene.cameras.main.width / (config.maxItems + 1);

        for (let i = 0; i < config.maxItems; i++) {

            const p = this.scene.add.polygon(gridWidth * (i + 1), 0, points, config.playerColours[i]);
            p.setOrigin(0.5, 0);
        }
    }
}

export default class UITestsScene extends BaseScene {

    private _top: TopDisplayBar;

    constructor() {
        super({
            key: "UITestsScene",
            active: false
        });

    }

    create(): void {
        super.create();
        console.log("UITestsScene::Create");

        this._top = new TopDisplayBar(this, {
            maxItems: 5,
            playerColours: [0x8d36d9, 0xD93662, 0xd9ce36, 0x36d94c, 0x36a3d9]
        })

        const testText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, this.tools.data.content.strings.test, this.tools.data.ui.fonts.h1);
        console.log(testText);
        testText.setTint(this.tools.data.ui.settings.colors.primaryNumber);


        console.log(this.tools.data);
    }

    update(): void {
        // super.update();
    }


}