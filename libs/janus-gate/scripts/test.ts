import { JanusGate } from '@jujulego/janus-gate';

(async () => {
  try {
    const gate = await JanusGate.fromConfigFile('lucifer-api', 'local', 'janus.config.yml', { autoStart: true });
    await gate.enable();

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
