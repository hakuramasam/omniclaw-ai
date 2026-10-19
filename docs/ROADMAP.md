# OmniClaw roadmap and delivery milestones

Roadmap status is intentionally conservative. Milestones are **planned** unless explicitly marked as present in `PROJECT_STATUS.md`. Dates and effort are estimates to be set by the project owner after staffing and scope are agreed.

## M0 — Repository hygiene and baseline (P0)

- [ ] Rotate any API credential ever committed to the public repository; update provider dashboards and revoke old keys.
- [ ] Replace credentials in `.env.example` with empty placeholders and verify `.gitignore` excludes `.env*` except examples.
- [ ] Establish one canonical frontend and one canonical backend; document deployment roots.
- [ ] Install from lockfiles in clean CI and run lint, typecheck, unit tests, frontend build, backend build.
- [ ] Generate an SBOM and run dependency/license/secrets scanning.
- **Exit gate:** reproducible CI, zero committed secrets, baseline test report, repository ownership documented.

## M1 — Backend and identity hardening (P0)

- [ ] Validate all inputs with schemas; enforce request size limits and strict CORS.
- [ ] Implement nonce-based wallet login (e.g. SIWE-compatible), domain/chain binding, nonce expiry, one-time consumption, signature verification, secure sessions, logout and rate limits.
- [ ] Add authentication and authorization tests, including replay and wrong-chain cases.
- [ ] Add migrations, health/readiness endpoints, structured redacted logs, request IDs, rate limiting, and API error conventions.
- **Exit gate:** security tests pass; no secrets or personal data leak into logs.

## M2 — Task orchestration and agent boundaries (P0)

- [ ] Define a versioned task schema: task ID, requester, chain, action, input assets, amount, max spend, min receive, deadline, idempotency key, status.
- [ ] Define explicit state machine: `created -> quoted -> awaiting_approval -> submitted -> confirmed` or `rejected/failed/refunded`.
- [ ] Make queue jobs idempotent, retry-safe, timeout-bounded, and observable.
- [ ] Keep LLM output untrusted; validate structured output and apply deterministic policies.
- [ ] Add signed inter-agent messages, authorization, message TTL, replay protection, and trace IDs if A2A is enabled.
- **Exit gate:** chaos/retry tests show no duplicate payments or duplicate transactions.

## M3 — Payments and escrow (P0 before accepting customer funds)

- [ ] Specify escrow state machine and threat model before writing contracts.
- [ ] Use a vetted safe ERC-20 transfer library; support only explicitly allowlisted tokens and chains.
- [ ] Bind escrow deposits to unique task IDs, depositor, token, amount, expiry, fee cap, and refund conditions.
- [ ] Add reentrancy protection, checks-effects-interactions, pause controls, role separation, events, withdrawal limits, and recovery process.
- [ ] Test fee-on-transfer/reverting tokens where relevant; reject unsupported token behavior.
- [ ] Unit, fuzz, invariant, and Base Sepolia integration tests; independent audit before mainnet.
- [ ] Reconcile x402 payment verification with actual on-chain settlement and prevent replay/double claims.
- **Exit gate:** audited contract, verified source, testnet end-to-end evidence, and operational runbook.

## M4 — Uniswap/Base swap integration (P0 before live trading)

- [ ] Choose the exact Uniswap deployment/version and verify official Base addresses from primary sources at implementation time.
- [ ] Use correct ABI/router interface and quote source; validate chain ID and token decimals.
- [ ] Enforce nonzero quote-derived `amountOutMinimum`, transaction deadline, max price impact, max slippage, token allowlist, and per-trade/max-daily caps.
- [ ] Simulate before sending; verify receipt, actual input/output, gas, and finality.
- [ ] Add stale quote checks, MEV/ordering risk assessment, RPC failover, nonce management, replacement/cancel logic, and pause switch.
- [ ] Build Base Sepolia fork/integration tests; test revert, low liquidity, stale quote, malicious token, and RPC outage cases.
- **Exit gate:** tests pass and a human approves every trade in the pilot environment.

## M5 — Deployment and operations (P0)

- [ ] Separate dev, testnet, staging, and mainnet credentials/accounts.
- [ ] Use a secret manager; never store signing keys in frontend or Vercel public environment variables.
- [ ] Prefer hardware/MPC or policy-controlled signer; treasury uses multisig and timelock where practical.
- [ ] Configure backups, restore drills, monitoring, alerts, uptime checks, error budgets, and incident contacts.
- [ ] Add deployment approvals, immutable artifact/build metadata, rollback procedure, and contract verification.
- **Exit gate:** documented release sign-off and successful recovery drill.

## M6 — Mainnet capped pilot (only after M0–M5)

- [ ] Start with test-only or read-only mode, then tiny capped transactions with explicit human approval.
- [ ] Set hard caps for task budget, daily spend, token exposure, gas, and treasury payout.
- [ ] Run shadow mode before enabling execution; compare expected vs actual outcomes.
- [ ] Have an operator on call, a global pause, and a clear refund/incident process.
- **Exit gate:** agreed observation window with no unresolved critical/high issues.

## M7 — Multi-agent swarm and self-improvement (later)

- [ ] Add specialist agents behind a stable task interface, not direct shared key access.
- [ ] Use independent evidence, provenance, consensus thresholds, and deterministic risk vetoes.
- [ ] Evaluate agent quality offline with fixed datasets and regression tests.
- [ ] Allow self-improvement to create candidate prompt/config changes only; require review and staged rollout.
- [ ] Do not let an agent autonomously modify signing policy, limits, contracts, or production secrets.

## M8 — Cross-chain, agent economy, and DAO (later / research)

- [ ] Start with read-only Base/Monad chain adapters and monitoring.
- [ ] Select a bridge only after trust assumptions, canonical assets, message finality, rate limits, and failure recovery are reviewed.
- [ ] Implement agent quotes, escrowed service payments, disputes, reputation, and abuse controls before marketplace launch.
- [ ] Treat governance as a separately audited system; use timelocks, quorum, proposal validation, and emergency controls.

## Release checklist

A milestone is complete only when code is merged, tests and CI evidence are attached, configuration is documented, risks are accepted by an accountable owner, and rollback/monitoring are ready. A successful frontend deployment alone is not evidence of on-chain production readiness.