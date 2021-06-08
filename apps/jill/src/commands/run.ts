import { CommandBuilder } from 'yargs';

import { commandWrapper, CommonArgs } from '../helpers';
import { logger } from '../logger';
import { Project } from '../project';
import { extractors, walk } from '../tree';

// Types
interface RunArgs extends CommonArgs {
  workspace: string;
  script: string;
  args: string[];
}

// Command
export const command = 'run <script> [args..]';
export const aliases = [];
export const describe = 'Build all workspace\'s dependencies before running script';

export const builder: CommandBuilder = {
  script: {
    description: 'Script or command to run'
  },
  workspace: {
    alias: 'w'
  }
};

export const handler = commandWrapper(async (args: RunArgs) => {
  try {
    logger.spin('Loading project ...');
    const prj = new Project('../../');
    const ws = await prj.workspace(args.workspace);
    logger.stop();

    if (!ws) {
      logger.warn(`Workspace ${args.workspace || 'for current directory'} not found`);
    } else {
      if (process.env.JILL_STARTED_SCRIPT) {
        logger.warn('Script with jill started by jill !');
        logger.warn(`Consider removing jill from script or define a script with name jill:${process.env.JILL_STARTED_SCRIPT}.`);
        logger.warn('Dependencies will not be build, as they should be build by parent jill process.');
      } else {
        // Build dependencies
        for await (const dep of walk(ws, extractors.devDependencies)) {
          logger.spin(`Building ${dep.printName} ...`);
          await dep.build();
        }
      }

      // Run script
      await ws.run(args.script, ...args.args);
    }
  } catch (error) {
    logger.fail(`Failed to build ${args.workspace}`);
    logger.error(error);
    process.exit(1);
  }
});
