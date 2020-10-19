let cli = require('./src/cli');

module.exports = {
	exec(target = '', options = {}) {
		cli.run(target, options);
	}
}
