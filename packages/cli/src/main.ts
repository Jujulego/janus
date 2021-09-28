import { hideBin } from 'yargs/helpers';
import yargs from 'yargs';

import { gqlSchemaCommand } from './commands/gql-schema';
import { startCommand } from './commands/start';
import { commandHandler } from './wrapper';

// Bootstrap
(async () => {
  // Options
  await yargs(hideBin(process.argv))
    .scriptName('janus')
    .option('config', {
      alias: 'c',
      description: 'Path to the configuration file',
      default: 'janus.config.yml',
    })
    .option('verbose', {
      alias: 'v',
      type: 'count',
      description: 'Set verbosity level (1 for verbose, 2 for debug)',
    })
    .command('gql-schema', 'Prints the control server GraphQL schema', {}, commandHandler(gqlSchemaCommand))
    .command(['start', '$0'], 'Starts the proxy server', {}, commandHandler(startCommand))
    .demandCommand(1)
    .help()
    .parse();
})();