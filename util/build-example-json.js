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
    let first = true;
    for (let name in example) {
        fs.copyFileSync(path.resolve(__dirname, '..', 'example', example[name].file), path.resolve(__dirname, '..', 'dist', 'example', example[name].file));
        if (first) {
            const firstExample = {
                name,
                description: example[name].description,
                content: fs.readFileSync(path.resolve(__dirname, '..', 'example', example[name].file)).toString(),
            };
            fs.writeFileSync(path.resolve(__dirname, '..', 'src', 'first-example.json'), JSON.stringify(firstExample, null, 2));
            first = false;
        }
    }
}
catch (err) {
    console.error(err);
}
console.log('Copying examples to /dist directory done.')
