# OmniClaw: technical concept paper

**Version:** 0.1 draft  
**Status:** Design proposal, not a statement of completed or audited functionality.

## Abstract

OmniClaw is intended to coordinate specialized AI agents for research, task planning, blockchain data access, user-authorized transactions, and payment settlement. Its design goal is to combine flexible model-assisted reasoning with deterministic policy enforcement and auditable on-chain operations. The current repository contains frontend and backend scaffolding, integration modules, and starter contracts; the complete financial execution and custody path remains a roadmap item until end-to-end evidence is produced.

## Problem

Agent applications often combine untrusted model output, third-party tools, payment systems, and transaction signing. Without clear authority boundaries, a prompt injection, compromised integration, replayed job, stale market quote, or leaked key can cause unintended actions. OmniClaw therefore separates reasoning, policy, transaction construction, signing, and settlement.

## Design principles

1. **Human authority:** users authorize the task and its explicit limits; early pilots require approval of exact transaction details.
2. **Policy before execution:** deterministic rules, not an LLM, decide whether an action is allowed.
3. **Least privilege:** research and planning agents cannot access signing keys; signers enforce allowlists and limits independently.
4. **Auditable state:** each task has a unique ID, idempotency key, status history, policy version, quote metadata, transaction hash, and final receipt.
5. **Fail closed:** missing configuration, stale quotes, unknown chains/tokens, simulation failure, and policy uncertainty lead to rejection.
6. **Explicit trust assumptions:** smart contracts, bridges, RPC providers, oracles, and model providers are not assumed trustworthy merely because they are integrated.
7. **Progressive rollout:** local development, automated CI, testnet, shadow mode, capped human-approved pilot, then a separately reviewed production release.

## Logical components

- **Client:** displays tasks, quotes, limits, approvals, and final outcomes.
- **API and identity:** validates schemas and wallet signatures; prevents replay and enforces authorization.
- **Orchestrator:** manages task state and dispatches work through typed interfaces.
- **Research and quote agents:** gather data and return provenance; they cannot authorize spending.
- **Risk policy engine:** applies spend, exposure, slippage, price-impact, asset, chain, and daily limits.
- **Executor/signer boundary:** builds and simulates approved transactions; a constrained signing service enforces policy independently.
- **Payment/escrow service:** tracks payment evidence and interacts with a specifically designed, tested, audited contract if escrow is adopted.
- **Treasury and governance:** treasury authority is separate from agent authority; governance changes require delays and emergency controls.
- **Observability:** immutable event history, metrics, alerts, reconciliation, and incident response.

## Task model (illustrative)

```json
{
  "task_id": "unique-id",
  "type": "token_swap",
  "chain_id": 84532,
  "input_token": "allowlisted-token-address",
  "output_token": "allowlisted-token-address",
  "amount_in": "decimal-string",
  "min_amount_out": "quote-derived-decimal-string",
  "max_spend_usdc": "decimal-string",
  "deadline": "unix-timestamp",
  "idempotency_key": "unique-request-key",
  "approval_required": true
}
```

The values above are schema examples only. The backend must validate decimals, chain, token addresses, deadline, budget, output floor, and task ownership. Never accept executable calldata or arbitrary destination addresses from an LLM without independent validation.

## Security and safety boundaries

- Never expose private keys or secret provider credentials to the browser or model context.
- Use a dedicated signer with policy-enforced limits; do not rely on prompt instructions as security controls.
- Do not use zero minimum output for swaps. Reject stale quotes and unsupported assets/routes.
- Contracts must prevent duplicate settlement, overpayment, unauthorized withdrawals, reentrancy, and invalid state transitions.
- Cross-chain bridges and autonomous DAO actions are out of initial scope until their trust assumptions and recovery paths are reviewed.

## Monetization hypothesis

Potential models include fixed task fees, metered compute/tool fees, and an explicitly disclosed protocol fee. Pricing must show the fee before authorization and reconcile the charged amount to actual settlement. No revenue, profitability, trading performance, or investment return is promised by this concept paper.

## Evaluation metrics

- Task success and failure rates
- Duplicate-action rate (target: zero)
- Quote age and quote-to-execution deviation
- Actual output versus minimum output
- Transaction revert rate and gas cost
- Policy rejection rate and override attempts
- API latency, queue age, and recovery time
- Security findings and time-to-remediation

## Roadmap and limitations

The repository should be treated as an early prototype/integration skeleton until identity, task-state correctness, payment semantics, contracts, trading execution, monitoring, and release gates have passed documented tests and independent review. See `ROADMAP.md` and `SECURITY.md`.