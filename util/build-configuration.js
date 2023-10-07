const fs = require('node:fs');
const path = require('node:path');

console.log('Setting build configuration...');
const package = JSON.parse(fs.readFileSync(path.resolve(__dirname, '..', 'package.json')).toString());
const debug = Boolean(process.env.DEBUG ?? false);
const buildConfiguration = {
    buildMessage: `MathJSLab Calculator v${package.version} built at ${new Date().toUTCString()}.${debug ? ` Debug flag enable.` : ``} Homepage: ${package.homepage}`,
    debug,
}
fs.writeFileSync(path.resolve(__dirname, '..', 'src', 'build-configuration.json'), JSON.stringify(buildConfiguration, null, 2));
console.log('Setting build configuration done.');
