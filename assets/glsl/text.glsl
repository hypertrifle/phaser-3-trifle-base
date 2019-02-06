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

    float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))
                 * 43758.5453123);
}

// 2D Noise based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noisegen (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    // Smooth Interpolation

    // Cubic Hermine Curve.  Same as SmoothStep()
    vec2 u = f*f*(3.0-2.0*f);
    // u = smoothstep(0.,1.,f);

    // Mix 4 coorners percentages
    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
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

            // float bounds = mix(colour.r,colour.b, sin(time)*position.x);
            float bounds = sin(time*2.)*(colour.b-colour.r) ;//  (colour.b-colour.r) * position.x-(offset.x/resolution.x); //sin(time) ;


            float noise = max(0.,colour.r - noisegen(position*resolution)*0.1);

            vec4 col = vec4(position.x, position.y, 1., colour.a  ) *noise ;
            vec4 col2 = vec4(position.x, position.y-0.05, 1., colour.a  ) * noise;
            vec4 col3 = vec4(position.x-0.05, position.y, 1., colour.a  ) * noise;



            // col.r = mix(1.-col.a,outPosition.x,col.r);
            // col.a = outPosition.x;

            vec2 scaledTime = vec2(cos(time *-0.2),sin(time*0.2) );
            vec2 gridDensity = vec2(0.10,0.8)*size;

            float x_mix = sin((position.x+position.y+scaledTime.x)*gridDensity.x);

            float y_mix = sin((position.y-position.x+scaledTime.y)*gridDensity.y);

            vec4 strokeColour = vec4(1., 0.0, 1., colour.b);
            
            // gl_FragColor =  mix(mix(col, mix(col2,col3,smoothstep(0.1,0.9,y_mix)),smoothstep(0.1,0.9,x_mix)),strokeColour, bounds);
            gl_FragColor =  vec4(1.,1.,1.,col.a)*noise;

        }
 