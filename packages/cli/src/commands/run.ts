import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

export async function runCommand(args: string[]) {
  const filePath = args[0];

  if (!filePath) {
    console.log('  ❌ Usage: agentbot run <agent.md>');
    process.exit(1);
  }

  const resolved = resolve(filePath);

  if (!existsSync(resolved)) {
    console.log(`  ❌ File not found: ${resolved}`);
    process.exit(1);
  }

  // Parse the agent definition (inline parser for CLI — no SDK dependency at runtime)
  const content = readFileSync(resolved, 'utf-8');
  const agent = parseAgent(content, resolved);

  console.log('');
  console.log('  🤖 Agent Definition');
  console.log('  ─────────────────────');
  console.log(`  Name:        ${agent.name}`);
  console.log(`  Description: ${agent.description}`);
  console.log(`  Model:       ${agent.model}`);
  console.log(`  Tools:       ${agent.tools.join(', ')}`);
  console.log(`  Permissions: ${formatPermissions(agent.permissions)}`);
  console.log(`  Source:      ${resolved}`);
  console.log('');

  if (agent.instruction) {
    console.log('  📝 Instructions:');
    console.log('  ─────────────────');
    // Print first 5 lines of instruction
    const lines = agent.instruction.split('\n').slice(0, 5);
    for (const line of lines) {
      console.log(`  ${line}`);
    }
    if (agent.instruction.split('\n').length > 5) {
      console.log('  ...');
    }
    console.log('');
  }

  console.log('  ✅ Agent parsed successfully.');
  console.log('  (Full execution coming in v0.2.0)');
}

function parseAgent(content: string, source: string) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);

  if (!match) {
    return {
      name: source.split('/').pop()?.replace(/\.md$/, '') || 'agent',
      description: '',
      model: 'openrouter/anthropic/claude-3.5-sonnet',
      tools: [] as string[],
      permissions: {} as Record<string, string>,
      instruction: content.trim(),
    };
  }

  const frontmatter = parseSimpleYaml(match[1]);

  return {
    name: frontmatter.name || 'agent',
    description: frontmatter.description || '',
    model: frontmatter.model || 'openrouter/anthropic/claude-3.5-sonnet',
    tools: parseArray(frontmatter.tools),
    permissions: parseObject(frontmatter.permissions),
    instruction: match[2].trim(),
  };
}

function parseSimpleYaml(yaml: string): Record<string, any> {
  const result: Record<string, any> = {};
  let currentKey: string | null = null;
  let currentObject: Record<string, string> = {};

  for (const line of yaml.split('\n')) {
    const kvMatch = line.match(/^(\w+):\s*(.+)$/);
    if (kvMatch) {
      // Flush previous object
      if (currentKey && Object.keys(currentObject).length > 0) {
        result[currentKey] = { ...currentObject };
        currentObject = {};
      }

      currentKey = kvMatch[1];
      const value = kvMatch[2].trim();

      if (value.startsWith('[') && value.endsWith(']')) {
        result[currentKey] = value;
        currentKey = null;
      } else if (!value.startsWith('#')) {
        result[currentKey] = value.replace(/^["']|["']$/g, '');
        currentKey = null;
      }
    } else if (line.match(/^\s+/) && currentKey) {
      const subMatch = line.trim().match(/^(\w+):\s*(.+)$/);
      if (subMatch) {
        currentObject[subMatch[1]] = subMatch[2].trim().replace(/^["']|["']$/g, '');
      }
    }
  }

  if (currentKey && Object.keys(currentObject).length > 0) {
    result[currentKey] = { ...currentObject };
  }

  return result;
}

function parseArray(value: string): string[] {
  if (!value) return [];
  if (value.startsWith('[') && value.endsWith(']')) {
    return value.slice(1, -1).split(',').map((s) => s.trim());
  }
  return [value];
}

function parseObject(value: any): Record<string, string> {
  if (!value || typeof value !== 'object') return {};
  return value;
}

function formatPermissions(perms: Record<string, string>): string {
  return Object.entries(perms)
    .map(([k, v]) => `${k}=${v}`)
    .join(', ') || 'none';
}
