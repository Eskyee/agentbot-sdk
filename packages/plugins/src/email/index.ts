/**
 * Email Plugin — Example Integration
 *
 * Send emails, read inbox, manage templates.
 */

import { definePlugin, defineTool } from '@agentbot/sdk';

export const emailPlugin = definePlugin({
  name: 'email',
  description: 'Email integration — send, read, and manage emails',
  version: '0.1.0',

  tools: [
    defineTool({
      name: 'email_send',
      description: 'Send an email',
      parameters: {
        to: { type: 'string', description: 'Recipient email', required: true },
        subject: { type: 'string', description: 'Email subject', required: true },
        body: { type: 'string', description: 'Email body (HTML or plain text)', required: true },
      },
      async execute(args, ctx) {
        const { to, subject, body } = args;
        ctx.log(`[email] Sending to ${to}: ${subject}`);

        // Integration point: use Resend, SendGrid, or SES
        // const response = await resend.emails.send({ to, subject, html: body });

        return { success: true, to, subject };
      },
    }),

    defineTool({
      name: 'email_template',
      description: 'Create or use an email template',
      parameters: {
        name: { type: 'string', description: 'Template name', required: true },
        variables: { type: 'object', description: 'Template variables' },
      },
      async execute(args, ctx) {
        const { name, variables = {} } = args;
        ctx.log(`[email] Using template: ${name}`);
        return { template: name, variables, rendered: '' };
      },
    }),
  ],
});
