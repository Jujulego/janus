import { hideBin } from 'yargs/helpers';
import yargs from 'yargs';

import { LOG_LEVELS } from './logger';

// Commands
(async function () {
  try {
    await yargs(hideBin(process.argv))
      .scriptName('janus')
      .usage('Usage: $0 [command] [options]')
      .option('config', {
        alias: 'c',
        description: 'Path to the configuration file',
        default: 'janus.config.yml',
      })
      .option('verbosity', {
        conflicts: 'v',
        choices: LOG_LEVELS,
        description: 'Set verbosity level'
      })
      .option('verbose', {
        alias: 'v',
        boolean: true,
        conflicts: 'verbosity',
        description: 'Set verbosity level to "verbose"',
      })
      .command(require('./commands/start'))      // eslint-disable-line @typescript-eslint/no-var-requires
      .command(require('./commands/logs'))       // eslint-disable-line @typescript-eslint/no-var-requires
      .command(require('./commands/stop'))       // eslint-disable-line @typescript-eslint/no-var-requires
      .command(require('./commands/gql-schema')) // eslint-disable-line @typescript-eslint/no-var-requires
      .help()
      .parse();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
