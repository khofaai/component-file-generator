const fs = require('fs');

module.exports = {
	
	source: '',

	setSource(src) {
		this.source = src;
	},

	srcPath(path) {
		// add components check here
		if (!fs.existsSync(this.source)) {
			fs.mkdirSync(this.source);
		}
		return this.source != '' ? `${this.source}/${path}` : path;
	},

	makeDirectory(dirPath, callback) {
		dirPath = this.srcPath(dirPath);
		if (!fs.existsSync(dirPath)){
		    fs.mkdirSync(dirPath);
		    typeof callback == 'function' && callback();
		}
	},
	
	makeFile(filePath, content = '', callback) {
		filePath = this.srcPath(filePath);
		fs.appendFile(filePath, content, function (err) {
		  	if (err) throw err;
		  	typeof callback == 'function' && callback();
		});
	},

	checkDirectoryExistance(dirPath) {
		dirPath = this.srcPath(dirPath);
		return fs.existsSync(dirPath);
	}
}
