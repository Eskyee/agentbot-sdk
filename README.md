# @agentbot/sdk

TypeScript SDK for the [Agentbot](https://agentbot.sh) platform — agents, chat, MCP tools, and x402 micropayments.

## Install

```bash
npm install @agentbot/sdk
```

## Quick Start

```typescript
import { AgentbotClient } from '@agentbot/sdk';

const client = new AgentbotClient({
  apiKey: process.env.AGENTBOT_API_KEY!,
  baseUrl: 'https://agentbot.sh',
});

// Chat with your agent
const response = await client.chat({
  message: 'What BPM works best for peak-time techno?',
});

console.log(response.reply);

// Stream responses
const stream = await client.chatStream({
  message: 'Give me 3 classic Detroit techno tracks',
});

for await (const chunk of stream) {
  if (!chunk.done) process.stdout.write(chunk.text);
}
```

## MCP Tools

```typescript
import { McpClient } from '@agentbot/sdk';

const mcp = new McpClient({ apiKey: 'your-key' });

// List available tools
const tools = await mcp.listTools();

// Call a tool
const result = await mcp.callTool({
  name: 'weather',
  arguments: { city: 'London' },
});
```

## x402 Micropayments

```typescript
import { x402 } from '@agentbot/sdk';

// Pay for an API call with USDC on Base
const response = await x402.fetch('https://api.example.com/premium', {
  payment: { maxAmount: '1000' }, // 0.001 USDC
});
```

## Packages

| Package | Description |
|---------|-------------|
| `@agentbot/sdk` | Core SDK — client, chat, streaming |
| `@agentbot/sdk/mcp` | MCP tool client |
| `@agentbot/sdk/x402` | x402 micropayment helpers |

## Agentbot Platform

- **[agentbot.sh](https://agentbot.sh)** — Deploy your AI agent
- **[Documentation](https://agentbot.sh/documentation)** — Guides and API reference
- **[GitHub](https://github.com/Eskyee/agentbot)** — Source code

## License

MIT
