#!/usr/bin/env node

import { initCommand } from './commands/init.js';
import { runCommand } from './commands/run.js';
import { devCommand } from './commands/dev.js';

const args = process.argv.slice(2);
const command = args[0];

const VERSION = '0.1.0';

const HELP = `
  agentbot v${VERSION} — Docker for AI workers

  USAGE
    agentbot <command> [options]

  COMMANDS
    init [dir]          Create a new agent project
    dev [dir]           Watch agent files for changes
    run <agent.md>      Validate and display agent definition
    --version           Show version
    --help              Show this help message

  EXAMPLES
    agentbot init                    Create starter agent.md
    agentbot dev                     Watch current directory
    agentbot run my-agent.md         Validate an agent definition

  DOCS
    https://github.com/Eskyee/agentbot-sdk

  AGENTBOT CLOUD
    https://agentbot.sh
`;

async function main() {
  if (!command || command === '--help' || command === '-h') {
    console.log(HELP);
    process.exit(0);
  }

  if (command === '--version' || command === '-v') {
    console.log(`agentbot v${VERSION}`);
    process.exit(0);
  }

  switch (command) {
    case 'init':
      await initCommand(args.slice(1));
      break;

    case 'run':
      await runCommand(args.slice(1));
      break;

    case 'dev':
      await devCommand(args.slice(1));
      break;

    case 'test':
      console.log('  🧪 agentbot test — coming in v0.2.0');
      console.log('  Run agent validation: agentbot run <agent.md>');
      break;

    case 'bundle':
      console.log('  📦 agentbot bundle — coming in v0.2.0');
      console.log('  Package agent for deployment');
      break;

    case 'deploy':
      console.log('  🚀 agentbot deploy — coming in v0.2.0');
      console.log('  Deploy to Agentbot Cloud: https://agentbot.sh');
      break;

    default:
      console.log(`  ❌ Unknown command: ${command}`);
      console.log(HELP);
      process.exit(1);
  }
}

main().catch((err) => {
  console.error('  ❌ Error:', err.message);
  process.exit(1);
});
