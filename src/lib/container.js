const filesystem = require('./filesystem');
const configurator = require('./configurator');
const variable = '[name]';
filesystem.setSource("./src/components");
let structureTarget = '';
let structureOptions = '';

module.exports = {

	checkUpperCase(componentName) {
		let len = componentName.length;
		for(let i=0; i<len; i++) {
			if(/[A-Z]/.test(componentName.charAt(i))) {
				return true;
			}
		}
		return false;
	},

	checkNameFormat(componentName) {
		if (/[A-Z]/.test(componentName)) { // if its all UpperCase ... for some reason .. watch your CapsLock pls
			componentName = componentName.charAt(0) + componentName.slice(1).toLowerCase(); 
			return componentName;
		}
		if (/[A-Z]/.test(componentName.charAt(0))){ // if it starts with an upperCase
			return componentName; // return true
		} else {
			if (this.checkUpperCase(componentName)) { // if it has an upperCase within // TODO
				return componentName; // return true
			} else { // in this case we make the first char an upperCase
				componentName = componentName.charAt(0).toUpperCase() + componentName.slice(1); 
				return componentName;
			}
		}
	},

	checkMultipleNames(componentName) {
		let vessel = componentName.split(' ');
		if (vessel.length === 1) { // componentName is one word
			return componentName; // return true
		} else { // componentName is many words
			let len = vessel.length;
			let temp = '';
			for(let i=0; i<len; i++) { // skip the first word
				temp = `${temp}${vessel[i].charAt(0).toUpperCase()}${vessel[i].slice(1).toLowerCase()}`; // concat the second word with upperCAsing its first Char
			}
			return temp;
		}
	},

	promptQuestions(target) {
		if(typeof target === 'object' && target.length > 0) {
			configurator.startCLI(componentData => {
				this.generateCustomComponent(componentData)
			}, target);
		} else {

			structureTarget = target !== '' ? `/${target}` : '';

			configurator.startCLI(componentName => {
				// check name format (no lowerCase only)
				componentName = this.checkNameFormat(componentName);

				// check for multiple names
				componentName = this.checkMultipleNames(componentName);

				// end check
				this.generateComponent(componentName) 
			});
		}
	},

	generateComponent(componentName) {
		let structure = require(`../config${structureTarget}/structure`);
		let str = JSON.stringify(structure);
		let replaceAll = (search, replacement, target) => {
		    return target.split(search).join(replacement);
		};
		str = JSON.parse(replaceAll(variable, componentName, str));
		
		this.mkStructure(str, () => {
			console.log("\x1b[42m", `${componentName} has been created successfully`, "\x1b[0m");
		});
	},

	generateCustomComponent(componentData) {
		let structure = componentData.body.structure;
		let str = JSON.stringify(structure);
		let replaceAll = (search, replacement, target) => {
		    return target.split(search).join(replacement);
		};
		str = JSON.parse(replaceAll(variable, componentData.answer, str));
		filesystem.setSource(componentData.body.root);	
		this.mkStructure(str, () => {
			console.log("\x1b[42m", `${componentData.answer} has been created successfully`, "\x1b[0m");
		});
	},

	mkStructure(structure, callback) {
		let structureKeys = Object.keys(structure);
		let parentPath = '';
		if(!filesystem.checkDirectoryExistance(structure.name)) {
			structureKeys.map( key => {
				if (key == 'name' && typeof structure[key] === 'string' ) {
					filesystem.makeDirectory(structure[key]);
					parentPath += structure[key];
				} else {
					this.mapStructure(parentPath, structure[key]);
				}
			});
			callback();
		} else {
			console.error("\x1b[41m", `${structure.name} already exist !`, "\x1b[0m");
		}
	},

	mapStructure(parentPath, structure) {
		structure.map( _obj => {
			if (_obj.type == 'directory') {
				filesystem.makeDirectory(parentPath+'/'+_obj.name);
				if (typeof _obj.children !== 'undefined') {
					this.mapStructure(parentPath + '/' + _obj.name, _obj.children);
				}
			} else {
				let _content = typeof _obj.content !== 'undefined' ? _obj.content : '';
				if (typeof _content == 'object') {
					_content = JSON.stringify(_content);
				}
				filesystem.makeFile(parentPath + '/' + _obj.name, _content);
			}
		});
	},
}
