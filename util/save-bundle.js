const fs = require('node:fs');
const path = require('node:path');

console.log('Copying resulting bundle to project root directory...');
fs.copyFileSync(path.resolve(__dirname, '..', 'dist', 'bundle.js'), path.resolve(__dirname, '..', 'mathjslab-calc.min.js'));
console.log('Copying resulting bundle to project root directory done.');
