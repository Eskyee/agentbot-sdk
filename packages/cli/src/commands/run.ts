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

  const content = readFileSync(resolved, 'utf-8');
  const agent = parseAgent(content, resolved);

  console.log('');
  console.log('  🤖 Agent Boot');
  console.log('  ═══════════════════════════════');
  console.log(`  Name:        ${agent.name}`);
  console.log(`  Description: ${agent.description}`);
  console.log(`  Model:       ${agent.model}`);
  console.log(`  Tools:       ${agent.tools.join(', ')}`);
  console.log(`  Permissions: ${formatPermissions(agent.permissions)}`);
  console.log('  ═══════════════════════════════');
  console.log('');

  // Show instruction preview
  if (agent.instruction) {
    const lines = agent.instruction.split('\n').filter(l => l.trim());
    console.log('  📝 Instructions:');
    console.log('  ─────────────────');
    for (const line of lines.slice(0, 8)) {
      console.log(`  ${line}`);
    }
    if (lines.length > 8) {
      console.log(`  ... (+${lines.length - 8} more lines)`);
    }
    console.log('');
  }

  // Validate
  const warnings: string[] = [];
  if (!agent.name) warnings.push('Missing name');
  if (!agent.description) warnings.push('Missing description');
  if (agent.tools.length === 0) warnings.push('No tools defined');
  if (!agent.instruction) warnings.push('No instructions');

  if (warnings.length > 0) {
    console.log('  ⚠️  Warnings:');
    for (const w of warnings) {
      console.log(`    • ${w}`);
    }
    console.log('');
  }

  // Tool permission summary
  if (agent.tools.length > 0) {
    console.log('  🔐 Tool Permissions:');
    for (const tool of agent.tools) {
      const perm = agent.permissions[tool] || 'safe';
      const icon = perm === 'safe' ? '✅' : perm === 'dangerous' ? '⚠️' : '🚫';
      console.log(`    ${icon} ${tool} → ${perm}`);
    }
    console.log('');
  }

  console.log('  ✅ Agent validated successfully.');
  console.log('');
  console.log('  To execute this agent, connect to Agentbot Cloud:');
  console.log('    agentbot deploy');
  console.log('');
  console.log('  Or run locally with an LLM API key:');
  console.log('    OPENROUTER_API_KEY=sk-... agentbot run ' + filePath + ' --live');
  console.log('');
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
