# Tools

Tools are capabilities that agents can use. Each tool has a name, description, parameters, and an execute function.

## Built-in Tools

| Tool | Description | Permission |
|------|-------------|------------|
| `bash` | Execute shell commands | dangerous |
| `read` | Read files from disk | safe |
| `write` | Write/edit files | dangerous |
| `web` | Search and fetch web content | safe |
| `think` | Internal reasoning | safe |
| `memory` | Persistent memory storage | safe |

## Using Tools

Declare tools in your agent's frontmatter:

```markdown
---
name: my-agent
tools: [bash, read, write, web, think, memory]
permissions:
  bash: dangerous
  read: safe
  write: dangerous
---
```

## Permission Levels

| Level | Behavior | When to Use |
|-------|----------|-------------|
| `safe` | Auto-approve | Reads, searches, memory, reasoning |
| `dangerous` | Require approval | Writes, shell commands, HTTP posts |
| `destructive` | Blocked | Destructive operations |

## Creating Custom Tools

```typescript
import { defineTool } from '@agentbot/sdk'

const myTool = defineTool({
  name: 'weather_check',
  description: 'Check the weather for a location',
  parameters: {
    location: {
      type: 'string',
      description: 'City name',
      required: true,
    },
    units: {
      type: 'string',
      description: 'Temperature units (celsius/fahrenheit)',
      default: 'celsius',
    },
  },
  async execute(args, ctx) {
    const { location, units = 'celsius' } = args
    ctx.log(`Checking weather for ${location}`)

    // Your implementation here
    return {
      location,
      temperature: 18,
      units,
      condition: 'cloudy',
    }
  },
})
```

## Tool Parameters

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `type` | string | ✅ | `string`, `number`, `boolean`, `object`, `array` |
| `description` | string | ✅ | What this parameter does |
| `required` | boolean | ❌ | Whether the parameter is required |
| `default` | any | ❌ | Default value if not provided |

## Plugin Tools

Plugins provide additional tools. See [Plugins](../packages/plugins/) for available integrations:

| Tool | Plugin | Description |
|------|--------|-------------|
| `discord_send` | Discord | Send Discord messages |
| `discord_read` | Discord | Read Discord channels |
| `telegram_send` | Telegram | Send Telegram messages |
| `telegram_webhook` | Telegram | Set up Telegram webhooks |
| `email_send` | Email | Send emails |
| `email_template` | Email | Use email templates |
| `browser_navigate` | Browser | Navigate to URLs |
| `browser_scrape` | Browser | Extract page content |
| `browser_screenshot` | Browser | Take screenshots |

## Orchestration

Agentbot automatically optimizes tool execution:

- **Read-only tools** (`read`, `web`, `think`, `memory`) run in **parallel**
- **Mutating tools** (`write`, `bash`, `http_post`) run **sequentially**

This gives maximum throughput without race conditions.

```typescript
// These run in parallel (Promise.all)
[read, web_search, memory_search]

// These run sequentially
[write file]
[bash test]

// Then parallel again
[read, think]
```
