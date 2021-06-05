import { Project } from './project';

import { logger } from './logger';

logger.setOptions({ verbosity: 'debug' });

(async function () {
  logger.spin('Loading project ...');
  const prj = new Project('../../');

  const ws = await prj.workspace('@jujulego/janus-proxy');
  if (ws) {
    logger.info(`${ws.printName} depends on:`);

    for await (const dep of ws.dependencies()) {
      logger.info(`- ${dep.printName}`);
    }

    for await (const dep of ws.devDependencies()) {
      logger.info(`- ${dep.printName}`);
    }
  }

  logger.succeed('Project loaded');
})();
