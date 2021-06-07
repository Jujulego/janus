import { CommandBuilder } from 'yargs';

import { commandWrapper, CommonArgs } from '../helpers';
import { logger } from '../logger';
import { Project } from '../project';
import { walkDevDependencies } from '../tree';

// Types
interface RunArgs extends CommonArgs {
  workspace: string;
  script: string;
}

// Command
export const command = 'run <workspace> <script>';
export const aliases = [];
export const describe = 'Build all workspace\'s dependencies before running script';

export const builder: CommandBuilder = (yargs) => yargs
  .positional('workspace', {
    type: 'string'
  })
  .positional('script', {
    type: 'string'
  });

export const handler = commandWrapper(async (args: RunArgs) => {
  try {
    logger.spin('Loading project ...');
    const prj = new Project('../../');
    const ws = await prj.workspace(args.workspace);
    logger.stop();

    if (!ws) {
      logger.warn(`Workspace ${args.workspace} not found`);
    } else {
      // Build dependencies
      for await (const dep of walkDevDependencies(ws)) {
        logger.spin(`Building ${dep.printName} ...`);
        await dep.build();
      }

      // Build package
      const argv = args._.slice(1)
        .map(arg => arg.toString());

      logger.verbose(`yarn run ${args.script} ${argv.join(' ')}`);
      await ws.run(args.script, ...argv);
    }
  } catch (error) {
    logger.fail(`Failed to build ${args.workspace}`);
    logger.error(error);
    process.exit(1);
  }
});
