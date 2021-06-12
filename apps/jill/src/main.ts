import { hideBin } from 'yargs/helpers';
import yargs from 'yargs';

import { LOG_LEVELS } from './logger';

// Commands
(async function () {
  try {
    await yargs(hideBin(process.argv))
      .scriptName('jill')
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
      .command(require('./commands/run'))  // eslint-disable-line @typescript-eslint/no-var-requires
      .command(require('./commands/deps')) // eslint-disable-line @typescript-eslint/no-var-requires
      .demandCommand(1)
      .help()
      .parserConfiguration({
        'populate--': true
      })
      .parse();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
