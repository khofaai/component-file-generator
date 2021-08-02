import config from './config';
import SelectOptions from './SelectOptions';
import Generator from './Generator';

type ObjType = {
  [key: string]: any
}

class CLI {
  displayMessage: string = "Generate : ";
  choices: ObjType;
  choicesKey: Array<any>;
  selectedStructure: Object = {};
  arguments: Array<any> = [];

  constructor(choices: ObjType) {
    this.choices = { ...choices };
    this.choicesKey = Object.keys(this.choices);
    this.arguments = process.argv.slice(2);

    this.start()
        .then((data: any) => {
          Generator.create(data, this.arguments);
          config.rl.close();
        });
  }

  promptOptions(options: Array<number>): Promise<number> {
    return new Promise((resolve) => {
      SelectOptions.init(options).then((option: number) => resolve(option));
    });
  }

  prompt(message: string) {
    return new Promise((resolve) => {
			config.rl.question(message, (answer, ...props) => {
				resolve(answer)
			});
		});
  }

  async start(): Promise<String|Object> {
		let command: string = '';
		const commandOptions: any = [];
		const structure: any = {};

		if(!this.hasMultipleChoices()) {
			command = this.choicesKey[0];
			structure[command] = this.choices[command];
			commandOptions.push(command);
		} else {
			await this.choicesKey.map(choice => {
				if(this.displayMessage != '') this.displayMessage += ', ';
				this.displayMessage += choice;
				commandOptions.push(choice);
				structure[choice] = this.choices[choice];
			});

			const index: number = await this.promptOptions(commandOptions);
      command = commandOptions[index];
		}

		if(commandOptions && commandOptions.includes(command)) {
			const answer = await this.prompt(`${command} name ?\n`);
			return { answer, body: structure[command] };
		} else {
			console.error("\x1b[41m", `${command} generator not found !`, "\x1b[0m");
		}
		config.rl.close();
    return '';
  }

  hasMultipleChoices(): Boolean {
    return Object.keys(this.choices).length > 1;
  }
}

export default CLI;
