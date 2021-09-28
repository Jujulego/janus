import { hideBin } from 'yargs/helpers';
import yargs from 'yargs';

import { gqlSchemaCommand } from './commands/gql-schema';
import { commandHandler } from './wrapper';

// Bootstrap
(async () => {
  // Options
  await yargs(hideBin(process.argv))
    .scriptName('janus')
    .option('verbose', {
      alias: 'v',
      type: 'count',
      description: 'Set verbosity level (1 for verbose, 2 for debug)',
    })
    .command('gql-schema', 'Prints the control server GraphQL schema', {}, commandHandler(gqlSchemaCommand))
    .demandCommand(1)
    .help()
    .parse();
})();