const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

const config = {
	componentName : '',
	rl,
	
	startCLI(callback) {
		this.runQuestions(callback);
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
  		await config.makeQuestion("component name ? \n", answer => {
  			config.componentName = answer;
  		});
  		callback(config.componentName);
  		config.rl.close();
	}
}


module.exports = config;