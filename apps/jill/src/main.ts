import { Project } from './project';

import { logger } from './logger';

logger.setOptions({ verbosity: 'debug' });

(async function () {
  const prj = new Project('../../');
  const ws = await prj.workspace('@jujulego/janus-front');

  if (ws) {
    for await (const dep of ws.dependencies()) {
      logger.spin(`Building ${dep.printName} ...`);
      await dep.run('build');
      logger.succeed(`${dep.printName} built !`);
    }

    for await (const dep of ws.devDependencies()) {
      logger.spin(`Building ${dep.printName} ...`);
      await dep.run('build');
      logger.succeed(`${dep.printName} built !`);
    }

    logger.spin(`Building ${ws.printName} ...`);
    await ws.run('build');
    logger.succeed(`${ws.printName} built !`);
  }
})();
