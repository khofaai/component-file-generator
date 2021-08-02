import FileSystem from './FileSystem';

declare module Generator {
  interface GeneratorInterface {
  }
}

type structureObject = {
  answer: any,
  body: any
}

class Generator {
  async create(data: structureObject, args: Array<any>) {
    const _data = await this.generateStructure(data, args)
    FileSystem.touchStructure(_data);
  }

  checkOptions(options: any, args: any) {
    return args.filter((arg: any) => !!options[arg]);
  }

  generateStructure(data: structureObject, args: Array<any>): Promise<object> {
    return new Promise((resolve, reject)=> {
      try {
        const options = this.checkOptions(data.body.options, args)
        let _data = { ...data };
        if (options.length > 0) {
          options.forEach(async (option: any) => {
            _data.body = await data.body.options[option](_data.body)
          });
        }
        resolve(_data)
      } catch (e) {
        reject(e)
      }
    })
  }
}

export default new Generator();
