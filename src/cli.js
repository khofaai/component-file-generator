const app = require('./lib/container');
module.exports = {
	run(target = '') {
		app.promptQuestions(target);
	},
};
