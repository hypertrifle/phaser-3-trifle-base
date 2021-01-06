import BaseScene from "../core/scenes/BaseScene";

export interface TopDisplayConfig {

    maxItems: number;
    playerColours: number[];

}

export class TopDisplayBar {
    
    scene: BaseScene;

    backgrounds: Phaser.GameObjects.Polygon[];


    constructor(scene: BaseScene, config: TopDisplayConfig){
        this.scene = scene;

        const width = 160;
        const height = 160;
        const points = [0,0, width,0, width,height, 0,height];

        const gridWidth = scene.cameras.main.width / (config.maxItems+1);

        for(let i = 0; i< config.maxItems; i++){

            // points[0] = Phaser.Math.RND.integerInRange(-10, 10);
            // points[6] = Phaser.Math.RND.integerInRange(-10, 10);

            // points[2] = Phaser.Math.RND.integerInRange(width-10, width+10);
            // points[4] = Phaser.Math.RND.integerInRange(width-10, width+10);

            // points[5] = Phaser.Math.RND.integerInRange(height-10, height+10);
            // points[7] = Phaser.Math.RND.integerInRange(height-10, height+10);



           const p = this.scene.add.polygon(gridWidth* (i+1),0,points, config.playerColours[i]);
           p.setOrigin(0.5, 0);
        }



        

    }
}

export default class UITestsScene extends BaseScene{

    private _top: TopDisplayBar;

    constructor(){
        super({
            key:"UITestsScene",
            active: false
        });

    }

    create() {
        super.create();
        console.log("UITestsScene::Create");
        
        this._top = new TopDisplayBar(this, {
            maxItems:5,
            playerColours: [0x8d36d9,0xD93662,0xd9ce36,0x36d94c,0x36a3d9]
        })
   
    }

    update(){
        // super.update();
    }


}