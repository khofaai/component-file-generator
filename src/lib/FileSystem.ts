import fs from 'fs';
import path from 'path';
import config from './config';

class FileSystem {
  source: string = '';
  targetSource: string = '';

  constructor() {
    this.source = path.resolve(__dirname, '../..');
  }

  pathExist(_path: string) {
    return fs.existsSync(_path)
  }

  pathError(_path: string) {
    const message = `${_path} already exist !`;
    let spaces = '';
    for (let i = 0; i < message.length; i++) {
      spaces +=  ' ';
    }
    console.error("\x1b[41m", `  ${spaces}  `, "\x1b[0m");
    console.error("\x1b[41m", `  ${_path} already exist !  `, "\x1b[0m");
    console.error("\x1b[41m", `  ${spaces}  `, "\x1b[0m\n");
    config.rl.close();
  }

  srcPath(path: string) {
		// add components check here
		if (!this.pathExist(path)) {
			fs.mkdirSync(path);
		} else {
      this.pathError(path)
    }
		return this.source != '' ? `${this.source}/${path}` : path;
	}

	async makeDirectory(dirPath: string) {
		if (!fs.existsSync(dirPath)){
      await fs.mkdirSync(dirPath);
		} else {
      console.log('43');
      this.pathError(dirPath);
    }
	}

	makeFile(filePath: string, content: string = '') {
		if (!this.pathExist(filePath)) {
      fs.appendFile(filePath, content, (err: any) => {
		  	if (err) {
          console.error("\x1b[41m", { FilesystemAppend: err }, "\x1b[0m");
          config.rl.close();
        }
      });
    } else {
      this.pathError(filePath)
    }
	}

	checkDirectoryExistance(dirPath: string) {
		dirPath = this.srcPath(dirPath);
		return fs.existsSync(dirPath);
	}

  touchStructure(data: any) {
    this.targetSource = path.resolve(this.source, `${data.body.root}/${data.answer}`);
    if (this.pathExist(this.targetSource)) {
      console.log('66');
      this.pathError(this.targetSource)
    } else {
      this.makeDirectory(this.targetSource)
          .then(() => {
            data.body.structure.children.map((child: any) => {
              if (child.type === 'file') {
                this.makeFile(`${this.targetSource}/${child.name}.js`, child.content);
              } else {
                this.makeDirectory(`${this.targetSource}/${child.name}`)
              }
            })
            return data;
          })
          .then((data: any) => {
			      console.log("\x1b[42m", `${data.answer} has been created successfully`, "\x1b[0m");
          });
    }
  }
}

export default new FileSystem();
