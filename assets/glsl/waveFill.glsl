   precision highp float;

   //the basics.
   uniform sampler2D uMainSampler;
   uniform float time;
   uniform float speed;
   uniform float size;
   uniform float delay;
      uniform vec2 resolution;
   uniform vec3 colour;


   uniform vec2 upperSplitPosition;
   uniform vec2 lowerSplitPosition;




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

    //a 360 hue to 0-1 float calc.
    float h2f(float deg){
        return mod(deg / 360.,1.);
    }

   
    

    vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

vec3 rgb2hsv(vec3 c)
{
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}


float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))
                 * 43758.5453123);
}

// 2D Noise based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float smoothNoise (in vec2 st) {
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



     float progress(float min_value, float max_value, float progress){
        return (max_value - min_value)*progress + min_value;
    }
    
    void main(void)
        {
            

            vec2 position = outTexCoord/resolution;

            //our seperation vectors this will change when views chnage, but for now they are hard coded.




            //noise gives up some texture without loading anythign onto the GPU
            float noise = smoothNoise(outTexCoord)*0.04;

            //this is a blue to teal
            vec3 topHSV = vec3( 
                h2f( progress(33.,41.,position.x)),
                progress(0.09,0.30,position.x),
                progress(0.92,0.87,position.x)+noise
            );
            //convert to RBG and apply out noise
            vec4 topColour = vec4(hsv2rgb(topHSV), 1.); //top section

            

            //this is our dark to purple grad
            vec3 middleHSV = vec3( 
                h2f( progress(341.,357.,position.x)),
                progress(0.37,0.22,position.x),
                progress(0.73,0.81,position.x)+noise
            );
            //convert to RBG and apply out noise
            vec4 middleColour = vec4(hsv2rgb(middleHSV), 1.); //mid section


            //this is a pinky purpley gradient
            vec3 bottomHSV = vec3( 
                h2f( progress(235.,247.,position.x)),
                progress(0.62,0.75,position.x),
                progress(0.47,0.40,position.x)+noise
            );
            //convert to RBG and apply out noise
            vec4 bottomColour = vec4(hsv2rgb(bottomHSV), 1.); //bottom bar

            float hoirizonWobble1 = (sin(position.x*2. + time*0.2)*0.01); //TODO: smoothstep
            float hoirizonWobble2 = (sin(position.x + time*0.5)*0.015); //TODO: smoothstep


            float seperationOne = smoothstep(0.,0.002, position.y - progress(upperSplitPosition.x,upperSplitPosition.y,position.x)+hoirizonWobble1 );

            vec4 topCompound = mix(topColour,middleColour,seperationOne);

            float seperationTwo = smoothstep(0.,0.002, position.y - progress(lowerSplitPosition.x,lowerSplitPosition.y,position.x)+hoirizonWobble2 );


            gl_FragColor = mix(topCompound, bottomColour, seperationTwo);
            

        // gl_FragColor = vec4(0.,position.y,position.x,1.);

        }
 