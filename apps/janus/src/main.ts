import { hideBin } from 'yargs/helpers';
import yargs from 'yargs';

// Commands
(async function() {
  try {
    await yargs(hideBin(process.argv))
      .scriptName('janus')
      .usage('Usage: $0 [command] [options]')
      .command(require('./commands/start'))
      .command(require('./commands/gql-schema'))
      .help()
      .parse();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
