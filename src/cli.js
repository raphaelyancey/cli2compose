const cli2compose = require('./index.js');
const input = process.argv.slice(2);
const output = cli2compose(input);
process.stdout.write(output);
process.stdout.write('\n');
process.exit(0);