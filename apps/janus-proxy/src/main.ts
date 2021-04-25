import { hideBin } from 'yargs/helpers';
import yargs from 'yargs';

// Commands
(async function() {
  try {
    yargs(hideBin(process.argv))
      .commandDir('commands')
      .help()
      .parse();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
