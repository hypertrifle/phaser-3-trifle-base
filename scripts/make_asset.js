/*creates a simple png with given width, height, name and colour, name will be included in the image */
var readlineSync = require('readline-sync');
var http = require('http');
var fs = require('fs');

//ask for deets
let name = readlineSync.question('name? ');
let width = readlineSync.question('width? ');
let height = readlineSync.question('height? ');
let color = readlineSync.question('colour? ');

//band that file down
let string = width+"x"+ height+ "?"
var file = fs.createWriteStream("assets/img/"+name+".png");
var request = http.get("http://via.placeholder.com/"+width+"x"+height+".png/"+color+"?text="+encodeURIComponent(name)+"", function(response) {
  response.pipe(file);
});

console.log("done");