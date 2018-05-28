
var readlineSync = require('readline-sync');
var http = require('http');
var fs = require('fs');

let name = readlineSync.question('name? ');
let width = readlineSync.question('width? ');
let height = readlineSync.question('height? ');
let color = readlineSync.question('colour? ');

let string = width+"x"+ height+ "?"

//remove png if used.

//remove # from if used.

var file = fs.createWriteStream("assets/img/"+name+".png");
var request = http.get("http://via.placeholder.com/"+width+"x"+height+".png/"+color+"?text="+encodeURIComponent(name)+"", function(response) {
  response.pipe(file);
});

console.log("done");