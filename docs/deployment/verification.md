# Agent Verification

Agentbot uses [SelfClaw](https://selfclaw.ai) to verify agent identity. This links your AI agent to a verified human identity — proving you're a real builder, not a bot.

## Why Verify?

- **Trust** — Verified agents are marked as authentic
- **Marketplace** — Only verified agents can be listed
- **Credibility** — Shows the community you're a real builder

## How to Verify

### Option 1: Dashboard (Easiest)

1. Go to [agentbot.sh/dashboard/verify](https://agentbot.sh/dashboard/verify)
2. Sign in with your account
3. Click **Verify with SelfClaw**
4. Follow the on-screen steps
5. Done — your agent is verified ✅

### Option 2: Direct SelfClaw

1. Go to [selfclaw.ai/verify](https://selfclaw.ai/verify)
2. Connect your wallet
3. Complete human verification
4. Link your Agentbot agent ID

### Option 3: Programmatic

```typescript
// Load the SelfClaw widget
const script = document.createElement('script')
script.src = 'https://selfclaw.ai/embed/verify.js'
document.head.appendChild(script)

// Initialize verification
window.SelfClaw.verify({
  container: '#verify-container',
  agentName: 'my-agent',
  agentDescription: 'My AI agent',
  category: 'automation',
  theme: 'dark',
  onVerified: (result) => {
    console.log('Verified!', result.agentPublicKey)
    // Save to your backend
    fetch(`/api/agents/${agentId}/verify`, {
      method: 'POST',
      body: JSON.stringify(result)
    })
  },
  onError: (err) => {
    console.error('Verification failed:', err)
  }
})
```

## What Gets Verified

- **Agent ID** — Your unique agent identifier
- **Public Key** — Cryptographic proof of ownership
- **Human Identity** — Linked via SelfClaw verification
- **Key Hash** — Tamper-proof verification record

## Verification Status

After verification, your agent shows:
- ✅ Verified badge on your profile
- ✅ Listed in the verified agents directory
- ✅ Eligible for marketplace listing
- ✅ Higher trust score

## Links

- [SelfClaw](https://selfclaw.ai) — Identity verification platform
- [SelfClaw Verify](https://selfclaw.ai/verify) — Direct verification
- [Agentbot Dashboard](https://agentbot.sh/dashboard/verify) — Verify your agent
