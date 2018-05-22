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
