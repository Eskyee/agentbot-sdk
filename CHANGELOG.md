# Changelog

All notable changes to Agentbot will be documented in this file.

## [0.1.0] — 2026-04-11

### Added
- **Agent Spec** — Markdown + YAML frontmatter format for defining agents
- **SDK** (`@agentbot/sdk`) — Agent parser, orchestration engine, plugin interface, types
- **CLI** (`@agentbot/cli`) — `init`, `dev`, `run`, `test` commands
- **Plugins** (`@agentbot/plugins`) — Discord, Telegram, email, browser integrations
- **Orchestration** — Automatic parallel reads, serial writes for tool execution
- **createAgent()** — Programmatic agent creation API
- **agentToMarkdown()** — Export agent definitions to markdown format
- **6 Example Agents:**
  - Research Agent — web research and analysis
  - Outreach Agent — lead generation and cold messaging
  - Content Agent — blog posts and social media
  - Crypto Analyst — autonomous 24/7 market scanner
  - Barista Agent — morning motivation (5 AM survival mode)
  - Multi-Agent Workflow — compose agents into pipelines
- **One-command install** — `curl -fsSL agentbot.sh/install | bash`
- **Docker Compose** — self-host with one command
- **GitHub Actions CI** — type check + build on Node 20/22
- **Getting Started guide** — install → create → run → plugins → self-host
- **CONTRIBUTING.md** — how to build agents, plugins, and contribute

### Philosophy
> Docker for AI workers. Build once, deploy anywhere.

### Links
- GitHub: https://github.com/Eskyee/agentbot-sdk
- Cloud: https://agentbot.sh
- X/Twitter: https://x.com/Esky33junglist
