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
const generator = require('generator');
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
        │    └── package.json
        ├
```

to Execut it from root project using CLI :
```bash
node generator
```
it will prompt a question :
```bash
component name ?
_
```
it will generate the target component with minimal content.

# Instance

| Name | description |
|----|----|
|reactjs|DONE|
|angular|NOT YET|
|Vuejs|NOT YET|
|expressjs|NOT YET|

