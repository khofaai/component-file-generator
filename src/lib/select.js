const readline = require('readline')
const input = process.stdin
const output = process.stdout
const selectOption = {}

selectOption.selectIndex = 0
selectOption.options = ['mango', 'banana', 'apple', 'orange']
selectOption.selector = '*'
selectOption.isFirstTimeShowMenu = true

const keyPressedHandler = (_, key) => {
	if (key) {
		const optionLength = selectOption.options.length - 1
		if (key.name === 'down' && selectOption.selectIndex < optionLength) {
			selectOption.selectIndex += 1
			selectOption.createOptionMenu()
		}
		else if (key.name === 'up' && selectOption.selectIndex > 0) {
			selectOption.selectIndex -= 1
			selectOption.createOptionMenu()
		}
		else if (key.name === 'escape' || (key.name === 'c' && key.ctrl)) {
			selectOption.close()
		}
	}
}

const ansiEraseLines = (count) => {
	//adapted from sindresorhus ansi-escape module
	const ESC = '\u001B['
	const eraseLine = ESC + '2K';
	const cursorUp = (count = 1) => ESC + count + 'A'
	const cursorLeft = ESC + 'G'

	let clear = '';

	for (let i = 0; i < count; i++) {
		clear += eraseLine + (i < count - 1 ? cursorUp() : '');
	}

	if (count) {
		clear += cursorLeft;
	}

	return clear;

}

const ansiColors = (str, colorName = 'yellow') => {
	const colors = {
		"yellow": [33, 89],
		"blue": [34, 89],
		"green": [32, 89],
		"cyan": [35, 89],
		"red": [31, 89],
		"magenta": [36, 89]
	}
	const _color = colors[colorName]
	const start = "\x1b[" + _color[0] + "m"
	const stop = "\x1b[" + _color[1] + "m\x1b[0m"
	return start + str + stop
}

selectOption.init = (rl, { question, options }, callback) => {
	console.log(question);
	selectOption.options = options;
	readline.emitKeypressEvents(input)
	selectOption.start();
	rl.on('line', () => callback(selectOption.selectIndex));
}

selectOption.start = () => {
	//setup the input for reading
	input.setRawMode(true)
	input.resume()
	input.on('keypress', keyPressedHandler)

	if (selectOption.selectIndex >= 0) {
		selectOption.createOptionMenu()
	}
}

selectOption.close = () => {
	input.setRawMode(false)
	input.pause()
	process.exit(0)
}

selectOption.getPadding = (num = 10) => {
	let text = ' '
	for (let i = 0; i < num.length; i++) {
		text += ' '
	}
	return text
}

selectOption.createOptionMenu = () => {
	const optionLength = selectOption.options.length
	if (selectOption.isFirstTimeShowMenu) {
		selectOption.isFirstTimeShowMenu = false
	}
	else {
		output.write(ansiEraseLines(optionLength))
	}
	const padding = selectOption.getPadding(20)

	for (let i = 0; i < optionLength; i++) {
		let text = `> ${selectOption.options[i]}`;
		var selectedOption = i === selectOption.selectIndex ? ansiColors(text, 'magenta') : text;
		let ending = i !== optionLength - 1 ? '\n' : ''
		output.write(padding + selectedOption + ending)
	}
}

module.exports = selectOption;
