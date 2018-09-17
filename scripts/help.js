
const pkg = require('../package.json');


const descriptions = {
    help: "\t\t - lists this help",
    build: "\t\t - run a production build",
    dev: "\t\t - load up development enviroment and watch for changes",
    upgrade: "\t\t - upgrade libraries like phaser to the latest",
    "export-assets": "\t - export the assest to artboards for design",
    "new-asset": "\t - build a new placeholder asset",
    "generate-atlas": "\t - Re generate the main game Atlas with default settings",
   "generate-schema": "\t - Re generate the json Schema files for src/models/"
};


for(let i in pkg.scripts ){
   script  = pkg.scripts[i];
   let des = descriptions[i] || "";
   console.log("npm run "+ i + des);
}

// console.log(pkg);