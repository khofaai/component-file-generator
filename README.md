# File Generator

this package helps me and our team to generate complex components structues by ease

# Installation

you can install it using npm :
```bash
npm i component-file-generator
```

# Setup

you need to install `node` on your machine to use this package,

also create a simple file in your app root :
```
└── projectName
    └── src
    └── generator.js
```

with the following code : 
```javascript
const generator = require('component-file-generator');
generator.exec('reactjs');
```

for the above example we make `reactjs` component as follwing :

```
└── src
    ├── components
        ├── [ComponentNameA]
        │    ├── __snapshots__
        │    │     ├── [ComponentNameA].spec.js.snap
        │    ├── [ComponentNameA].spec.js
        │    ├── [ComponentNameA].js
        │    ├── [ComponentNameA].scss
        │    ├── README.md
            └── package.json
```

to Execut it from root project using CLI :

```bash
node generator
```
it will prompt a question :
```bash
Its name ?
_
```
it will generate the target component with minimal content in the ./src/component directory as its default directory.

for a more customizable execution:

```bash
node generator [dir name]
```
it will prompt a question :
```bash
[dir name] name ?
_
```
it will generate the target component with minimal content in the ./src/[dir name] directory.

Ex:
```bash
node generator services
```
it will prompt a question :
```bash
services name ?
_
```
if you type in **`LoginService`**, the resulting component will be named **`LoginService`** inside the `/src/services` directory.


# Hints

You may use spaces and type at ease for this generator does have syntax corrections.

Ex:
```bash
node generator
```
it will prompt a question :
```bash
Its name ?
_
```
if you type in **`next step is part two`**, the resulting component will be named **`NextStepIsPartTwo`**.

# Instance

|  Name       |   description |
|  ----       |   ----        |
|  reactjs    |   DONE        |
|  angular    |   NOT YET     |
|  Vuejs      |   NOT YET     |
|  expressjs  |   NOT YET     |

# Custom Structure

For now you can add multiple custom component types, you pass `array` with each element as an object with : 

- `root` folder where to generate structure
- `structure` that containe your component file architecture

```javascript
generator.exec([
  {
    'service': {
      root:'./app/services',
      structure: {
        name: "[name]",
        children:[
          {
            type: "file",
            name: "readme.md",
            content: "# [name] Service\n description"
          },
          {
            type: "file",
            name: "[name]Service.js",
            content: `import Service from '../Service';\n\nexport default class [name] {\n\t// instruction\n\t}\n}\n`
          },
          {
            type: "file",
            name: "package.json",
            content: "{\n\t\"main\": \"./[name]Service.js\"\n}"
          }
        ]
      }
    }
  },
  ...
]);
```
