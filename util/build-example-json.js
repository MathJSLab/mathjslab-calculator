const fs = require('node:fs');
const path = require('node:path');

console.log('Copying examples to /dist directory...')
try {
    let directory = path.resolve(__dirname, '..', 'dist');
    if (fs.existsSync(directory)) {
        fs.rmSync(directory, { recursive: true });
        fs.mkdirSync(directory);
    }
    else {
        fs.mkdirSync(directory);
    }
    directory = path.resolve(__dirname, '..', 'dist', 'example');
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory);
    }
    fs.copyFileSync(path.resolve(__dirname, '..', 'example', 'example.json'), path.resolve(__dirname, '..', 'dist', 'example', 'example.json'));
    const example = JSON.parse(fs.readFileSync(path.resolve(__dirname, '..', 'example', 'example.json')));
    for (let name in example) {
        fs.copyFileSync(path.resolve(__dirname, '..', 'example', example[name].file), path.resolve(__dirname, '..', 'dist', 'example', example[name].file));
    }
}
catch (err) {
    console.error(err);
}
console.log('Copying examples to /dist directory done.')
