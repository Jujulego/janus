import { JanusGate } from './src';

(async () => {
  try {
    const gate = new JanusGate('lucifer-api', 'local');
    await gate.enable();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
