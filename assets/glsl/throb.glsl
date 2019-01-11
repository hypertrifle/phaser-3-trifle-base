   precision highp float;

   //the basics.
   uniform sampler2D uMainSampler;
   uniform float time;
   uniform vec2 resolution;


   // second sampler if neeeeded.
   // uniform sampler2D uPostTexture;
   // a vector can of course be any size.

   // uniform vec3 backStitchColour;

   //this is whats is passed from our vertex shader, for post processing or simple effects, its the x,y position.
   varying vec2 outTexCoord;

   // we can have functions.
   vec4 getPixelColour( in vec2 uv){
    return texture2D(uMainSampler, uv);
   }


    //main entry point
    // GLSL it's mainly math based functions, operating on colour channels, everything /usually/ scales between 0-1 so the vec4(1.,0.,0.,1.) would be red.
    // when working with floats (which you will, you need the decimal point regardless).
    // http://www.shaderific.com/glsl-functions/ is a nice break down of what functions you can use when working with GLSL Shaders (supported my WebGL)
    
    void main(void)
        {

            // the basics with no modification to the pixel (or point) would be:
            vec4 inColour = getPixelColour(outTexCoord);

            //make modifications
            // inColour.r = outTexCoord.x*inColour.a;
            // inColour.b = outTexCoord.y*inColour.a;

            //save to the output
            gl_FragColor = inColour;


        }
