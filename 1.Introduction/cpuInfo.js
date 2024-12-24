const { log } = require("console");
const os = require("os");

// Get an array of objects containing information about each logical CPU core
const cpus = os.cpus();
const architecture = os.arch();
const type = os.type();
const name = os.hostname();

log(`Architecture: ${architecture}`);
log(`Type: ${type}`);
log(`Hostname: ${name}`);

// Display information for each CPU core
cpus.forEach((cpu, index) => {
  log(`CPU ${index + 1}:`);
  log(`  Model: ${cpu.model}`);
  log(`  Speed: ${cpu.speed} MHz`);
  log(`  Times:`);
  log(`    User: ${cpu.times.user}`);
  log(`    Nice: ${cpu.times.nice}`);
  log(`    Sys: ${cpu.times.sys}`);
  log(`    Idle: ${cpu.times.idle}`);
  log(`    IRQ: ${cpu.times.irq}`);
  log();
});
