import { readFileSync, existsSync } from 'fs';
import { resolve, join } from 'path';

const CLOUD_API = 'https://agentbot.sh';

export async function deployCommand(args: string[]) {
  const targetDir = args[0] || '.';
  const resolved = resolve(targetDir);
  const bundleDir = join(resolved, '.agentbot/dist');

  console.log('');
  console.log('  🚀 Agentbot Deploy');
  console.log('  ──────────────────');

  // Check for bundled agents
  const indexFile = join(bundleDir, 'index.json');
  if (!existsSync(indexFile)) {
    console.log('  ⚠️  No bundle found. Run `agentbot bundle` first.');
    console.log('');
    console.log('  Or bundle and deploy in one step:');
    console.log('    agentbot bundle && agentbot deploy');
    console.log('');
    process.exit(1);
  }

  const index = JSON.parse(readFileSync(indexFile, 'utf-8'));
  console.log(`  Found ${index.total} agent(s) to deploy.`);
  console.log('');

  // Check for API key
  const apiKey = process.env.AGENTBOT_API_KEY;
  if (!apiKey) {
    console.log('  ❌ AGENTBOT_API_KEY not set.');
    console.log('');
    console.log('  Get your API key:');
    console.log('    1. Sign up at https://agentbot.sh');
    console.log('    2. Go to Settings → API Keys');
    console.log('    3. Create a new key');
    console.log('');
    console.log('  Then run:');
    console.log('    AGENTBOT_API_KEY=sk-... agentbot deploy');
    console.log('');
    process.exit(1);
  }

  // Deploy each agent
  for (const agent of index.agents) {
    const agentFile = join(bundleDir, `${agent.name}.md`);
    const content = readFileSync(agentFile, 'utf-8');

    console.log(`  📤 Deploying ${agent.name}...`);

    try {
      const res = await fetch(`${CLOUD_API}/api/agents/provision`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          name: agent.name,
          description: agent.description,
          definition: content,
          model: agent.model,
          tools: agent.tools,
        }),
      });

      if (res.ok) {
        const data = await res.json() as { url?: string };
        console.log(`  ✅ ${agent.name} deployed!`);
        if (data.url) {
          console.log(`     ${data.url}`);
        }
      } else {
        const err = await res.text();
        console.log(`  ❌ ${agent.name} failed: ${res.status} ${err}`);
      }
    } catch (err) {
      console.log(`  ❌ ${agent.name} error: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  console.log('');
  console.log('  🎉 Deploy complete!');
  console.log(`  Dashboard: ${CLOUD_API}/dashboard`);
  console.log('');
}
