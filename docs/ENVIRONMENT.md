# Environment configuration guide

## Rules

- Copy an example file to a local ignored `.env` file; never commit `.env`.
- `.env.example` files must contain placeholders only. Do not paste real provider keys into them.
- Server-only secrets belong in backend hosting environment settings or a secret manager. Never prefix a secret with `VITE_` because Vite exposes those values to browser bundles.
- Use separate keys for local development, Base Sepolia, staging, and mainnet. Restrict provider keys by origin/IP where supported and set spending alerts.
- Do not use a production private key for deployment tests. Prefer a hardware/MPC or dedicated policy signer for any later live execution.

## Root `.env.example`

The root example currently exists for Thirdweb-related configuration. It has been replaced on this package branch with placeholders. For local setup, copy it and fill values locally:

```bash
cp .env.example .env
```

Expected keys (values intentionally omitted):

```dotenv
THIRDWEB_PROJECT_ID=
THIRDWEB_CLIENT_ID=
THIRDWEB_SECRET_KEY=
```

The project ID/client ID may be public identifiers depending on provider configuration, but the secret key is private. Treat any key previously committed to a public repository as compromised and rotate it.

## Backend `backend/.env.example`

Copy it only for local backend development:

```bash
cp backend/.env.example backend/.env
```

Common configuration groups:

- **Server/auth:** `PORT`, `JWT_SECRET`
- **LLM:** `OPENROUTER_API_KEY`, `OPENROUTER_MODEL`, optionally provider-specific API key variables
- **Thirdweb:** `THIRDWEB_CLIENT_ID`, `THIRDWEB_SECRET_KEY`, `THIRDWEB_PROJECT_ID`
- **RPC:** `BASE_RPC`, `MONAD_RPC` (use a provider endpoint; do not assume public RPC is production-grade)
- **Payments:** `X402_USDC_CHAIN_ID`, `X402_USDC_TOKEN_ADDRESS`, `X402_USDC_AMOUNT`, `X402_USDC_RECIPIENT`
- **Storage:** `DATABASE_URL`, `REDIS_URL`
- **A2A:** `A2A_PUBLIC_BASE_URL`
- **Treasury:** `TREASURY_ADDRESS`; `TREASURY_PRIVATE_KEY` must not be placed in a general application process unless specifically justified and protected. Prefer a separate signer service.
- **Token config:** `GMMC_TOKEN` is a token address/config value, not proof that access control is implemented.

Set only variables used by the current code path. Validate every value at startup, fail closed when required secrets are missing, and redact credentials from logs.

## Example local values

Local-only infrastructure may use:

```dotenv
PORT=3001
DATABASE_URL=postgres://kai:kai@localhost:5432/kai_agent
REDIS_URL=redis://localhost:6379
A2A_PUBLIC_BASE_URL=http://localhost:3001
X402_USDC_CHAIN_ID=84532
```

These are illustrative local/testnet settings, not mainnet deployment instructions. Confirm the supported chain and token configuration in code before use. Do not copy a testnet token address into mainnet settings.

## Git ignore

Ensure `.gitignore` includes at least:

```gitignore
.env
.env.*
!.env.example
!**/.env.example
backend/.env
frontend/.env
*.pem
*.key
```

After changing ignore rules, check tracked files with `git ls-files '*env*'`. `.gitignore` does not untrack a file already committed. Remove it from the index and commit the removal; if it contained a credential, rotate the credential regardless.