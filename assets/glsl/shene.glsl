   precision highp float;

   //the basics.
   uniform sampler2D uMainSampler;
   uniform float time;
   uniform float speed;
   uniform float size;
   uniform float delay;
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

   float flp(in float f){
       return 1.-f;
   }

    float applySheen(in float size,in float offset, in float position, in float progress){
        return 1.;
    }

    float cubicIn(float t) {
        return t * t * t*t;
    }


    //main entry point
    // GLSL it's mainly math based functions, operating on colour channels, everything
    //usually scales between 0-1 so the vec4(1.,0.,0.,1.) would be red.
    // when working with floats (which you will, you need the decimal point regardless).
    // http://www.shaderific.com/glsl-functions/ is a nice break down of what functions you can use when working with GLSL Shaders (supported by WebGL)
    
    void main(void)
        {

            // the basics with no modification to the pixel (or point) would be:
            vec4 inColour = getPixelColour(outTexCoord);

            //just take the alpha value of this pixel for now.
            vec4 sheenColour = vec4(inColour.a);

            //position of the wipe 0 -1;
            float position = ((outTexCoord.x+outTexCoord.y)/2.);

            //calulate the distance from start of sheen to end
            float progress = cubicIn(mod(time*speed,1.+delay));

            //initilise our vibrance vaible which will
            //use for the mix at the end
            float vibrance = 0.;

            // apply a first gradient modifier
            vibrance = 1.-smoothstep(progress,progress+size, position);

            //then apply a hard edge at the furthers point.
            vibrance = mix(vibrance, 1.,  step(progress+size, position ));

            //save to the output
            gl_FragColor = mix(inColour, sheenColour ,(1.-vibrance));


        }
