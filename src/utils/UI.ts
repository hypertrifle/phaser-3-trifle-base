import { Scene, GameObjects } from "phaser";
import { Corners } from "../models/Global";


export class CanvasTools {


    static rectangle(canvas: GameObjects.Graphics, config: any) {

        //default values
        let w = config.width;
        let h = config.height;
        let r = config.radius || 0;
        let x = config.x;
        let y = config.y;

        //if radius is greater than height / width lets set radius to max possible value
        if (w < 2 * r) r = w / 2;
        if (h < 2 * r) r = h / 2;

        //start path
        canvas.beginPath();

        canvas.fillStyle(config.color, 1.0);


        canvas.moveTo(x + r, y);



        // //top side
        canvas.lineTo(x + w - r, y);

        //NE corner
        // arc: function (x, y, radius, startAngle, endAngle, anticlockwise, close)
        canvas.arc(x + w - r, y + r, r, Phaser.Math.DegToRad(270), Phaser.Math.DegToRad(360), false);

        //right side
        canvas.lineTo(x + w, y + h - r);

        //SE corner
        canvas.arc(x + w - r, y + h - r, r, Phaser.Math.DegToRad(0), Phaser.Math.DegToRad(90), false);


        //bottom
        canvas.lineTo(x, y + h);


        //SW corner
        canvas.arc(x + r, y + h - r, r, Phaser.Math.DegToRad(90), Phaser.Math.DegToRad(180), false);


        //left
        canvas.lineTo(x, y + r);

        //NW corner
        canvas.arc(x + r, y + r, r, Phaser.Math.DegToRad(180), Phaser.Math.DegToRad(270), false);


        canvas.closePath();
        canvas.fillPath();
    }

}

interface DropShadow {
    x: number,
    y: number,
    color: number,
    opacity: number
}


interface ButtonOptions {
    x: number,
    y: number,
    width: number,
    height: number,
    color: number[], // assuming that we will work with #
    radius: number,
    label?: string,
    font?: any, // a basic font configuration object
    onClick?: string //we are gonna ditch callback functions for events, -- more protection agaist destroyed objects, getting caught up in shit.
    roundedCorners?: Corners,
    shadow?: DropShadow,
    bevel?: number
}

export class Make {

}


export class Button extends Phaser.GameObjects.Image {

    private _clickEventString: string;
    private _key: string;

    _label: Phaser.GameObjects.Text;

    _drop: DropShadow;


    setScale(x?: number, y?: number): Phaser.GameObjects.GameObject {

        super.setScale(x, y);
        if (this._label) {
            this._label.setScale(x, y);
        }
        return this;
    }

    setPosition(x?: number, y?: number): Phaser.GameObjects.GameObject {


        //call our standard positioning
        super.setPosition(x, y);


        if (this._label) {
            this._label.setPosition(x - (this.width*0.3*this.scaleX), y- (this.height*0.3*this.scaleY));
        }
        return this;
    }

    constructor(scene: Scene, config: ButtonOptions) {

        console.log("UI::Button", config);


        //anything we use in creating this button we should use in out key.
        let key = JSON.stringify({ w: config.width, h: config.height, c: config.color, corns: config.roundedCorners, r: config.radius });

        //todo: if this key doesn't exist, let go ahead and create the idividual frames

        if (true) {

            // now we are going to create meat and veg of this button, the shapes and sterf 
            // i usually would try and make this a sprite sheet but seems phaser3 doesn't have 
            // ability to save graphics object to the cache with spritesheet options.
            let canvas = scene.make.graphics({ add: false }); //todo:where we xy

            //we now want to draw each frame to the graphics object.    

            //   let shadowX = (config.shadow)? config.shadow.x :0;
            //   let shadowY = (config.shadow)? config.shadow.y :0;


            //   if(config.shadow){
            //     CanvasTools.rectangle(canvas, {x:shadowX,y:shadowY, width:config.width, height:config.height, color:config.shadow.color, radius:config.radius});      
            //     }

            CanvasTools.rectangle(canvas, { x: 0, y: 0, width: config.width, height: config.height, color: config.color[0], radius: config.radius });
            //and save that texture to cache.
            canvas.generateTexture(key + "-up", config.width, config.height);

            //over
            CanvasTools.rectangle(canvas, { x: 0, y: 0, width: config.width, height: config.height, color: config.color[1], radius: config.radius });
            canvas.generateTexture(key + "-over", config.width, config.height);

            //down
            CanvasTools.rectangle(canvas, { x: 0, y: 0, width: config.width, height: config.height, color: config.color[2], radius: config.radius });
            canvas.generateTexture(key + "-down", config.width, config.height);

        }

        // super (as an image) which gives us the basis of our button
        // image gives us enough visual flexability along with not inheriting functionallity associated with moving objects
        // passing the key generated as above, and assuming the first from for de
        super(scene, config.x, config.y, key + "-up", 0);


        this._key = key;

        //save the event we want to use for the callback - again we will use events to avoid callbacks that doen't exist.
        this._clickEventString = config.onClick;



        //this game object will be interactive.
        this.setInteractive();


        //our input events
        this.on('pointerover', function (e: any) {
            this.setTexture(this._key + "-over");
        });

        this.on('pointerout', function (e: any) {
            this.setTexture(this._key + "-up");

        });

        this.on('pointerdown', function (e: any) {
            this.setTexture(this._key + "-down");

        });

        this.on('pointerup', function (e: any) {
            this.setTexture(this._key + "-up");

            //callback on up :)
            this.scene.events.emit(this._clickEventString);
        });

        //add to the scene?
        // this.scene.add.existing(this);

        if (config.label) {
            //we need to add a label to this button
            this._label = scene.add.text(this.x, this.y, config.label, config.font);
            this.setPosition(this.x, this.y)
        }
    }


}