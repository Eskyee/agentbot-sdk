import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, statSync } from 'fs';
import { resolve, join, basename } from 'path';

interface BundleManifest {
  name: string;
  version: string;
  description: string;
  model: string;
  tools: string[];
  files: string[];
  createdAt: string;
  agentbot: string;
}

export async function bundleCommand(args: string[]) {
  const targetDir = args[0] || '.';
  const resolved = resolve(targetDir);
  const outputDir = resolve(resolved, '.agentbot/dist');

  console.log('');
  console.log('  📦 Agentbot Bundle');
  console.log('  ──────────────────');

  // Find agent files
  const agentFiles = findAgentFiles(resolved);

  if (agentFiles.length === 0) {
    console.log('  ⚠️  No agent.md files found.');
    console.log('  Run `agentbot init` to create one.');
    process.exit(1);
  }

  // Create output directory
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  const bundled: BundleManifest[] = [];

  for (const filePath of agentFiles) {
    const content = readFileSync(filePath, 'utf-8');
    const agent = parseAgent(content);

    // Copy agent file
    const outFile = join(outputDir, `${agent.name}.md`);
    writeFileSync(outFile, content);

    // Create manifest
    const manifest: BundleManifest = {
      name: agent.name,
      version: '0.1.0',
      description: agent.description,
      model: agent.model,
      tools: agent.tools,
      files: [`${agent.name}.md`],
      createdAt: new Date().toISOString(),
      agentbot: '0.1.0',
    };

    const manifestFile = join(outputDir, `${agent.name}.json`);
    writeFileSync(manifestFile, JSON.stringify(manifest, null, 2));

    bundled.push(manifest);
    console.log(`  ✅ ${agent.name} — ${agent.description}`);
  }

  // Write index
  const index = {
    agents: bundled,
    total: bundled.length,
    createdAt: new Date().toISOString(),
    agentbot: '0.1.0',
  };
  writeFileSync(join(outputDir, 'index.json'), JSON.stringify(index, null, 2));

  console.log('');
  console.log(`  📦 Bundled ${bundled.length} agent(s) to .agentbot/dist/`);
  console.log('');
  console.log('  Files:');
  for (const m of bundled) {
    console.log(`    .agentbot/dist/${m.name}.md`);
    console.log(`    .agentbot/dist/${m.name}.json`);
  }
  console.log(`    .agentbot/dist/index.json`);
  console.log('');
  console.log('  To deploy:');
  console.log('    agentbot deploy');
  console.log('');
}

function parseAgent(content: string) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { name: 'agent', description: '', model: '', tools: [] as string[] };

  const fm = match[1];
  const nameMatch = fm.match(/^name:\s*(.+)$/m);
  const descMatch = fm.match(/^description:\s*(.+)$/m);
  const modelMatch = fm.match(/^model:\s*(.+)$/m);
  const toolsMatch = fm.match(/^tools:\s*\[(.+)\]/m);

  return {
    name: nameMatch?.[1]?.trim() || 'agent',
    description: descMatch?.[1]?.trim() || '',
    model: modelMatch?.[1]?.trim() || '',
    tools: toolsMatch?.[1]?.split(',').map(t => t.trim()) || [],
  };
}

function findAgentFiles(dir: string): string[] {
  if (!existsSync(dir)) return [];
  const files: string[] = [];
  try {
    const entries = readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      if (entry.isFile() && entry.name.endsWith('.md')) {
        const content = readFileSync(fullPath, 'utf-8');
        if (content.startsWith('---')) files.push(fullPath);
      } else if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules' && entry.name !== '.agentbot') {
        files.push(...findAgentFiles(fullPath));
      }
    }
  } catch { /* skip */ }
  return files;
}
