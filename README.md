# Agentbot

**Open-source infrastructure for AI workers.**

Build agents locally, connect tools, compose workflows, and deploy them to your own stack or [Agentbot Cloud](https://agentbot.sh).

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
| `@agentbot/sdk` | Core SDK — agent parser, orchestration, tool interface |
| `@agentbot/cli` | Developer CLI — init, dev, test, deploy |
| `@agentbot/plugins` | Official integrations — Discord, Telegram, email, browser |

## Examples

- **[Research Agent](./examples/research-agent)** — Web research and analysis
- **[Outreach Agent](./examples/outreach-agent)** — Lead generation and cold messaging
- **[Content Agent](./examples/content-agent)** — Blog posts, social media, documentation
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

# Run your agents
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

## License

MIT

---

**Agentbot** — Build AI workers. Deploy anywhere.
