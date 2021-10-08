import express from 'express';

import { JanusGate } from '@jujulego/janus-gate';

// Config
const PORTS: Record<string, number> = {
  local1: 3001,
  local2: 3002,
  local3: 3003,
};

const GATE = process.argv[2] || 'local1';
const PORT = PORTS[process.argv[2] || 'local1'];

// Basic express api
const app = express();

app.get('/api-sample/janus-example', (req, res) => {
  res.send({
    message: `${GATE} works !`
  });
});

app.listen(PORT, async () => {
  console.log(`Express API listening at port ${PORT}`);
  console.log(`Try: http://localhost:${PORT}/api-sample/janus-example`);

  // Janus Gate
  const gate = await JanusGate.fromConfigFile('sample-api', GATE, '../../janus.config.yml');
  await gate.enable();

  console.log('Janus Gate enabled !');
  console.log(`Try: http://localhost:${gate.config.proxy.port}/api-sample/janus-example`);
});

