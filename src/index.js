const arg = require('arg');
const YAML = require('yaml');

//const input = process.argv.slice(2);

/* Gets a translation item by the cli option name */
// function getTranslation(cliOpt, translations) {
//   return _.find(translations, (item) => {
//     return item['cliOpt'][0] == cliOpt;
//   });
// }

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
  ];

  if(typeof input === 'string')
    input = input.split(' ');

  if(!Array.isArray(input))
    throw 'Input must be an array or a string';

  const argTranslations = {};
  const composeSections = {};
  const yamlArgs = {
    'version': '2',
    'services': { 'app': {}}
  };

  translations.forEach(item => {
    argTranslations[item.cliOpt[0]] = item.argType;
    if(item.cliOpt.length == 2) argTranslations[item.cliOpt[1]] = item.cliOpt[0];
    composeSections[item.cliOpt[0]] = item.composeSection;
  });

  const args = arg(argTranslations, options = {permissive: true, argv: input});

  Object.keys(args).forEach(k => {
    const v = args[k];
    const app = yamlArgs['services']['app'];

    if(composeSections[k]) {
      app[composeSections[k]] = v;
    }

    if(k === '_') {
      app['image'] = v[2]; // The image name is the first positional argument of docker run (so the third of our full args list)
      if(v.length > 3) app['command'] = v.splice(3).join(' '); // The command is all the positional args after the image
    }

  });

  const yamlString = YAML.stringify(yamlArgs);

  return yamlString;
};