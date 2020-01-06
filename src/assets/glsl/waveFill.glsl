   precision highp float;

#define S(a,b,t) smoothstep(a,b,t)
#define TWO_PI 6.28318530718
#define MAX_LINES 128


   //the basics.
   uniform sampler2D uMainSampler;
   uniform float time;
   uniform float speed;
   uniform float size;
   uniform float delay;
   uniform float dpi;
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
        return fract(deg / 360.);
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


    // float gridProjection(vec2 position){

    //     vec2 zeroCenter = (position *2.)-1.;

    //     zeroCenter = 

    //     // vec2 transformMovement = vec2(-time,2.*time);

    //     vec2 grid = sin(zeroCenter*resolution*0.05 + transformMovement)*1.;

    //     return max(grid.x, grid.y);
    // }
    float gridProjection(vec2 position){

    //add slant
    position.y += (position.y*0.8);
    position.x += (position.y*0.4);

    position.x *= 1.05;

    //add vanishing point
    // position.x *= 1.-(position.y*0.4);



    vec2 transformMovement = vec2(-time,2.*time);
    vec2 grid = sin(position*resolution*0.1 + transformMovement)*0.5;
	float dist = max(grid.x, grid.y);

	// return the result
	return smoothstep(0.32,0.75,dist)*2.;// + smoothNoise(position*resolution*0.7 + transformMovement)*0.2;
}


vec3 scanline(vec2 coord, vec3 screen)
{
  screen.rgb -= sin((coord.y*(0.9/1.) + (time * 2.0)))* 0.07;
  return screen;
}

float DistLine(vec2 p, vec2 a, vec2 b){
	vec2 pa = p-a;
    vec2 ba = b-a;
    float t = clamp(dot(pa, ba)/dot(ba, ba),0., 1.);
    return length(pa-ba*t);
}


float Line(vec2 p, vec2 a, vec2 b){
	float d = DistLine(p,a,b);
    float m = 0.5*S(.002,.00,d);
    
    return m;
}
    
    void main(void)
        {
            

            vec2 position = outTexCoord/resolution;


            //some small sine based wobble based on x position
            float hoirizonWobble1 = (sin(position.x*2. + time*0.6)*0.01);
            float hoirizonWobble2 = (sin(position.x + time*0.5)*0.015);

            
            //the position of the speperation between top and middle colour, smoothstep is for basic AA
            float seperationOne = smoothstep(0.,0.0015, position.y - progress(upperSplitPosition.x,upperSplitPosition.y,position.x)+hoirizonWobble1 );

            //the position of the speperation between middle and bottom colour, smoothstep is for basic AA
            float seperationTwo = smoothstep(0.,0.0015, position.y - progress(lowerSplitPosition.x,lowerSplitPosition.y,position.x)+hoirizonWobble2 );

            //calculate some level of "shadowing" between sections, just to add depth, will be applied to the V component of our hsv colour

            float shadowIntesity = 0.16;
            float shadowHeight = 0.025;
            
            float sep1Shadow = smoothstep(-shadowHeight,0., position.y - progress(upperSplitPosition.x,upperSplitPosition.y,position.x)+hoirizonWobble1 )*shadowIntesity;

            float sep2Shadow = smoothstep(-shadowHeight,0., position.y - progress(lowerSplitPosition.x,lowerSplitPosition.y,position.x)+hoirizonWobble2 )*shadowIntesity;

            

            //noise gives up some texture without loading anythign onto the GPU
            float noise = smoothNoise(outTexCoord/1.3)*smoothNoise(outTexCoord/1.2)*-0.1;

            vec2 movement = +vec2(-time,2.*time)*resolution;
            float noiseBase = smoothNoise((outTexCoord+movement)/1.3)*smoothNoise((outTexCoord+movement)+vec2(-time,2.*time)/1.2)*-0.1;

            //this is a blue to teal
            vec3 topHSV = vec3( 
                h2f( progress(33.,41.,position.x)),
                progress(0.09,0.30,position.x),
                progress(0.92,0.87,position.x)+noise - sep1Shadow
            );

            // topHSV.z -= sep1Shadow;




            //convert to RBG and apply out noise
            vec4 topColour = vec4(hsv2rgb(topHSV), 1.); //top section

            

            //this is our dark to purple grad
            vec3 middleHSV = vec3( 
                h2f( progress(341.,357.,position.x)),
                progress(0.37,0.22,position.x),
                progress(0.73,0.81,position.x)+noise - sep2Shadow
            );

            
            vec2 uv = (outTexCoord-.5*resolution.xy)/resolution.y;

            //float d = DistLine(uv, vec2(0), vec2(1));
            float m = 0.;
            
            uv *=2.;
            
                float scaled_time = (time+5.)*0.3;
            for(int i = 0;i<MAX_LINES;i++)
            {
                float j = float(i);
                float max_lines = float(MAX_LINES);


                // inner points
                float x = 2.1*sin(scaled_time*.4)*sin((j*TWO_PI)/max_lines+scaled_time);
                float y = 2.2*cos(scaled_time)*cos((j*TWO_PI)/max_lines+scaled_time);
                // outer points
                float x2 = 2.0*sin(scaled_time)*sin((j*TWO_PI)/max_lines+scaled_time*2.);
                float y2 =2.3*cos((j*TWO_PI)/max_lines+scaled_time+.5);
                m+=Line(uv,vec2(x,y),vec2(x2,y2));
            }

            middleHSV.z  += (m/2.);
            middleHSV.x  -= (m/8.);

            //convert to RBG and apply out noise
            vec4 middleColour = vec4(hsv2rgb(middleHSV), 1.); //mid section

            middleColour.rgb = scanline((position+scaled_time)*resolution,middleColour.rgb);

            //this is a pinky purpley gradient
            vec3 bottomHSV = vec3( 
                h2f( progress(235.,247.,position.x)),
                progress(0.62,0.75,position.x),
                progress(0.47,0.40,position.x)+noiseBase
            );


            // We set the blue component of the result based on the IsGridLine() function
            bottomHSV.z += gridProjection(position);
            bottomHSV.x += (gridProjection(position)*0.1);




            //convert to RBG and apply out noise
            vec4 bottomColour = vec4(hsv2rgb(bottomHSV), 1.); //bottom bar

            bottomColour.rgb = scanline(position*resolution,bottomColour.rgb);




            //MIX TOP AND MIDDLE COLOURS
            vec4 topCompound = mix(topColour,middleColour,seperationOne);

            ///MIX IN BOTTOM COLOUR
            gl_FragColor = mix(topCompound, bottomColour, seperationTwo);
            

        // gl_FragColor = vec4(0.,position.y,position.x,1.);

        }
 