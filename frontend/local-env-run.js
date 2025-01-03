const { spawn } = require('child_process');

require('./local-env-setup.js');

const expo = spawn('npx', ['expo', 'start'], { stdio: 'inherit', shell: true });

// When we receive SIGINT (Ctrl+C), kill expo
process.on('SIGINT', () => {
  expo.kill('SIGINT');
});

// When expo process closes, run the cleanup
expo.on('exit', () => {
  require('./local-env-reset.js');
  process.exit();
});
