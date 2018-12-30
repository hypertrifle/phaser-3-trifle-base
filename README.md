# NU-heat outrun style racing game

there are a few components that mainly are visual images / sprites that can be pooled, but must happens in the Drive2.ts Scene.

Unfortunatly no time to refactor out the big scene into somthing more manageable, but It all should be documented, if you have an outline viewer in you IDE itworks fine.

## setup
`npm i` a package-lock is included from last successful release
in the package.json file the dev command currently reads:

`webpack-dev-server --mode development --open-page webpack-dev-server/build/ --host 192.168.178.22 --config webpack.config.js`

you can omit the `--host 192.168.178.22` entirely to work on local host, but if you are testing on networked devices you will need to supply your hostname `ipconfig` will give you this.


## useage
this is all run through webpack 4, see webpack config file for configutation, there are a few npm / node scripts that are useful:

`npm run dev` - build | watch | serve | and open a source-mapped / development version of the game.
`npm run build` - create a production package for the game at ./build (currently doesn't clean the folder on build)

`npm run generate-atlas` - generate an atlas of the imge src files, these files are also commited but texturepacker licence will be require to re-generate.

the phaser3 typescript definitions that are used at time of build will be commited, but to upgrade to the atest stable phaser and update TSDEF files you can run `npm run upgrade`

## layout
Typescript / Javscript source is in src, server files that are not included in an `npm run dev` are located in the server folder, other templates, such as index and manifest are in the supporting folder.

## notes

tsconfig and tslint files incuded, but may not include my system defaults, so pinch of salt.

## contact

Rich Searle
ricardo.searle@gmail.com
