// Create thumbnails
// example: node createThumbs /path/from /path/to 100
var easyimg = require('easyimage');
var path = require('path');
var fs = require('fs')
	, gm = require('gm');



var root = "/Users/florianrudin/Websites/imhof/imhof-node/public/";
//var root = "/home/flaudre/webapps/nodejs/imhof/imhof-node/public/"; 
var original_path = process.argv[2]
var destination_path = process.argv[3];

var _getImagesFromFolder = function(dir){
		
	var image_files = []

	// Scan directory
	fs.readdirSync(dir).forEach(function(file){
		file = path.join(dir, file);
		var stat = fs.statSync(file);
		if(stat && stat.isDirectory()){
			image_files = image_files.concat(_getImagesFromFolder(file));	
		}
		else{
			if(path.extname(file) == '.jpg' || '.png' || '.gif') image_files.push(file);
		}
	});

	return image_files
};

var image_files = _getImagesFromFolder(original_path);

image_files.forEach(function(image){
	// Create thumbnail
	gm(image)
	.resize(process.argv[4], process.argv[4])
	.flatten()
	.setFormat("jpg")
	.write(path.join(destination_path, path.basename(image).slice(0, -path.extname(image).length) + ".jpg"), function(err){
		if(!err) console.log('done')
		else{
			console.log(err);
		}
	});
});
