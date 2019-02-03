   precision highp float;

   //the basics.
   uniform sampler2D uMainSampler;
   uniform float time;
   uniform float speed;
   uniform vec2 resolution;
   uniform vec2 offset;
   uniform vec2 size;
   uniform vec3 colour;


   // second sampler if neeeeded.
   // uniform sampler2D uPostTexture;
   // a vector can of course be any size.

   // uniform vec3 backStitchColour;

   //this is whats is passed from our vertex shader, for post processing or simple effects, its the x,y position.
   varying vec2 outTexCoord;
   varying vec2 outPosition;
//    varying vec2 outLetter;

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

    //main entry point
    // GLSL it's mainly math based functions, operating on colour channels, everything
    //usually scales between 0-1 so the vec4(1.,0.,0.,1.) would be red.
    // when working with floats (which you will, you need the decimal point regardless).
    // http://www.shaderific.com/glsl-functions/ is a nice break down of what functions you can use when working with GLSL Shaders (supported by WebGL)
    
    void main(void)
        {

            // save to the output
            vec4 colour = getPixelColour(outTexCoord);


            // vec2 position = (outPosition - offset)/size +vec2(1.,0.5);
            vec2 position = (outPosition / resolution);
            
            // dither the position?
            


            vec4 col = vec4(position.x, position.y, 1., colour.a  ) * colour.r;
            vec4 col2 = vec4(position.x, position.y-0.1, 1., colour.a  ) * colour.r;
            vec4 col3 = vec4(position.x-0.1, position.y, 1., colour.a  ) * colour.r;

            // col.r = mix(1.-col.a,outPosition.x,col.r);
            // col.a = outPosition.x;

            vec2 scaledTime = vec2(time *-0.000005,time *-0.01);
            vec2 gridDensity = vec2(50.);

            float x_mix = sin((position.x+scaledTime.x)*gridDensity.x);

            float y_mix = sin((position.y+scaledTime.y)*gridDensity.y);

            gl_FragColor =  mix(col, mix(col2,col3,sign(y_mix)),sign(x_mix));


        }
 