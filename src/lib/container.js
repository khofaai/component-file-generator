const filesystem = require('./filesystem');
const configurator = require('./configurator');
const variable = '[name]';
filesystem.setSource("./src/components");
let structureTarget = '';
let structureOptions = '';

module.exports = {


	CaptalizeFirstLetter(componentName) {
		let str = '';
		if (componentName === componentName.toLowerCase()) {
			str = componentName.charAt(0).toUpperCase() + componentName.slice(1);
		}
		else if (componentName === componentName.toUpperCase()) {
			str = componentName.charAt(0) + componentName.slice(1).toLowerCase();
		}
		else if (componentName.charAt(0) === componentName.charAt(0).toUpperCase()) {
			str = componentName.charAt(0) + componentName.slice(1);
		}
		else {
			str = componentName.charAt(0).toUpperCase() + componentName.slice(1);
		}
		str = this.EliminateSpaces(str);
		return str;
	},

	EliminateSpaces(componentName) {
		let sliced = componentName.split(' ');
		if (sliced.length == 1) {
			return componentName;
		}
		else {
			let str = '';
			let len = sliced.length;
			for (let i = 0; i < len; i++) {
				str = str + sliced[i].charAt(0).toUpperCase() + sliced[i].slice(1).toLowerCase();
			}
			return str;
		}

	},
	promptQuestions(target) {
		if (typeof target === 'object' && target.length > 0) {
			configurator.startCLI(componentData => {
				this.generateCustomComponent(componentData)
			}, target);
		} else {

			structureTarget = target !== '' ? `/${target}` : '';
			configurator.startCLI(componentName => {
				componentName = this.CaptalizeFirstLetter(componentName);
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
		if (!filesystem.checkDirectoryExistance(structure.name)) {
			structureKeys.map(key => {
				if (key == 'name' && typeof structure[key] === 'string') {
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
		structure.map(_obj => {
			if (_obj.type == 'directory') {
				filesystem.makeDirectory(parentPath + '/' + _obj.name);
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
