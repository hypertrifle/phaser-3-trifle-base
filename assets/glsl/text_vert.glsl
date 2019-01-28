#define SHADER_NAME PHASER_TEXTURE_TINT_VS

precision mediump float;

uniform mat4 uProjectionMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uModelMatrix;

attribute vec2 inPosition;
attribute vec2 inTexCoord;


varying vec2 outTexCoord;
varying vec2 outPosition;


void main () 
{

    outTexCoord = inTexCoord;
    outPosition = inPosition;

    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(inPosition, 1.0, 1.0);
}
