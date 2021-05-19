import express from 'express';

import { JanusGate } from '@jujulego/janus-gate';

// Constants
const PORT = 3001;

// Basic express api
const app = express();

app.get('/api-sample/janus-example', (req, res) => {
  res.send({
    message: 'It works!'
  });
});

app.listen(PORT, async () => {
  console.log(`Express API listening at port ${PORT}`);
  console.log(`Try: http://localhost:${PORT}/api-sample/janus-example`);

  // Janus Gate
  const gate = await JanusGate.fromConfigFile('sample-api', 'local', '../../janus.config.yml');
  await gate.enable();

  console.log('Janus Gate enabled !');
  console.log(`Try: http://localhost:${gate.config.proxy.port}/api-sample/janus-example`);
});

