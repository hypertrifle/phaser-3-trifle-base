import GameData from "./GameData";

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
   public scale:number;


   constructor(pluginManager: Phaser.Plugins.PluginManager) {
      
      super(pluginManager);
       console.log("ScaleManger::constructor");
       this.game.scene


       let settings:any = (this.pluginManager.get("_data") as GameData).getDataFor("scaling", true); //true is a clone.

       this.originalArtboardSize = new Phaser.Geom.Point(settings.artboardWidth, settings.artboardHeight);
    

   }

   public setSVGSizeConfig(s:Phaser.Loader.FileTypes.SVGSizeConfig) {
      this.scale = s.scale;
   
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