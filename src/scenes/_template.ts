import SpongeUtils from '../plugins/global/Sponge';

export default class REPLACEMEScene extends Phaser.Scene {

    private sponge: SpongeUtils;

    constructor() {
        super({
            key: 'REPLACEMEScene', active: true
        });
        console.log('REPLACEMEScene::constructor');


    }

    preload() {
        console.log('REPLACEMEScene::preload');

    }

    create() {
        // grab our utils
        this.sponge = this.sys.plugins.get('sponge') as SpongeUtils; // cast


    }

     update(time: number, delta: number) {
        super.update(time, delta);


    }

    shutdown() {
        // drop references to anything we have in create
        this.sponge = null;


    }

}
