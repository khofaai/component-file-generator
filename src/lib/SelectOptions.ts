import readline from 'readline';
import config from './config';


type ObjType = {
  [key: string]: any
}

const input = process.stdin;
const output = process.stdout;

declare module SelectOptions {}

class SelectOptions {
	selectIndex: number = 0;
	options: Array<string|number> = ['mango', 'banana', 'apple', 'orange'];
	selector: string = '*';
	isFirstTimeShowMenu: boolean = true;

	init(options: Array<string|number>): Promise<number> {
		this.options = options;
		readline.emitKeypressEvents(input)
		this.start();
		return new Promise(resolve => {
			config.rl.on('line', () => resolve(this.selectIndex));
		})
	}

	start() {
		//setup the input for reading
		input.setRawMode(true)
		input.resume()
		input.on('keypress', (_props: any, key: any) => this.keyPressedHandler(_props, key))

		if (this.selectIndex >= 0) {
			this.createOptionMenu()
		}
	}

	close() {
		input.setRawMode(false)
		input.pause()
		process.exit(0)
	}

	getPadding(num = 10) {
		let text = ' '
		for (let i = 0; i < num; i++) {
			text += ' '
		}
		return text
	}

	createOptionMenu() {
		const optionLength = this.options.length
		if (this.isFirstTimeShowMenu) {
			this.isFirstTimeShowMenu = false
		} else {
			output.write(this.ansiEraseLines(optionLength))
		}
		const padding = this.getPadding(0)

		for (let i = 0; i < optionLength; i++) {
			let text = `> ${this.options[i]}`;
			var selectedOption = i === this.selectIndex ? this.ansiColors(text, 'magenta') : text;
			let ending = i !== optionLength - 1 ? '\n' : ''
			output.write(padding + selectedOption + ending)
		}
	}

	keyPressedHandler(_props: any, key: any) {
		if (key) {
			const optionLength = this.options.length - 1
			if (key.name === 'down' && this.selectIndex < optionLength) {
				this.selectIndex += 1
				this.createOptionMenu()
			}
			else if (key.name === 'up' && this.selectIndex > 0) {
				this.selectIndex -= 1
				this.createOptionMenu()
			}
			else if (key.name === 'escape' || (key.name === 'c' && key.ctrl)) {
				this.close()
			}
		}
	}

	ansiEraseLines(count: number) {
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

	ansiColors(str: string, colorName: string = 'yellow') {
		const colors: ObjType = {
			yellow: [33, 89],
			blue: [34, 89],
			green: [32, 89],
			cyan: [35, 89],
			red: [31, 89],
			magenta: [36, 89]
		}
		const color = colors[colorName]
		const start = "\x1b[" + color[0] + "m"
		const stop = "\x1b[" + color[1] + "m\x1b[0m"
		return start + str + stop
	}
}

export default new SelectOptions();
