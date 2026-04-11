/**
 * Discord Plugin — Example Integration
 *
 * Send messages, read channels, manage roles.
 */

import { definePlugin, defineTool } from '@agentbot/sdk';

export const discordPlugin = definePlugin({
  name: 'discord',
  description: 'Discord integration — send messages, read channels, manage roles',
  version: '0.1.0',

  tools: [
    defineTool({
      name: 'discord_send',
      description: 'Send a message to a Discord channel',
      parameters: {
        channel: { type: 'string', description: 'Channel ID or name', required: true },
        message: { type: 'string', description: 'Message content', required: true },
      },
      async execute(args, ctx) {
        const { channel, message } = args;
        ctx.log(`[discord] Sending to #${channel}: ${message}`);

        // Integration point: call Discord API
        // const response = await fetch(`https://discord.com/api/channels/${channel}/messages`, {
        //   method: 'POST',
        //   headers: { Authorization: `Bot ${process.env.DISCORD_TOKEN}` },
        //   body: JSON.stringify({ content: message }),
        // });

        return { success: true, channel, message };
      },
    }),

    defineTool({
      name: 'discord_read',
      description: 'Read recent messages from a Discord channel',
      parameters: {
        channel: { type: 'string', description: 'Channel ID or name', required: true },
        limit: { type: 'number', description: 'Number of messages to read', default: 10 },
      },
      async execute(args, ctx) {
        const { channel, limit = 10 } = args;
        ctx.log(`[discord] Reading ${limit} messages from #${channel}`);

        // Integration point: call Discord API
        return { channel, messages: [], count: 0 };
      },
    }),
  ],
});
