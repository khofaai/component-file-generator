const readline = require('readline');
const selectOptions = require('./select');
var currentDirName = (process.argv[2] ? process.argv[2] : "Its");
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

const config = {
	componentName : '',
	rl,

	startCLI(callback, multipleChoices = {}) {
		this.execQuestions(multipleChoices, callback);
	},

	makeQuestion(question, callback) {
		return new Promise((resolve, reject) => {
			config.rl.question(question, (answer) => {
				callback(answer)
				resolve();
			});
		});
	},

	makeOptionQuestion({question, options}, callback) {
		return new Promise((resolve, reject) => {
			selectOptions.init(rl,{ question, options }, (option) => {
				callback(option);
				resolve(option);
			});
		});
	},

	async runQuestions(callback) {
		await config.makeQuestion(currentDirName + " name ? \n", answer => {
			config.componentName = answer;
		});
		callback(config.componentName);
		config.rl.close();
	},

	async execQuestions(multipleChoices, callback) {
		let cmdNames = 'Generate : ';
		let selectedCommand = '';
		let defaultCommand = [];
		let multipleChoiceStructures = {};
		const _multipleChoicesKeys = Object.keys(multipleChoices);
		const _multipleChoicesLength = _multipleChoicesKeys.length;

		if(_multipleChoicesLength === 1) {
			selectedCommand = _multipleChoicesKeys[0];
			multipleChoiceStructures[selectedCommand] = multipleChoices[selectedCommand];
			defaultCommand.push(selectedCommand);
		} else {
			await _multipleChoicesKeys.map(key => {
				if(cmdNames != '') cmdNames += ', ';
				cmdNames += key;
				defaultCommand.push(key);
				multipleChoiceStructures[key] = multipleChoices[key];
			});

			await config.makeOptionQuestion({
				question: `which modules ?\n`,
				options: defaultCommand
			}, answer => {
				selectedCommand = defaultCommand[answer]
			});
		}

		if(defaultCommand && defaultCommand.includes(selectedCommand)) {
			await config.makeQuestion(`${selectedCommand} name ?\n`, answer => {
				config.componentName = { answer, body: multipleChoiceStructures[selectedCommand] };
			});
			callback(config.componentName);
		} else {
			console.error("\x1b[41m", `generator not found !`, "\x1b[0m");
		}
		config.rl.close();
	}
}

module.exports = config;
