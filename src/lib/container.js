const filesystem = require('./filesystem');
const configurator = require('./configurator');
filesystem.setSource("./src/components");
let structureTarget = '';

module.exports = {

	promptQuestions(target) {
		structureTarget = target !== '' ? `/${target}` : '';
		configurator.startCLI(componentName => {
			this.generateComponent(componentName) 
		});
	},

	generateComponent(componentName) {
		let structure = require(`../config${structureTarget}/structure`);
		let str = JSON.stringify(structure);
		let replaceAll = (search, replacement, target) => {
		    return target.split(search).join(replacement);
		};
		str = JSON.parse(replaceAll('[name]', componentName, str));
		this.mkStructure(str);
	},

	mkStructure(structure) {
		let structureKeys = Object.keys(structure);
		let parentPath = '';
		structureKeys.map( key => {
			if (key == 'name' && typeof structure[key] === 'string' ) {
				filesystem.makeDirectory(structure[key]);
				parentPath += structure[key];
			} else {
				this.mapStructure(parentPath,structure[key]);
			}
		});
	},

	mapStructure(parentPath, structure) {
		structure.map( _obj => {
			if (_obj.type == 'directory') {
				filesystem.makeDirectory(parentPath+'/'+_obj.name);
				if (typeof _obj.children !== 'undefined') {
					this.mapStructure(parentPath+'/'+_obj.name, _obj.children);
				}
			} else {
				let _content = typeof _obj.content !== 'undefined' ? _obj.content : '';
				if (typeof _content == 'object') {
					_content = JSON.stringify(_content);
				}
				filesystem.makeFile(parentPath+'/'+_obj.name, _content);
			}
		});
	},
}