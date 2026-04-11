# Workflows

Workflows compose multiple agents into coordinated pipelines. Each step feeds its output to the next agent.

## What is a Workflow?

A workflow is a sequence of agents that work together:

```
Researcher → Analyst → Writer → Publisher
    ↓           ↓         ↓         ↓
  Research    Analysis   Draft    Publish
```

## Defining Workflows

Workflows are defined as agent files that reference other agents:

```markdown
---
name: lead-to-content
description: Multi-agent workflow: find leads → outreach → create content
model: openrouter/anthropic/claude-3.5-sonnet
tools: [bash, read, write, web, think, memory]
permissions:
  bash: safe
  read: safe
  write: safe
  web: safe
  think: safe
  memory: safe
---

# Lead to Content Workflow

This workflow runs three agents in sequence:

1. **Researcher** — finds potential leads
2. **Outreach** — contacts leads with personalized messages
3. **Content** — creates follow-up content

## Flow
```
research-agent → outreach-agent → content-agent
      ↓                ↓               ↓
  leads.json    outreach-log.md   blog-post.md
```
```

## Programmatic Workflows

```typescript
import { createAgent } from '@agentbot/sdk'

// Step 1: Research
const researcher = createAgent({
  name: 'researcher',
  description: 'Find leads',
  instruction: 'Search for leads and save to leads.json'
})

// Step 2: Outreach
const outreach = createAgent({
  name: 'outreach',
  description: 'Contact leads',
  instruction: 'Read leads.json and craft personalized messages'
})

// Step 3: Content
const writer = createAgent({
  name: 'writer',
  description: 'Create content',
  instruction: 'Write blog posts based on outreach results'
})
```

## Workflow Patterns

### Sequential Pipeline
```
Agent A → Agent B → Agent C
```
Each agent runs in order. Output of A feeds into B.

### Fan-Out
```
Agent A → Agent B1
       → Agent B2
       → Agent B3
```
One agent's output is processed by multiple agents in parallel.

### Fan-In
```
Agent A1 ─┐
Agent A2 ─┼→ Agent B
Agent A3 ─┘
```
Multiple agents feed into a single aggregation agent.

### Conditional
```
Agent A → [check] → Agent B (if true)
                   → Agent C (if false)
```
An agent evaluates a condition and routes to different agents.

## Example: Research → Outreach → Content

See [multi-agent-workflow](../examples/multi-agent-workflow/agent.md) for a complete example.

## Best Practices

1. **Keep steps focused** — each agent should do one thing well
2. **Define clear outputs** — each step should produce a named file
3. **Handle errors** — if one step fails, the workflow should log and continue or stop gracefully
4. **Use memory** — agents can share context through memory
5. **Log everything** — make the workflow auditable
