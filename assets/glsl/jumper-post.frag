   precision highp float;

   uniform sampler2D uMainSampler;
   uniform sampler2D uPostTexture;
   uniform float time;
   uniform vec2 resolution;
   uniform vec3 backStitchColour;
   uniform float zoomLevel;

   varying vec2 outTexCoord;


   vec4 getPixelColour( in vec2 uv){
      
    return texture2D(uMainSampler, uv);
}



    void main(void)
        {
            //colour of this pixel
            vec4 pixel = texture2D(uMainSampler, outTexCoord*zoomLevel);

            //pixel above as this encrouces into the stitch
            float perPixel = (1. / resolution.y);
            vec4 pixelAbove = texture2D(uMainSampler, vec2( outTexCoord.x, outTexCoord.y + perPixel) *zoomLevel);

            float yPosInCell = mod(outTexCoord.y*resolution.y, 1.);

            vec2 cellCoords = mod(outTexCoord*resolution,1.);


            //the shifts the top section one pixel. 
            // vec4 finalStitch = mix(pixelAbove,pixel,step(yPosInCell,0.3));

            //now we want to reclaim our top corners.

            float inThisStitch = step(1.15,1.-cellCoords.y+cellCoords.x) *step(1.16,1.-cellCoords.y+(1.-cellCoords.x));
            vec4 finalStitch = mix(pixelAbove,pixel,inThisStitch);

            // pixelAbove.r = (yPosInCell);

            //wrape our post texture's UV
            vec2 wrap = outTexCoord*resolution/2.;

            //get our shade value from that
            vec4 shade = texture2D(uPostTexture, wrap);

            // mix the colours!
            gl_FragColor = mix(finalStitch,vec4(backStitchColour,1.),1.-shade.r);
        }
