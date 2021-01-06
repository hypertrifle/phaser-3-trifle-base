import BaseScene from "../core/scenes/BaseScene";

export interface WormConstraints {
    oddCollisionGroup: number;
    evenCollisionGroup: number;


}

export class WormSegment extends Phaser.GameObjects.GameObject {

    _outerBody: MatterJS.Body;
    _innerBody: MatterJS.Body;

    constructor(scene: BaseScene, constraints: WormConstraints, isOdd: boolean, initalPosition: Phaser.Math.Vector2, radius = 50) {

        super(scene, "suasage-segment");

        this._outerBody = scene.matter.add.circle(initalPosition.x, initalPosition.y, radius, { restitution: 0.9 }) as MatterJS.Body;
        this._innerBody = scene.matter.add.circle(initalPosition.x, initalPosition.y, radius - 10, { restitution: 0.9 }) as MatterJS.Body;



        // if()


    }

}

export default class PhysicsTestsScene extends BaseScene {

    constructor() {
        super({
            key: "PhysicsTestScene",
            active: true
        });

    }

    create(): void {
        super.create();
        console.log("PhysicsTestScene::Create");
        // const bounds = new Phaser.Math.Vector2(this.game.config.width as number , this.game.config.height as number );
        // this.matter.world.setBounds(0, 0, bounds.x, bounds.y);



        // const circle1 = new WormSegment(this, bounds.scale(1/2),50);

        // console.log(circle1._outerBody.collisionFilter);

        // const outerCategory = this.matter.world.nextCategory();
        // circle1._outerBody.collisionFilter.group = outerCategory;

        // const innerCategory = this.matter.world.nextCategory();
        // circle1._innerBody.collisionFilter.group = innerCategory;

        // console.log(circle1._outerBody.collisionFilter);

        // circle1._innerBody.collisionFilter.mask = innerCategory;
        // circle1._outerBody.collisionFilter.mask = outerCategory;

        // console.log(this.matter.world);


        // this.matter.add.mouseSpring({});


    }

    update(): void {
        // super.update();
    }


}