const fs = require('node:fs');
const path = require('node:path');

console.log('Copying resulting bundle to project root directory...');
fs.copyFileSync(path.resolve(__dirname, '..', 'dist', 'mathjslab-calculator.js'), path.resolve(__dirname, '..', 'mathjslab-calculator.min.js'));
console.log('Copying resulting bundle to project root directory done.');
