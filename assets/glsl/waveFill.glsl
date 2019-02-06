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
            

            float hoirizonWobble1 = (sin(outTexCoord.x*2. + time*1.)*0.01); //TODO: smoothstep
            float hoirizonWobble2 = (sin(outTexCoord.x*3. + time*2.)*0.03); //TODO: smoothstep

        

            float noise = max(0.,noisegen(outTexCoord*resolution)*1.);

<<<<<<< HEAD
            vec4 col1 = vec4(outTexCoord.y,0.,outTexCoord.x, noise) * 0.9;
            vec4 col2 = vec4(outTexCoord.y,0.,outTexCoord.x,noise) ;
            vec4 col3 = vec4(outTexCoord.y,0.,outTexCoord.x,noise)*0.6;
=======
            vec4 col1 = vec4(outTexCoord.y,0.,1.-outTexCoord.x, noise); //middle / main area
            vec4 col2 = vec4(outTexCoord.y,0.,outTexCoord.x,noise); //bottom bar
            vec4 col3 = vec4(outTexCoord.x,0.,outTexCoord.x,noise); //top section
>>>>>>> 958eafe680d7168cd124ae7653535d43a9661e8b


            gl_FragColor = mix(col3, mix( col1, col2, sign(outTexCoord.y-(0.9+hoirizonWobble1))),sign(outTexCoord.y-(0.41+hoirizonWobble2)) );


        }
 