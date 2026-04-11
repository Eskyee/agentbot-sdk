# Contributing to Agentbot

Thanks for your interest in contributing! Agentbot is open-source infrastructure for AI workers, and we need builders like you.

## Getting Started

```bash
git clone https://github.com/Eskyee/agentbot-sdk
cd agentbot-sdk
npm install
npm run build
```

## How to Contribute

### Build an Agent
Create an agent definition in `examples/`:
1. Create a new directory: `examples/my-agent/`
2. Add `agent.md` with YAML frontmatter
3. Test it locally: `npx agentbot run examples/my-agent/agent.md`
4. Submit a PR

### Build a Plugin
Add an integration in `packages/plugins/`:
1. Create a new directory: `packages/plugins/my-integration/`
2. Implement the plugin interface
3. Add documentation
4. Submit a PR

### Improve the SDK
1. Fork the repo
2. Create a feature branch
3. Make your changes
4. Run tests: `npm test`
5. Submit a PR

## Code Standards

- TypeScript strict mode
- Tests for new functionality
- Clear commit messages
- Document public APIs

## What We're Looking For

- New agent examples
- Plugin integrations (Slack, Linear, GitHub, etc.)
- SDK improvements
- Documentation
- Bug reports

## What We're NOT Looking For

- Changes to the hosted platform (that's in our private repo)
- Token or blockchain integrations (separate project)
- Dashboard or UI changes (Agentbot Cloud is private)

## Questions?

Open an issue or reach out on [X/Twitter](https://x.com/Esky33junglist).
