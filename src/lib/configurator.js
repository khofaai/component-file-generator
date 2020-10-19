const readline = require('readline');
const selectOptions = require('./select');
var currentDirName = (process.argv[2] ? process.argv[2] : "Its");
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

const config = {
	componentName : '',
	rl,

	startCLI(callback, multipleChoices = {}) {
		if((Array.isArray(multipleChoices) && multipleChoices.length > 0) || Object.keys(multipleChoices).length > 0 ) {
			this.runMultipleChoiceQuestion(multipleChoices, callback);
		} else {
			this.runQuestions(callback);
		}
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

	async runMultipleChoiceQuestion(multipleChoices, callback) {
		let cmdNames = 'Generate : ';
		let selectedCommand = '';
		let defaultCommand = [];
		let multipleChoiceStructures = {};

		if(multipleChoices.length === 1) {
			selectedCommand = Object.keys(multipleChoices[0])[0];
			if(typeof multipleChoices[0][selectedCommand] !== 'object') {
				multipleChoiceStructures[selectedCommand] = multipleChoices[0];
			} else {
				multipleChoiceStructures[selectedCommand] = multipleChoices[0][selectedCommand];
			}
			defaultCommand.push(selectedCommand);
		} else {
			await multipleChoices.map(choice => {
				if(cmdNames != '') cmdNames += ', ';
				let key = Object.keys(choice)[0];
				cmdNames += key;
				defaultCommand.push(key);
				multipleChoiceStructures[key] = choice[key];
			});

			await config.makeOptionQuestion({
				question: `which modules ?\n`,
				options: defaultCommand
			}, answer => {
				selectedCommand = defaultCommand[answer]
			});
		}

		if(defaultCommand && defaultCommand.includes(selectedCommand)) {
			await config.makeQuestion(`${defaultCommand.length === 1 ? 'Its' : selectedCommand} name ?\n`, answer => {
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
