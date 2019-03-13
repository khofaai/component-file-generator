let cli = require('./src/cli');

module.exports = {
    exec(target = '') {
        cli.run(target);
    }
}