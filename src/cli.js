const app = require('./lib/container');
module.exports = {
	run() {
		app.promptQuestions();
	},
};
