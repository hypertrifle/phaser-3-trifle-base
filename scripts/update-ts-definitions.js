https://github.com/user/repository/raw/branch/filename

var https = require('https');
var fs = require('fs');

var file = fs.createWriteStream("phaser.d.ts", { flags: 'w' });
https.get("https://raw.githubusercontent.com/photonstorm/phaser3-docs/master/typescript/phaser.d.ts", function (response) {
    response.pipe(file);
});

console.log("updated Typescript definitions.");