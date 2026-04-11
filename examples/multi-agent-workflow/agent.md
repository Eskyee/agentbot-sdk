---
name: workflow-lead-to-content
description: Multi-agent workflow: research leads → outreach → create content
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

# Multi-Agent Workflow: Lead → Outreach → Content

This workflow demonstrates how to compose multiple agents into a pipeline.

## Flow
```
Researcher Agent → Outreach Agent → Content Agent
       ↓                  ↓               ↓
  Find leads      Contact leads    Create content
```

## Step 1: Research
The researcher agent:
- Searches for target companies
- Identifies decision-makers
- Gathers company intel
- Outputs: `leads.json`

## Step 2: Outreach
The outreach agent:
- Reads `leads.json`
- Researches each lead
- Crafts personalized messages
- Outputs: `outreach-log.md`

## Step 3: Content
The content agent:
- Reads outreach results
- Creates follow-up content
- Writes blog posts about successful campaigns
- Outputs: `content/`

## Usage
```bash
# Run the full pipeline
agentbot run workflow-lead-to-content

# Or run individual steps
agentbot run researcher --input "Find AI companies in London"
agentbot run outreach --input leads.json
agentbot run content --input outreach-log.md
```
