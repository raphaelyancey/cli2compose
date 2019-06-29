const arg = require('arg');
const YAML = require('yaml');
const split = require('split-string');

//const input = process.argv.slice(2);

/* Gets a translation item by the cli option name */
function getTranslation(cliOpt, translations) {
  ret = null;
  translations.forEach((item) => {
    if(item['cliOpt'][0] == cliOpt) ret = item;
  });
  return ret;
}

/* Clean stuff from the input string */
function cleanInput(input) {
  input = input.replace(/\\\n(?:\t|\s*)/g, ''); // Multiline bash commands
  return input;
}

/* Clean stuff from the args array */
function cleanArgs(input) {

  // Quotes
  for(var i=0; i<input.length-1; i++) {
    input[i] = input[i].replace(/["']/g, '');
  }

  return input;
}

module.exports = (input) => {

  const translations = [
    {
      cliOpt: ['--volume', '-v'],
      composeSection: 'volumes',
      argType: [String]
    },
    {
      cliOpt: ['--env', '-e'],
      composeSection: 'environment',
      argType: [String]
    },
    {
      cliOpt: ['--publish', '-p'],
      composeSection: 'ports',
      argType: [String]
    },
    {
      cliOpt: ['--expose'],
      composeSection: 'expose',
      argType: [String]
    },
    {
      cliOpt: ['--name'],
      composeSection: 'container_name',
      argType: String
    },
    {
      cliOpt: ['--restart'],
      composeSection: 'restart',
      argType: String
    },
    {
      cliOpt: ['--network', '--net'],
      composeSection: 'networks',
      argType: [String]
    },
    {
      cliOpt: ['--detach', '-d'],
      composeSection: null,
      argType: Boolean
    },
    {
      cliOpt: ['--interactive', '-i'],
      composeSection: null,
      argType: Boolean
    },
    {
      cliOpt: ['--tty', '-t'],
      composeSection: null,
      argType: Boolean
    },
    {
      cliOpt: ['--link'],
      composeSection: 'links',
      argType: [String]
    },
  ];

  if(typeof input === 'string') {
    input = cleanInput(input); // Applied to the inline command
    input = split(input, {
      separator: " ",
      quotes: ["'", '"'],
    });
    input = cleanArgs(input); // Applied to each args
  }

  if(!Array.isArray(input))
    throw 'Input must be an array or a string';

  const argTranslations = {};
  const composeSections = {};
  const yamlArgs = {
    'version': '2',
    'services': { 'app': {}}
  };

  translations.forEach(item => {
    // Formats the configuration expected by arg
    argTranslations[item.cliOpt[0]] = item.argType;
    // Creates the alias if present
    if(item.cliOpt.length == 2) argTranslations[item.cliOpt[1]] = item.cliOpt[0];
    // Creates the option to section name relation
    if(item.composeSection !== null)
      composeSections[item.cliOpt[0]] = item.composeSection;
  });

  const args = arg(argTranslations, options = {permissive: true, argv: input});

  Object.keys(args).forEach(cliOpt => {
    let v = args[cliOpt];
    const app = yamlArgs['services']['app'];

    if(composeSections[cliOpt]) {
      const t = getTranslation(cliOpt, translations);
      if('mapFn' in t) v = v.map(t.mapFn);
      app[composeSections[cliOpt]] = v;
    }

    if(cliOpt === '_') {
      app['image'] = v[2]; // The image name is the first positional argument of docker run (so the third of our full args list)
      if(v.length > 3) app['command'] = v.splice(3).join(' '); // The command is all the positional args after the image
    }

  });

  const yamlString = YAML.stringify(yamlArgs);

  return yamlString;
};