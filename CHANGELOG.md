# Changelog

All notable changes to Agentbot will be documented in this file.

## [0.2.0] — 2026-04-29

### Added
- **4 Marketplace Templates** — Production-ready agent definitions from Agentbot Cloud
  - THE-STRATEGIST — Mission planning, logistics, resource allocation (DeepSeek R1)
  - CREW-MANAGER — Royalty splits, talent booking, treasury (Llama 3.3)
  - SOUND-SYSTEM — Mux monitoring, $RAVE gating, live feedback (Mistral 7B)
  - THE-DEVELOPER — Code gen, scripting, contract audit (Qwen 2.5)
- **Marketplace integration** — Templates now sourced from database, not hardcoded

### Changed
- README updated with marketplace templates section
- Examples split into Marketplace Templates and Community Examples

## [0.1.0] — 2026-04-11

### Added
- **Agent Spec** — Markdown + YAML frontmatter format for defining agents
- **SDK** (`@agentbot/sdk`) — Agent parser, orchestration engine, plugin interface, types
- **CLI** (`@agentbot/cli`) — `init`, `list`, `dev`, `run`, `test`, `bundle`, `deploy` commands
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
