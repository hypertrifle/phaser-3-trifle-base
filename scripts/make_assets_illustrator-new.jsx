#target illustrator
$.writeln ("start");

function addArtboard(w,h, doc, delta) {

    var artboards = doc.artboards;
     artboards.add([delta, w, h ,0]);

}

function debug(value){
$.writeln("properties for: "+ value);
for(var prop in value){
        $.writeln(prop + " : " +value[prop]);
        }
}

var delta = 0;

var doc = app.documents.add(null,1,1)
doc = app.activeDocument;

with (doc) {
pageOrigin = [0,0];
rulerOrigin = [0,0];
}

    var fileFolder = new Folder((new File($.fileName)).parent.path + "/assets/img")

    
    for(var prop in fileFolder){
        $.writeln(prop + " : " +fileFolder[prop]);
        }
    
    var fileList = fileFolder.getFiles(/\.(jpg|tif|psd|bmp|gif|png|)$/i);



        for (var i = 0; i < fileList.length; i++) {
            
             app.open(fileList[i]);
            debug(app.activeDocument.activeLayer);
                
        }