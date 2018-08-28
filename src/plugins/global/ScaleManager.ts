import GameData from './GameData';

export default class ScaleManager extends Phaser.Plugins.BasePlugin {
    /**
       * @constructor Creates an instance of the ScaleManager plugin (that handles resizing, and density options)
       * the idea behind this scale manager is not only will it resize the content but aslo be able to apply scaling to SVG content so we can either imporvie visual fedlity, or performance.

       *
       * @param {Phaser.Plugins.PluginManager} pluginManager
       * @memberof GameData
       */

    /**
     * the custom scale we are using for this width / height setup of the game, this can be used to tweak performance for lower machines, to render svgs at
     * smaller textures
     *
     * @type {number}
     * @memberof ScaleManager
     */
    public scale: number;

    private _data: GameData;


    constructor(pluginManager: Phaser.Plugins.PluginManager) {

        super(pluginManager);
        console.log('ScaleManger::constructor');

        this._data = (this.pluginManager.get('_data') as GameData);
        let settings: any = this._data.getDataFor('scaling', true);

    }


    public init(s: Phaser.Loader.FileTypes.SVGSizeConfig) {
        console.log('ScaleManger::constructor', s);
        this.scale = s.scale;

        // lets edit anything we need to do with the data.

        let fonts = this._data.getDataFor('fonts');

        for (let i in fonts) {
            this.applyFontScalar(fonts[i]);
        }

        // //can we set a default SVG scaling option for all SVG imports?
        // this.

    }

    public boot() {
        // this is where this.system and this.scene are now avaailible.

    }


    // a  getter for gnereic svg scaler object based on game design / render size.
    get svgSizeConfig(): Phaser.Loader.FileTypes.SVGSizeConfig {
        return {scale: this.scale};
    }




private applyFontScalar(fontObject: any) {

}

}

/* this is the pervious scale manager that I used from @Antriel
//ScaleManager.js
class ScaleManager {
   constructor(canvas, isMobile, isLandscape) {

       this.canvas = canvas;
       this.mobile = isMobile;
       this.landscape= isLandscape;

       window.addEventListener('resize', () => {
           this.resize(this.canvas);

           if (this.mobile) {
               if (window.innerWidth < window.innerHeight) {

                if (this.landscape)
                    this.enterIncorrectOrientation();
                else
                    this.leaveIncorrectOrientation();

            } else {
                if (this.landscape)
                    this.leaveIncorrectOrientation();
                else
                    this.enterIncorrectOrientation();
               }
           }
       });

       this.resize(this.canvas);
   }

   resize(canvas) {
       let scale = Math.min(window.innerWidth / canvas.width, window.innerHeight / canvas.height);
       let orientation = (this.mobile) ? 'left' : 'center';
       canvas.setAttribute('style', '-ms-transform-origin: left top; -webkit-transform-origin: left top;' +
           ' -moz-transform-origin: left top; -o-transform-origin: left top; transform-origin: left top;' +
           ' -ms-transform: scale(' + scale + '); -webkit-transform: scale3d(' + scale + ', 1);' +
           ' -moz-transform: scale(' + scale + '); -o-transform: scale(' + scale + '); transform: scale(' + scale + ');' +
           ' display: block; margin: 0;'
       );
   }

   enterIncorrectOrientation() {
       document.getElementById("orientation").style.display = "block";
       document.getElementById("content").style.display = "none";
   }

   leaveIncorrectOrientation() {
       document.getElementById("orientation").style.display = "none";
       document.getElementById("content").style.display = "block";
   }
}
export default ScaleManager;
*/