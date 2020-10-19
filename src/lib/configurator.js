const readline = require('readline');
const currentDirName = ((process.argv[2]) ? process.argv[2] : "Its");
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

const config = {
	componentName : '',
	rl,

	startCLI(callback, multipleChoices = {}) {
		if(Object.keys(multipleChoices).length > 0 ) {
			this.runMultipleChoiceQuestion(multipleChoices, callback);
		} else {
			this.runQuestions(callback);
		}
	},

	makeQuestion (question, callback) {
  		return new Promise((resolve, reject) => {
	    	config.rl.question(question, (answer) => {
		    	callback(answer)
		      	resolve();
	    	});
	  	});
	},

	runQuestions: async (callback) => {
  		await config.makeQuestion(currentDirName + " name ? \n", answer => {
  			config.componentName = answer;
  		});
  		callback(config.componentName);
  		config.rl.close();
	},

	runMultipleChoiceQuestion: async (multipleChoices, callback) => {

		let cmdNames = 'Generate : ';
		let selectedCommand = '';
		let defaultCommand = [];
		let multipleChoiceStructures = {};

		await multipleChoices.map(choice => {
			if(cmdNames != '') cmdNames += ', ';
			let key = Object.keys(choice)[0];
			cmdNames += key;
			defaultCommand.push(key);
			multipleChoiceStructures[key] = choice[key];
		});

		if(multipleChoices.length === 1) {
			selectedCommand = Object.keys(multipleChoices[0])[0]
		} else {
			await config.makeQuestion(`${cmdNames} ?\n`, answer => {
				selectedCommand = answer
			})
		}

		if(defaultCommand,defaultCommand.includes(selectedCommand)) {
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
