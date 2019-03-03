const fs = require('fs');

module.exports = {
	
	source: '',

	setSource(src) {
		this.source = src;
	},

	srcPath(path) {
		return this.source != '' ? `${this.source}/${path}` : path;
	},

	makeDirectory(dirPath, callback) {
		dirPath = this.srcPath(dirPath);
		if (!fs.existsSync(dirPath)){
		    fs.mkdirSync(dirPath);
		    if (typeof callback == 'function') {
		    	callback();
		    }
		}
	},
	
	makeFile(filePath, content = '', callback) {
		filePath = this.srcPath(filePath);
		fs.appendFile(filePath, content, function (err) {
		  	if (err) throw err;
		  	if (typeof callback == 'function') {
	    		callback();
	    	}
		});
	}
}
