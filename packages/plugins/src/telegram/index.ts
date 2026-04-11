/**
 * Telegram Plugin — Example Integration
 *
 * Send messages, receive updates, manage groups.
 */

import { definePlugin, defineTool } from '@agentbot/sdk';

export const telegramPlugin = definePlugin({
  name: 'telegram',
  description: 'Telegram integration — send messages, receive updates',
  version: '0.1.0',

  tools: [
    defineTool({
      name: 'telegram_send',
      description: 'Send a message via Telegram',
      parameters: {
        chat_id: { type: 'string', description: 'Chat or group ID', required: true },
        message: { type: 'string', description: 'Message text', required: true },
      },
      async execute(args, ctx) {
        const { chat_id, message } = args;
        ctx.log(`[telegram] Sending to ${chat_id}: ${message}`);

        // Integration point: call Telegram Bot API
        // const response = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ chat_id, text: message }),
        // });

        return { success: true, chat_id, message };
      },
    }),

    defineTool({
      name: 'telegram_webhook',
      description: 'Set up a webhook to receive Telegram updates',
      parameters: {
        url: { type: 'string', description: 'Webhook URL', required: true },
      },
      async execute(args, ctx) {
        const { url } = args;
        ctx.log(`[telegram] Setting webhook to ${url}`);
        return { success: true, webhook_url: url };
      },
    }),
  ],
});
