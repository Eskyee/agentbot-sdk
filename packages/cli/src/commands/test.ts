import { readdirSync, existsSync, readFileSync } from 'fs';
import { resolve, extname } from 'path';

interface TestResult {
  file: string;
  name: string;
  passed: boolean;
  errors: string[];
}

export async function testCommand(args: string[]) {
  const targetDir = args[0] || '.';
  const resolved = resolve(targetDir);

  console.log('');
  console.log('  🧪 Agentbot Test Runner');
  console.log('  ───────────────────────');
  console.log(`  Scanning: ${resolved}`);
  console.log('');

  const agentFiles = findAgentFiles(resolved);

  if (agentFiles.length === 0) {
    console.log('  ⚠️  No agent.md files found.');
    console.log('  Run `agentbot init` to create one.');
    process.exit(1);
  }

  const results: TestResult[] = [];

  for (const file of agentFiles) {
    const result = validateAgent(file);
    results.push(result);

    const icon = result.passed ? '✅' : '❌';
    console.log(`  ${icon} ${result.name}`);

    if (!result.passed) {
      for (const error of result.errors) {
        console.log(`     └─ ${error}`);
      }
    }
  }

  console.log('');

  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;

  if (failed === 0) {
    console.log(`  ✅ All ${passed} agent(s) passed validation.`);
  } else {
    console.log(`  ❌ ${failed} failed, ${passed} passed.`);
    process.exit(1);
  }
  console.log('');
}

function validateAgent(filePath: string): TestResult {
  const name = filePath.split('/').pop()?.replace(/\.md$/, '') || 'unknown';
  const errors: string[] = [];

  try {
    const content = readFileSync(filePath, 'utf-8');

    // Check frontmatter
    const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!match) {
      errors.push('Missing YAML frontmatter (--- ... ---)');
      return { file: filePath, name, passed: false, errors };
    }

    const frontmatter = match[1];
    const body = match[2];

    // Check required fields
    if (!/^name:/m.test(frontmatter)) errors.push('Missing required field: name');
    if (!/^description:/m.test(frontmatter)) errors.push('Missing required field: description');
    if (!/^model:/m.test(frontmatter)) errors.push('Missing required field: model');

    // Check tools
    const toolsMatch = frontmatter.match(/^tools:\s*\[(.+)\]/m);
    if (!toolsMatch) {
      errors.push('Missing or invalid tools field');
    }

    // Check permissions
    const permissionsMatch = frontmatter.match(/^permissions:/m);
    if (permissionsMatch) {
      const permLines = frontmatter.split('\n');
      let inPerms = false;
      for (const line of permLines) {
        if (line.startsWith('permissions:')) {
          inPerms = true;
          continue;
        }
        if (inPerms && line.match(/^\s+(\w+):\s*(.+)$/)) {
          const level = line.trim().split(':')[1]?.trim();
          if (!['safe', 'dangerous', 'destructive'].includes(level || '')) {
            errors.push(`Invalid permission level: ${level} (must be safe/dangerous/destructive)`);
          }
        }
        if (inPerms && !line.match(/^\s/) && line.trim()) {
          inPerms = false;
        }
      }
    }

    // Check body content
    if (!body.trim()) {
      errors.push('Agent has no instructions (empty body)');
    }

    // Check body has heading
    if (!body.match(/^#\s+/m)) {
      errors.push('Agent body should start with a heading (# Agent Name)');
    }
  } catch (err) {
    errors.push(`Could not read file: ${err instanceof Error ? err.message : String(err)}`);
  }

  return { file: filePath, name, passed: errors.length === 0, errors };
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
    // Skip
  }

  return files;
}
