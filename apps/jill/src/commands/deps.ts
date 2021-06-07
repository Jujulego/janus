import { CommandBuilder } from 'yargs';
import chalk from 'chalk';

import { commandWrapper, CommonArgs } from '../helpers';
import { logger } from '../logger';
import { Project } from '../project';
import { walkDependencies, walkDevDependencies } from '../tree';

// Types
interface DepsArgs extends CommonArgs {
  dev: boolean;
  workspace: string;
}

// Command
export const command = 'deps <workspace>';
export const aliases = [];
export const describe = 'Print all workspace\'s dependencies';

export const builder: CommandBuilder = (yargs) => yargs
  .positional('workspace', {
    type: 'string'
  })
  .option('dev', {
    type: 'boolean',
    default: false
  });

export const handler = commandWrapper(async (args: DepsArgs) => {
  try {
    logger.spin('Loading project ...');
    const prj = new Project('../../');
    const ws = await prj.workspace(args.workspace);
    logger.stop();

    if (!ws) {
      logger.warn(`Workspace ${args.workspace} not found`);
    } else {
      logger.info(`Dependencies of ${ws.printName}:`);
      const deps = args.dev ? walkDevDependencies(ws) : walkDependencies(ws);

      for await (const dep of deps) {
        logger.info(`- ${dep.printName}`);
      }
    }
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
});
