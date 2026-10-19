# Security model and production release checklist

## Non-negotiable rules

1. **Assume public-repository credentials are compromised.** Rotate/revoke provider keys immediately, inspect usage and billing, and remove secrets from tracked files and Git history. Rewriting a file does not erase earlier commits, forks, or caches.
2. Never place private keys, seed phrases, RPC provider secrets, or server API secrets in frontend code, `VITE_*` variables, browser storage, screenshots, or public issue threads.
3. LLMs and agent messages are untrusted inputs. They cannot bypass deterministic authorization, budgets, allowlists, or signing policy.
4. No mainnet transaction without validated chain ID, exact target contract, calldata simulation, spend limit, output floor, deadline, and policy approval.
5. No unlimited token approvals. Prefer exact or tightly capped approvals and monitor/revoke unused allowances.
6. Treasury withdrawals should use a multisig or equivalent independent approval policy, not an LLM-controlled hot wallet.

## Threat model

| Threat | Required control |
|---|---|
| Leaked API key | Revoke/rotate, provider restrictions, usage alerts, secret scanning |
| Wallet-auth replay | Single-use random nonce, short expiry, domain/chain binding, session rotation |
| Prompt injection / malicious tool output | Treat content as data, strict tool allowlists, schema validation, no policy overrides |
| Duplicate job/retry | Idempotency keys, durable state transitions, unique DB constraints, transaction tracking |
| Malicious token/DEX route | Token allowlist, verified deployment addresses, simulation, output floor, limits |
| Slippage / stale quote | Quote freshness, nonzero quote-derived minimum output, deadline, max price impact |
| Compromised executor | Separate signer service, scoped permissions, caps, no raw key in agent process |
| Escrow reentrancy / accounting bug | Reviewed safe-transfer patterns, reentrancy guard, invariant tests, external audit |
| RPC outage / inconsistent data | Multiple RPCs, chain ID checks, retry/backoff, confirmation/finality policy |
| Bridge compromise | No cross-chain mainnet execution until bridge trust and recovery are reviewed |
| Insider treasury misuse | Multisig, timelock, transparent events, withdrawal caps, independent monitoring |

## Smart-contract requirements before mainnet

- Specify and review roles, ownership transfer, pause/unpause, expiry, refunds, dispute handling, fee limits, and emergency recovery.
- Use a maintained safe ERC-20 transfer implementation and handle tokens that return `false` or revert.
- Enforce unique task IDs and terminal states so a task cannot be paid/refunded twice.
- Validate `cost <= escrowed amount`, check all addresses, and emit events for every state transition.
- Use checks-effects-interactions and reentrancy protection; avoid arbitrary external calls.
- Add unit, fuzz, invariant, and fork tests. Verify the exact deployed source and compiler settings.
- Independent audit and documented remediation of all critical/high findings are required for mainnet custody.

## Trading controls

- Start in read-only/shadow mode, then testnet, then a capped human-approved pilot.
- Hard-code safe maxima in policy code: per-trade spend, daily spend, exposure, slippage, price impact, gas, and allowed assets/routers.
- Reject `amountOutMinimum = 0`; calculate a minimum output from a fresh quote and an explicit configured slippage bound.
- Simulate the exact transaction; inspect receipt status and actual token deltas.
- Provide global pause, signer disable, DEX route disable, and incident communication paths.
- Keep a complete audit record: task ID, user approval, policy version, quote timestamp/block, transaction calldata hash, tx hash, receipt, gas, input/output, and operator actions.

## Operations checklist

- [ ] Secrets manager and least-privilege access
- [ ] Production database backups and successful restore drill
- [ ] Structured logs with secrets and personal data redacted
- [ ] Metrics/alerts for API errors, task failures, queue age, transaction reverts, balance changes, and unusual spending
- [ ] Rate limits, request limits, CORS policy, dependency and container scanning
- [ ] CI: lint, typecheck, unit tests, contract tests, build, secret scan, dependency audit
- [ ] Incident runbook with pause, key rotation, user communication, reconciliation, and postmortem
- [ ] Release owner sign-off; rollback plan and immutable deployment record

## Launch decision

**Current recommendation: do not label this repository mainnet-production-ready until the roadmap's release gates have evidence.** Keep real funds and unattended transaction signing disabled during implementation.