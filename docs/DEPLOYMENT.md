# Deployment and local development guide

This guide documents a staged engineering workflow. It does not certify the repository as ready for mainnet financial activity.

## Prerequisites

- Git, a supported Node.js LTS release, and npm.
- Docker Compose for local PostgreSQL/Redis if required by backend adapters.
- Development-only provider credentials for LLM and Thirdweb integrations.
- Base Sepolia RPC and test assets for blockchain integration work.

## Install

```bash
git clone https://github.com/hakuramasam/omniclaw-ai.git
cd omniclaw-ai
npm ci
cd backend && npm ci && cd ..
```

Use the package manager and runtime version documented by each package. Avoid mixing package managers within a package without a deliberate migration.

## Local configuration

```bash
cp .env.example .env
cp backend/.env.example backend/.env
```

Fill local development values only. Never commit `.env` files. See `ENVIRONMENT.md` and `SECURITY.md`; credentials previously committed publicly should be rotated.

## Start and validate

```bash
docker compose up -d
npm run lint
npm test
npm run build
```

Run backend scripts listed in `backend/package.json` separately. Record results in CI. A successful frontend build alone does not validate API security, payment behavior, smart contracts, or trading.

## Frontend hosting

The repository contains both a root Vite app and a separate `frontend/` tree with different framework artifacts. Confirm the intended build root and output directory from the current deployment configuration rather than guessing. Keep server-only credentials out of browser-exposed environment variables. Configure the API URL and strict production CORS explicitly.

## Backend staging

Deploy the backend separately from the frontend. Use managed database/cache services with access controls and backups. Configure encrypted environment variables, health/readiness checks, rate limits, request IDs, redacted logs, monitoring, and an incident contact. Keep transaction signing disabled until signer separation and policy controls are implemented.

## Testnet-only integration checklist

1. Confirm the configured chain ID.
2. Verify token and DEX deployment addresses from official sources for the exact chain and version.
3. Start with read-only calls and quote checks.
4. Simulate exact transaction data and enforce a nonzero quote-derived minimum output, deadline, recipient, spend cap, and allowlists.
5. Use testnet assets only and verify receipts, token deltas, and failure paths.
6. Test replay prevention, idempotency, stale quotes, RPC failure, and transaction reverts.

Do not treat this guide as instructions to deploy unreviewed contracts or enable mainnet transactions. Contract code requires implementation, tests, review, and an independent audit before mainnet use.

## Promotion gates

`local -> CI green -> testnet integration -> staging/shadow mode -> capped human-approved pilot -> reviewed production release`.

At every gate record test results, security findings, deployment commit, rollback instructions, and owner approval. Keep unattended mainnet activity disabled until release gates are met.