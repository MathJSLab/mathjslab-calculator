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
  } catch (err) {
    console.error(err);
  }
