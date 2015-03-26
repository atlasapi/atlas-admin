var forever = require('forever-monitor');

var node = new(forever.Monitor)('app.js', {
  // 32 bit int max
  max: 2147483647,
  minUptime: 1000,
  spinSleepTime: 10000,
  killTree: true
});

node.on('exit', function () {
  console.log('API server died after 5 restarts');
});

node.start();
