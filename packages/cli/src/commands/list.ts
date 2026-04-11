import { readFileSync, readdirSync, existsSync } from 'fs';
import { resolve } from 'path';

export async function listCommand(args: string[]) {
  const targetDir = args[0] || '.';
  const resolved = resolve(targetDir);

  console.log('');
  console.log('  📋 Agentbot Agents');
  console.log('  ──────────────────');

  const agents = findAgents(resolved);

  if (agents.length === 0) {
    console.log('  No agents found.');
    console.log('  Run `agentbot init` to create one.');
    console.log('');
    return;
  }

  console.log(`  Found ${agents.length} agent(s) in ${resolved}`);
  console.log('');

  for (const agent of agents) {
    const permSummary = Object.entries(agent.permissions)
      .map(([k, v]) => {
        const icon = v === 'safe' ? '✅' : v === 'dangerous' ? '⚠️' : '🚫';
        return `${icon}${k}`;
      })
      .join(' ');

    console.log(`  ${agent.name}`);
    console.log(`    ${agent.description}`);
    console.log(`    model: ${agent.model}`);
    console.log(`    tools: ${agent.tools.join(', ')}`);
    if (permSummary) console.log(`    ${permSummary}`);
    console.log('');
  }
}

interface AgentInfo {
  name: string;
  description: string;
  model: string;
  tools: string[];
  permissions: Record<string, string>;
  path: string;
}

function findAgents(dir: string): AgentInfo[] {
  if (!existsSync(dir)) return [];
  const agents: AgentInfo[] = [];

  try {
    const entries = readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = resolve(dir, entry.name);
      if (entry.isFile() && entry.name.endsWith('.md')) {
        try {
          const content = readFileSync(fullPath, 'utf-8');
          if (content.startsWith('---')) {
            const match = content.match(/^---\n([\s\S]*?)\n---/);
            if (match) {
              const fm = match[1];
              const name = fm.match(/^name:\s*(.+)$/m)?.[1]?.trim();
              if (name) {
                agents.push({
                  name,
                  description: fm.match(/^description:\s*(.+)$/m)?.[1]?.trim() || '',
                  model: fm.match(/^model:\s*(.+)$/m)?.[1]?.trim() || '',
                  tools: fm.match(/^tools:\s*\[(.+)\]/m)?.[1]?.split(',').map(t => t.trim()) || [],
                  permissions: parsePermissions(fm),
                  path: fullPath,
                });
              }
            }
          }
        } catch { /* skip */ }
      } else if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
        agents.push(...findAgents(fullPath));
      }
    }
  } catch { /* skip */ }

  return agents;
}

function parsePermissions(fm: string): Record<string, string> {
  const perms: Record<string, string> = {};
  const lines = fm.split('\n');
  let inPerms = false;

  for (const line of lines) {
    if (line.startsWith('permissions:')) {
      inPerms = true;
      continue;
    }
    if (inPerms) {
      const m = line.match(/^\s+(\w+):\s*(\w+)/);
      if (m) {
        perms[m[1]] = m[2];
      } else if (line.trim() && !line.match(/^\s/)) {
        inPerms = false;
      }
    }
  }

  return perms;
}
