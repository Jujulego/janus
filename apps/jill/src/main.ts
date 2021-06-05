import { Project } from './project';

(async function () {
  const prj = new Project('../../');

  for await (const ws of prj.workspaces()) {
    console.log(ws.name);
  }
})();
