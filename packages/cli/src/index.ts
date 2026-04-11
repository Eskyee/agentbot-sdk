#!/usr/bin/env node

import { initCommand } from './commands/init.js';
import { runCommand } from './commands/run.js';
import { devCommand } from './commands/dev.js';
import { testCommand } from './commands/test.js';
import { bundleCommand } from './commands/bundle.js';
import { deployCommand } from './commands/deploy.js';

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
      await testCommand(args.slice(1));
      break;

    case 'bundle':
      await bundleCommand(args.slice(1));
      break;

    case 'deploy':
      await deployCommand(args.slice(1));
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
