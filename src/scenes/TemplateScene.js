var LabelButton = require("../components/LabelButton");

class TemplateScene extends Phaser.Scene {
    constructor() {
        super();
    }

    preload() {
        //called to load assets before create.

        //I want to do somthing like
        this.sys._load(assets);

    }

    resetModel() {
        this.flags = {
            hasWon: false,
            hasFailed: false,
            isPaused: false,
            shouldRemoveItem: false
        };

        this.score = 0;
        this.lives = 3;
    }

    create() {
        //called on open of this scene.
        this.resetModel();
        this.createView();
        console.log("TemplateScene::Create");

    }

    createView() {
        //where we add visual items to scene.

        //example of how to construct classes, see the labelbutton class for simple class extension.
        this.button1 = new LabelButton({
            width: 100,
            height: 50,
            label: "CLick Me",
            callback: this.onButtonOnePress,
            context: this
        });

        //sprites
        this.sprite1 = this.add.sprite();

    }
    shutdown() {
        //on exit of state - this is where we destroy / kill / removed anything the belongs to the view.



    }
    update() {
        //update loop.
    }

}

export {
    TemplateScene as
    default
}