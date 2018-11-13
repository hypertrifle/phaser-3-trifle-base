# Phaser 3 Webpack Project Template

Based off of [Richard Davey's Phaser 3 Webpack Project Template](https://github.com/photonstorm/phaser3-project-template)

Originally planed & written by [Rich Searle](//hypertrifle.com) for Work, since then I have removed any unnicery code that I deemed bloated on not useful for small game projects (any any made for Work specifications.)

All this work is my own, (with help from the Phaser commuity and is currently UNLCICENCED)

## getting started
its the same as every other javascript project -> why not `npm i` ?

TYPESCRIPT!! - any where I can use typescript I can, I know some don't like it.. props find another repo honestly.

webpack 4 bad boy, check the `npm run` scripts initially, as lots of auto tools for my method of working, it defaults a load of both svg and png atla generation, svg alows us to scale UP but with less support, examples will be in here somewhere....

# I love GLSL
I thinkthere is an example in here already, I'm not sure of, actually... I better go check what that is..
there will be eventially *more* shaders here, I've a few post-effects in the pipline and will be sure to include in this boilerplate.

# PLUGINS

plugins.global.Tools is my utility belt (main plugin), I'm almost certain I'm not doing this with the right design pattern in mind but it works for me :),  everything else is wonderful Phaser and Typescript.

# DATA

Data sytem loads 2 models from settings.jsonc and content.jsonc, they are loaded through Javascript, IE load your models, in the DataUtils and error check then, non-object primitives will be fine. - if things need to be instanciated you will need to do this. Apart that settings take priority, and content would be for localisations / translations. 

*NOTE! overriting doesn't recursive a whole data model onth the top level elements.*

### GLHF NERDS
