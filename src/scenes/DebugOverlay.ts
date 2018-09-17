import GameData from '../plugins/global/GameData';
import HUDModel from '../models/HUDModel';
import DebugOverlayModel from '../models/TestSceneModel';

export default class DebugOverlay extends Phaser.Scene {

    private _model: DebugOverlayModel;

    private combo: any;

    constructor() {
        super({
            key: 'DebugOverlay', active: true
        });
        console.log('HUD BOOT');

    }


    private container: Phaser.GameObjects.Container;
    private showHideTween: Phaser.Tweens.Tween;

    preload() {

        // we can populate our models here, our data controller shold have loaded our data in by now.
        // this.load.image('tiles', 'assets/img/tiles.png');

    }

    create() {
        this._model = (this.sys.plugins.get('_data') as GameData).getDataFor('debugOverlay', true); // true is a clone.
        console.log('debug overlay model create', this._model);

        this.container = this.add.container(this.game.config.width as number / 2, this.game.config.height as number);

        this.input.keyboard.createCombo('sponge', { maxKeyDelay: 1000 });
        this.input.keyboard.on('keycombomatch', function (event: any) {
            this.show();
            console.log(event);
        }, this);

        console.log('DEBUG::CREATE', this);

    }

    show() {
        this.showHideTween = this.tweens.add({
            targets: this.container,
            y: 0,
            ease: 'Power1',
            duration: 1000,
            onStart: this.unlockButtons
        });
    }


    hide() {
        this.showHideTween = this.tweens.add({
            targets: this.container,
            y: this.game.config.height as number,
            ease: 'Power1',
            duration: 1000,
            onStart: this.lockButtons
        });
    }

    unlockButtons() {
        console.log('DEBUG::UNLOCKBUTTONS');
    }

    lockButtons() {
        console.log('DEBUG::LOCKBUTTONS');
    }



    update() {




    }

    shutdown() {

    }

}
