import { Project } from './project';

import { logger } from './logger';

logger.setOptions({ verbosity: 'debug' });

(async function () {
  logger.spin('Loading project ...');
  const prj = new Project('../../');

  logger.info('Available workspaces:');
  for await (const ws of prj.workspaces()) {
    logger.info(`- ${ws.printName}`);
  }

  logger.succeed('Project loaded');
})();
