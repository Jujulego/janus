import { hideBin } from 'yargs/helpers';
import yargs from 'yargs';

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
      .command(require('./commands/start'))
      .command(require('./commands/stop'))
      .command(require('./commands/gql-schema'))
      .help()
      .parse();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
