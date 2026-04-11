# Getting Started

Build your first AI agent in 60 seconds.

## Install

```bash
# Option 1: npx (no install needed)
npx agentbot init

# Option 2: Global install
npm install -g @agentbot/cli

# Option 3: One-command Docker install
curl -fsSL agentbot.sh/install | bash
```

## Create Your First Agent

```bash
agentbot init
```

This creates `agent.md`:

```markdown
---
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

You are a helpful AI assistant.
```

## Run It

```bash
agentbot run agent.md
```

This validates your agent and shows its configuration.

## Watch for Changes

```bash
agentbot dev
```

Watches your directory for agent files and reloads on changes.

## Programmatic API

```typescript
import { createAgent, agentToMarkdown } from '@agentbot/sdk'

const agent = createAgent({
  name: 'researcher',
  description: 'Deep research agent',
  tools: ['bash', 'read', 'web', 'think'],
  permissions: {
    bash: 'safe',
    read: 'safe',
    web: 'safe',
  },
  instruction: 'You are a research agent. Find and summarize information.'
})

// Export to markdown
const md = agentToMarkdown(agent)
console.log(md)
```

## Add Plugins

```typescript
import { discordPlugin, telegramPlugin } from '@agentbot/plugins'

// Plugins provide tools your agent can use
// discord_send, telegram_send, email_send, browser_navigate
```

## Self-Host with Docker

```bash
OPENROUTER_API_KEY=sk-... docker compose up
```

## Next Steps

- Browse [examples](../examples/) for agent inspiration
- Read the [Agent Spec](./agents/) for the full definition format
- Check [Plugins](../packages/plugins/) for available integrations
- Join the community on [X/Twitter](https://x.com/Esky33junglist)
