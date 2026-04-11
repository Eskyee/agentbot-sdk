import { writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const STARTER_AGENT = `---
name: my-agent
description: A helpful AI agent
model: openrouter/anthropic/claude-3.5-sonnet
tools: [bash, read, write, think, memory]
permissions:
  bash: dangerous
  read: safe
  write: dangerous
  think: safe
  memory: safe
---

# My Agent

You are a helpful AI assistant. You can read and write files, run commands, and think through problems.

## Capabilities
- Read and write files
- Run shell commands
- Search codebases
- Remember context across sessions

## Guidelines
- Always verify before making changes
- Write tests for new code
- Be concise and direct
`;

export async function initCommand(args: string[]) {
  const targetDir = args[0] || '.';
  const filePath = join(targetDir, 'agent.md');

  if (existsSync(filePath)) {
    console.log('  ⚠️  agent.md already exists. Skipping.');
    console.log('  Delete it first if you want to reinitialize.');
    return;
  }

  writeFileSync(filePath, STARTER_AGENT);
  console.log('  ✅ Created agent.md');
  console.log('');
  console.log('  Next steps:');
  console.log('    1. Edit agent.md to customize your agent');
  console.log('    2. Run: agentbot run agent.md');
  console.log('    3. Deploy: agentbot deploy');
}
