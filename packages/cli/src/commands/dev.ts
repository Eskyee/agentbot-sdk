import { readFileSync, existsSync, readdirSync, watchFile } from 'fs';
import { resolve, extname } from 'path';

export async function devCommand(args: string[]) {
  const targetDir = args[0] || '.';
  const resolved = resolve(targetDir);

  console.log('');
  console.log('  ⚙️  Agentbot Dev Server');
  console.log('  ──────────────────────');
  console.log(`  Watching: ${resolved}`);
  console.log('');

  // Scan for agent files
  const agents = findAgentFiles(resolved);

  if (agents.length === 0) {
    console.log('  ⚠️  No agent.md files found.');
    console.log('  Run `agentbot init` to create one.');
    console.log('');
  } else {
    console.log(`  Found ${agents.length} agent(s):`);
    for (const agent of agents) {
      const parsed = parseAgentQuick(agent);
      console.log(`  • ${parsed.name} — ${parsed.description}`);
    }
    console.log('');
  }

  console.log('  Watching for changes... (Ctrl+C to stop)');
  console.log('');

  // Watch for changes
  for (const agentPath of agents) {
    watchFile(agentPath, { interval: 1000 }, () => {
      const parsed = parseAgentQuick(agentPath);
      console.log(`  🔄 ${parsed.name} updated — ${parsed.description}`);
    });
  }

  // Keep process alive
  process.stdin.resume();
}

function findAgentFiles(dir: string): string[] {
  if (!existsSync(dir)) return [];

  const files: string[] = [];

  try {
    const entries = readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = resolve(dir, entry.name);
      if (entry.isFile() && entry.name.endsWith('.md')) {
        const content = readFileSync(fullPath, 'utf-8');
        if (content.startsWith('---')) {
          files.push(fullPath);
        }
      } else if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
        files.push(...findAgentFiles(fullPath));
      }
    }
  } catch {
    // Skip unreadable directories
  }

  return files;
}

function parseAgentQuick(filePath: string): { name: string; description: string } {
  try {
    const content = readFileSync(filePath, 'utf-8');
    const match = content.match(/^---\n([\s\S]*?)\n---/);
    if (!match) return { name: filePath.split('/').pop() || 'unknown', description: '' };

    const nameMatch = match[1].match(/^name:\s*(.+)$/m);
    const descMatch = match[1].match(/^description:\s*(.+)$/m);

    return {
      name: nameMatch?.[1]?.trim() || filePath.split('/').pop() || 'unknown',
      description: descMatch?.[1]?.trim() || '',
    };
  } catch {
    return { name: 'unknown', description: '' };
  }
}
