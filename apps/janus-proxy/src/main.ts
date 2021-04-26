import { hideBin } from 'yargs/helpers';
import yargs from 'yargs';

// Commands
(async function() {
  try {
    await yargs(hideBin(process.argv))
      .scriptName('janus')
      .usage('Usage: $0 [command] [options]')
      .commandDir('commands')
      .help()
      .parse();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
