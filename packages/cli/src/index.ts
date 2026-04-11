#!/usr/bin/env node

import { initCommand } from './commands/init.js';
import { runCommand } from './commands/run.js';

const args = process.argv.slice(2);
const command = args[0];

const HELP = `
  agentbot — Build, run, and deploy AI agents

  USAGE
    agentbot <command> [options]

  COMMANDS
    init              Create a new agent project
    dev               Start agent dev server
    run <agent.md>    Run an agent definition file
    test              Run agent tests
    bundle            Bundle agent for deployment
    deploy            Deploy to Agentbot Cloud
    --help            Show this help message

  EXAMPLES
    agentbot init                    Create starter agent.md
    agentbot run my-agent.md         Parse and run an agent
    agentbot deploy                  Deploy to Agentbot Cloud

  DOCS
    https://github.com/Eskyee/agentbot-sdk
`;

async function main() {
  if (!command || command === '--help' || command === '-h') {
    console.log(HELP);
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
      console.log('  ⚙️  Starting agent dev server...');
      console.log('  (dev server coming in v0.2.0)');
      break;

    case 'test':
      console.log('  🧪 Running agent tests...');
      console.log('(test runner coming in v0.2.0)');
      break;

    case 'bundle':
      console.log('  📦 Bundling agent for deployment...');
      console.log('  (bundler coming in v0.2.0)');
      break;

    case 'deploy':
      console.log('  🚀 Deploying to Agentbot Cloud...');
      console.log('  (deploy coming in v0.2.0)');
      console.log('');
      console.log('  For now, visit https://agentbot.sh to deploy manually.');
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
