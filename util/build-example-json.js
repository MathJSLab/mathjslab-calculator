const fs = require('node:fs');
const path = require('node:path');

console.log('Building example.json...')

const example = JSON.parse(fs.readFileSync(path.resolve(__dirname, '..', 'example', 'example.json')));

for (let name in example) {
    example[name].content = fs.readFileSync(path.resolve(__dirname, '..', 'example', example[name].file)).toString();
    delete example[name]['file'];
}

fs.writeFileSync(path.resolve(__dirname, '..', 'src', 'example.json'), JSON.stringify(example, null, 2));

console.log('Building example.json done.')
