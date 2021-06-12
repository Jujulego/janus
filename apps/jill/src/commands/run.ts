import { CommandBuilder } from 'yargs';

import { commandWrapper, CommonArgs } from '../helpers';
import { logger } from '../logger';
import { Project } from '../project';
import { extractors, walk } from '../tree';
import { Workspace } from '../workspace';

// Types
interface RunArgs extends CommonArgs {
  script: string;
  all?: boolean;
  workspace?: string | string[];
}

// Command
export const command = 'run <script>';
export const aliases = [];
export const describe = 'Build all workspace\'s dependencies before running script';

export const builder: CommandBuilder = {
  script: {
    description: 'Script or command to run'
  },
  all: {
    type: 'boolean',
    conflicts: 'workspace',
  },
  workspace: {
    alias: 'w',
    conflicts: 'all',
  }
};

export const handler = commandWrapper(async (args: RunArgs) => {
  try {
    logger.spin('Loading project ...');
    const prj = new Project('../../');

    // Load workspaces
    const workspaces: Workspace[] = [];

    if (args.all) {
      for await (const ws of prj.workspaces()) {
        workspaces.push(ws);
      }
    } else if (!args.workspace) {
      const ws = await prj.workspace();

      if (ws) {
        workspaces.push(ws);
      } else {
        logger.warn('Workspace for current directory not found');
      }
    } else {
      if (!Array.isArray(args.workspace)) {
        args.workspace = [args.workspace];
      }

      for (const name of args.workspace) {
        const ws = await prj.workspace(name);

        if (ws) {
          workspaces.push(ws);
        } else {
          logger.warn(`Workspace ${name} not found`);
        }
      }
    }
    logger.stop();

    if (process.env.JILL_STARTED_SCRIPT) {
      logger.warn('Script with jill started by jill !');
      logger.warn(`Consider removing jill from script or define a script with name jill:${process.env.JILL_STARTED_SCRIPT}.`);
      logger.warn('Dependencies will not be build, as they should be build by parent jill process.');
    } else {
      // Build dependencies
      for await (const dep of walk(workspaces, extractors.devDependencies)) {
        logger.spin(`Building ${dep.printName} ...`);
        await dep.build();
      }
    }

    // Run script
    for (const ws of workspaces) {
      await ws.run(args.script, ...args['--'] || []);
    }
  } catch (error) {
    logger.fail(`Failed to build ${args.workspace}`);
    logger.error(error);
    process.exit(1);
  }
});
