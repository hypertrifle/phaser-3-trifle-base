/*
 updates the latest typescript definitions for Phaser 3
 should be used in conjunction with npm run update, whuch will update phaser aswell.

*/


var https = require('https');
var fs = require('fs');

var file = fs.createWriteStream("phaser.d.ts", { flags: 'w' });
https.get("https://raw.githubusercontent.com/photonstorm/phaser3-docs/master/typescript/phaser.d.ts", function (response) {
    response.pipe(file);
});

console.log("updated Typescript definitions.");