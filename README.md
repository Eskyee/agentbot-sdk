# Agentbot

**Docker for AI workers.**

Build, compose, and deploy autonomous AI agents. Open-source infrastructure for the agent economy.

```bash
curl -fsSL agentbot.sh/install | bash
```

One command. Your agent is running on your machine — connected to Telegram, Discord, or WhatsApp. Your API key talks directly to your LLM provider. We don't touch the costs.

```bash
npx agentbot init     # Create your first agent
npx agentbot dev      # Run locally
npx agentbot deploy   # Ship to production
```

→ [Agentbot Cloud](https://agentbot.sh) for managed deployment

## What is an Agentbot Agent?

An agent is a Markdown file with YAML frontmatter:

```markdown
---
name: researcher
description: Deep research agent for web analysis
model: openrouter/anthropic/claude-3.5-sonnet
tools: [bash, read, write, web, think, memory]
permissions:
  bash: dangerous
  read: safe
  write: dangerous
---

# Researcher Agent

You are a deep research agent specializing in web analysis.
```

That's it. Define your agent, give it tools, set permissions, write its instructions.

## Quick Start

```bash
# Create your first agent
npx agentbot init

# Run locally
npx agentbot dev

# Deploy to Agentbot Cloud
npx agentbot deploy
```

## Packages

| Package | Description |
|---------|-------------|
| `@agentbot/sdk` | Core SDK — agent parser, orchestration, plugins, types |
| `@agentbot/cli` | Developer CLI — init, dev, run |
| `@agentbot/plugins` | Official integrations — Discord, Telegram, email, browser |

## Plugins

Extend agents with capabilities:

```typescript
import { discordPlugin, telegramPlugin } from '@agentbot/plugins'

// Plugins provide tools agents can use
const agent = new Agent({
  tools: ['discord_send', 'telegram_send', 'email_send', 'browser_navigate']
})
```

| Plugin | Tools |
|--------|-------|
| Discord | `discord_send`, `discord_read` |
| Telegram | `telegram_send`, `telegram_webhook` |
| Email | `email_send`, `email_template` |
| Browser | `browser_navigate`, `browser_scrape`, `browser_screenshot` |

Build your own plugin:

```typescript
import { definePlugin, defineTool } from '@agentbot/sdk'

export const myPlugin = definePlugin({
  name: 'my-integration',
  description: 'Custom integration',
  version: '0.1.0',
  tools: [
    defineTool({
      name: 'my_tool',
      description: 'Does something useful',
      parameters: { input: { type: 'string', required: true } },
      async execute(args, ctx) {
        ctx.log(`Running with: ${args.input}`)
        return { result: 'done' }
      }
    })
  ]
})
```

## Examples

- **[Research Agent](./examples/research-agent)** — Web research and analysis
- **[Outreach Agent](./examples/outreach-agent)** — Lead generation and cold messaging
- **[Content Agent](./examples/content-agent)** — Blog posts, social media, documentation
- **[Crypto Analyst](./examples/crypto-analyst)** — Autonomous 24/7 market scanner
- **[Barista Agent](./examples/barista-agent)** — Morning motivation (5 AM survival mode)
- **[Multi-Agent Workflow](./examples/multi-agent-workflow)** — Compose agents into pipelines

## Architecture

```
Agent Definition (.md)
    ↓
Agent Runtime (SDK)
    ↓
Tool Orchestration (parallel reads, serial writes)
    ↓
Memory + Hooks
    ↓
Deploy (self-host or Agentbot Cloud)
```

## Agent Spec

### Frontmatter Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | ✅ | Unique agent identifier |
| `description` | string | ✅ | Human-readable description |
| `model` | string | ✅ | LLM model to use |
| `tools` | string[] | ✅ | Available tools |
| `permissions` | object | ❌ | Per-tool permission overrides |

### Permission Levels

- `safe` — Auto-approve (reads, searches, memory lookups)
- `dangerous` — Require user approval (writes, shell commands)
- `destructive` — Block entirely (rm -rf, DROP TABLE)

### Built-in Tools

- `bash` — Shell command execution
- `read` / `write` — File system operations
- `web` — Web search and fetching
- `think` — Internal reasoning
- `memory` — Persistent memory storage

## Orchestration

Agentbot automatically parallelizes read-only tool calls and serializes writes:

```
[read] [grep] [web_search] → parallel (Promise.all)
    ↓
[write file] → serial (wait for completion)
    ↓
[bash test] → serial (wait for completion)
    ↓
[read] [memory_search] → parallel
```

This gives you maximum throughput without race conditions.

## Self-Host

```bash
# Clone and run locally
git clone https://github.com/Eskyee/agentbot-sdk
cd agentbot-sdk
npm install
npm run build

# Run with Docker
OPENROUTER_API_KEY=sk-... docker compose up

# Or run directly
npx agentbot run examples/research-agent/agent.md
```

## Agentbot Cloud

For production deployments with managed infrastructure:

- One-click deploy
- Hosted memory
- Dashboards and logs
- Team workspaces
- Secret storage
- Production uptime
- Premium model routing

→ [agentbot.sh](https://agentbot.sh)

## Contributing

We welcome contributions! See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

### Ways to Contribute

- Build agents and share them
- Create plugins for new integrations
- Improve the SDK and CLI
- Write documentation
- Report bugs

## Ecosystem

Agentbot is part of a growing ecosystem:

- **$AGENTBOT** — Community token on [Base](https://basescan.org/token/0x986b41c76ab8b7350079613340ee692773b34ba3) and [Solana](https://pump.fun)
- **[Agentbot Cloud](https://agentbot.sh)** — Managed deployment platform
- **[baseFM](https://basefm.space)** — Onchain radio platform

## License

MIT

---

**Agentbot** — Docker for AI workers. Build once, deploy anywhere.
