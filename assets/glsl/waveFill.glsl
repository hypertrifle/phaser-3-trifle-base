   precision highp float;

   //the basics.
   uniform sampler2D uMainSampler;
   uniform float time;
   uniform float speed;
   uniform float size;
   uniform float delay;
   uniform vec2 resolution;
   uniform vec3 colour;


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

   float flp(in float f){
       return 1.-f;
   }


    float cubicIn(float t) {
        return t * t * t * t;
    }

    float hype(float a, float o){
        return sqrt((a*a)+(o*o));
    }
#pragma glslify: noise = require('glsl-noise/simplex/3d')

    //main entry point
    // GLSL it's mainly math based functions, operating on colour channels, everything
    //usually scales between 0-1 so the vec4(1.,0.,0.,1.) would be red.
    // when working with floats (which you will, you need the decimal point regardless).
    // http://www.shaderific.com/glsl-functions/ is a nice break down of what functions you can use when working with GLSL Shaders (supported by WebGL)
    
    void main(void)
        {

            // the basics with no modification to the pixel (or point) would be:
            vec4 inColour = getPixelColour(outTexCoord);

            // generate our shene colour based on the tint * the alpha level of source.
            vec4 sheenColour = colour.rgbb* inColour.a; 

            // position of the wipe 0 -1;
            float position = ((outTexCoord.x*outTexCoord.y)/2.) + size;
            // float position = hype(outTexCoord.x , outTexCoord.y);
            // float position = 0.5;

            // calulate the distance from start of sheen to end
            float progress = cubicIn(mod(time*speed,1.+delay));

            // initilise our vibrance vaible which will
            // use for the mix at the end
            float vibrance = 0.;

            // apply a first gradient modifier
            vibrance = 1.-smoothstep(progress,progress+size, position);

            // then apply a hard edge at the furthers point.
            vibrance = mix(vibrance, 1.,  step(progress+size, position ));

            // save to the output
            gl_FragColor = mix(inColour, sheenColour ,(1.-vibrance));


        }
 