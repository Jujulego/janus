import { CommandBuilder } from 'yargs';

import { commandWrapper, CommonArgs } from '../helpers';
import { logger } from '../logger';
import { Project } from '../project';
import { walkDevDependencies } from '../tree';

// Types
interface BuildArgs extends CommonArgs {
  workspace: string;
}

// Command
export const command = 'build <workspace>';
export const aliases = [];
export const describe = 'Build all workspace\'s dependencies';

export const builder: CommandBuilder = (yargs) => yargs
  .positional('workspace', {
    type: 'string'
  });

export const handler = commandWrapper(async (args: BuildArgs) => {
  try {
    logger.spin('Loading project ...');
    const prj = new Project('../../');
    const ws = await prj.workspace(args.workspace);
    logger.stop();

    if (!ws) {
      logger.warn(`Workspace ${args.workspace} not found`);
    } else {
      // Build dev dependencies
      for await (const dep of walkDevDependencies(ws)) {
        logger.spin(`Building ${dep.printName} ...`);
        await dep.build();
      }

      // Build package
      logger.spin(`Building ${ws.printName} ...`);
      await ws.build();
    }
  } catch (error) {
    logger.fail(`Failed to build ${args.workspace}`);
    logger.error(error);
    process.exit(1);
  }
});
