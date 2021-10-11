import { hideBin } from 'yargs/helpers';
import yargs from 'yargs';

import { gqlSchemaCommand } from './commands/gql-schema';
import { logsCommand } from './commands/logs';
import { startCommand } from './commands/start';
import { stopCommand } from './commands/stop';
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
    .command(['start', '$0'], 'Starts the proxy server', {
      daemon: {
        alias: 'd',
        boolean: true,
        default: false,
      }
    }, commandHandler(startCommand))
    .command('stop', 'Stops remote proxy server', {}, commandHandler(stopCommand))
    .command('logs', 'Print remote proxy logs', {
      follow: {
        alias: 'f',
        boolean: true,
        default: false,
      }
    }, commandHandler(logsCommand))
    .command('gql-schema', 'Prints the control server GraphQL schema', {}, commandHandler(gqlSchemaCommand))
    .demandCommand(1)
    .help()
    .parse();
})();