# Agent Spec v0.1

The Agentbot agent definition format. Agents are Markdown files with YAML frontmatter.

## File Format

```markdown
---
name: agent-name
description: What this agent does
model: provider/model-name
tools: [tool1, tool2, tool3]
permissions:
  tool1: safe
  tool2: dangerous
  tool3: destructive
---

# Agent Name

Instructions go here as markdown.
```

## Frontmatter Fields

### Required

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Unique identifier (lowercase, hyphens) |
| `description` | string | One-line summary of what the agent does |
| `model` | string | LLM model identifier |
| `tools` | string[] | Tools this agent can use |

### Optional

| Field | Type | Description |
|-------|------|-------------|
| `permissions` | object | Per-tool permission overrides |

## Model Format

Models follow the pattern `provider/model-name`:

```
openrouter/anthropic/claude-3.5-sonnet
openrouter/openai/gpt-4o
openrouter/meta-llama/llama-3.1-70b
```

## Tool Permissions

Each tool has a permission level:

| Level | Behavior | Examples |
|-------|----------|---------|
| `safe` | Auto-approve, runs immediately | `read`, `think`, `memory`, `web` |
| `dangerous` | Requires user approval | `bash`, `write`, `http_post` |
| `destructive` | Blocked entirely | `rm -rf`, `DROP TABLE` |

Default: unknown tools are treated as `dangerous`.

## Built-in Tools

| Tool | Description | Default Permission |
|------|-------------|-------------------|
| `bash` | Execute shell commands | dangerous |
| `read` | Read files | safe |
| `write` | Write/edit files | dangerous |
| `web` | Web search and fetch | safe |
| `think` | Internal reasoning | safe |
| `memory` | Persistent memory | safe |

## Extended Tools (via Plugins)

| Tool | Plugin | Description |
|------|--------|-------------|
| `discord_send` | Discord | Send Discord messages |
| `discord_read` | Discord | Read Discord channels |
| `telegram_send` | Telegram | Send Telegram messages |
| `email_send` | Email | Send emails |
| `browser_navigate` | Browser | Navigate to URLs |
| `browser_scrape` | Browser | Extract page content |
| `browser_screenshot` | Browser | Take screenshots |

## Body (Instructions)

Everything after the closing `---` is the agent's instruction set. Write it as clear markdown:

```markdown
# Agent Name

You are a [role]. You specialize in [capability].

## Capabilities
- List what the agent can do

## Guidelines
- Rules the agent should follow

## Output Format
- How the agent should structure results
```

## Validation

An agent definition is valid when:
1. Frontmatter has `---` delimiters
2. Required fields (`name`, `description`, `model`, `tools`) are present
3. Tool permissions use valid levels (`safe`, `dangerous`, `destructive`)
4. Body contains at least one heading (`# ...`)

Run validation:
```bash
agentbot test          # Validate all agents in project
agentbot run agent.md  # Validate single agent
```

## Programmatic Creation

```typescript
import { createAgent, agentToMarkdown } from '@agentbot/sdk'

const agent = createAgent({
  name: 'researcher',
  description: 'Deep research agent',
  model: 'openrouter/anthropic/claude-3.5-sonnet',
  tools: ['bash', 'read', 'web', 'think'],
  permissions: { bash: 'safe', read: 'safe' },
  instruction: '# Researcher\n\nYou are a research agent.'
})

// Export to markdown
const md = agentToMarkdown(agent)
```

## Examples

See [examples/](../examples/) for complete agent definitions:

- [Research Agent](../examples/research-agent/agent.md)
- [Outreach Agent](../examples/outreach-agent/agent.md)
- [Content Agent](../examples/content-agent/agent.md)
- [Crypto Analyst](../examples/crypto-analyst/agent.md)
- [Barista Agent](../examples/barista-agent/agent.md)
- [Multi-Agent Workflow](../examples/multi-agent-workflow/agent.md)
