# OmniClaw v5
Autonomous AI Protocol skeleton repository with frontend and backend.

## Kai Agent Stack

- LLM: OpenRouter (Llama 3.3 70B)
- Tools: Thirdweb + blockchain RPCs
- A2A: Public HTTP endpoints
- Storage: Postgres + Redis (docker-compose)

## Local Setup

1. Start Postgres + Redis

```bash
cd /root/.codex/worktrees/54d6/Kai\ Agent

docker compose up -d
```

2. Backend

```bash
cd /root/.codex/worktrees/54d6/Kai\ Agent/backend

cp .env.example .env
# Fill in OPENROUTER_API_KEY, THIRDWEB_CLIENT_ID, THIRDWEB_SECRET_KEY

npm install
npm run dev
```

3. Frontend

```bash
cd /root/.codex/worktrees/54d6/Kai\ Agent/frontend

npm install
npm run dev
```

## API Endpoints (Backend)

- `GET /api/health`
- `GET /api/agents`
- `GET /api/skills`
- `POST /api/skills/install`
- `GET /api/a2a/inbox?recipient=kai`
- `POST /api/a2a/inbox`
- `GET /api/a2a/outbox?sender=kai`
- `POST /api/a2a/outbox`
- `POST /api/llm/chat`
- `GET /api/tools/thirdweb/status`
- `POST /api/tools/thirdweb/request` (generic proxy)
- `POST /api/tools/thirdweb/wallets` (requires path starting `/v1/wallets`)
- `GET /api/tools/thirdweb/wallets/balance?address=0x...&chainId=1&chainId=137&tokenAddress=0x...`
- `GET /api/tools/thirdweb/wallets/transactions?address=0x...&chainId=1`
- `GET /api/tools/thirdweb/wallets/tokens?address=0x...&chainId=1`
- `GET /api/tools/thirdweb/wallets/nfts?address=0x...&chainId=1`
- `POST /api/tools/thirdweb/wallets/sign-message`
- `POST /api/tools/thirdweb/wallets/sign-typed-data`
- `POST /api/tools/thirdweb/wallets/send`
- `POST /api/tools/thirdweb/gateway` (requires path starting `/v1/contracts`)
- `POST /api/tools/thirdweb/gateway/read`
- `POST /api/tools/thirdweb/gateway/write`
- `GET /api/tools/thirdweb/gateway/contracts`
- `GET /api/tools/thirdweb/gateway/contracts/transactions?chainId=1&address=0x...`
- `GET /api/tools/thirdweb/gateway/contracts/events?chainId=1&address=0x...`
- `GET /api/tools/thirdweb/gateway/contracts/metadata?chainId=1&address=0x...`
- `GET /api/tools/thirdweb/gateway/contracts/signatures?chainId=1&address=0x...`
- `POST /api/tools/thirdweb/tokens` (requires path starting `/v1/tokens`)
- `GET /api/tools/thirdweb/tokens/list`
- `POST /api/tools/thirdweb/tokens/create`
- `GET /api/tools/thirdweb/tokens/owners?chainId=1&address=0x...&tokenId=123`
- `POST /api/tools/thirdweb/bridge` (requires path starting `/v1/bridge`)
- `GET /api/tools/thirdweb/bridge/chains`
- `GET /api/tools/thirdweb/bridge/routes`
- `POST /api/tools/thirdweb/bridge/convert`
- `POST /api/tools/thirdweb/bridge/swap`
- `POST /api/tools/thirdweb/bridge/payments`
- `POST /api/tools/thirdweb/bridge/payments/:id`
- `POST /api/tools/thirdweb/ai` (requires path starting `/ai`)
- `POST /api/tools/thirdweb/ai/chat`
- `POST /api/tools/thirdweb/ai/chat/stream`

## x402 Payment (Write Operations)

Write endpoints require a payment header:

- `x402-payment-id: <payment-id>`

If missing, the API returns `402` with a payment link and ID. Use that link
to complete payment, then retry with the header.

Configure payment defaults in `.env`:

- `X402_USDC_CHAIN_ID`
- `X402_USDC_TOKEN_ADDRESS`
- `X402_USDC_AMOUNT` (default `0.1`)
- `X402_USDC_RECIPIENT`

Note: the server only accepts payment IDs it created (stored in `x402_payments`).
- `POST /api/tools/thirdweb/auth/initiate`
- `POST /api/tools/thirdweb/auth/complete`

## Frontend Pages

- `/` Overview
- `/dashboard` Health + agent status
- `/agent-console` A2A inbox/outbox
- `/skill-marketplace` Skill registry
