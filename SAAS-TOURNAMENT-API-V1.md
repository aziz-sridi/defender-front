# SaaS Tournament & Bracket API (v1) — Product + Engineering Plan

> Goal: ship a **multi-tenant bracket/tournament engine as a SaaS** with a clean HTTP API that can power DEFENDR admin tooling and external clients.

## 1) Goals

- **Multi-tenant by default**: every request is scoped to an `account` (SaaS customer/org).
- Provide **core tournament primitives** (participants → seeding → bracket generation → match results → standings).
- Keep endpoints **predictable and testable**: JSON-in / JSON-out with clear validation rules.
- Offer **operational quality** for SaaS: API keys, rate limiting, logging, error format, versioning, OpenAPI.

## 2) Non-goals (v1)

- Full payments/billing automation beyond a minimal `status` gate.
- Real-time live scoring client SDKs (can come later; sockets optional).
- Full esports rulesets per game (map pools, bans/picks, etc.) beyond a minimal validation baseline.

## 3) Tenancy model

### Tenancy rules

- Every request must resolve to an `accountId`.
- **Primary auth**: `x-api-key` maps to an account.
- The service is designed as an **engine**: you send JSON, you get JSON back.
- **No database persistence in v1**: all operations are stateless, request → response.

### Suggested entities (SaaS-minimal)

- `Account`: id, name, email, status (`active|paused|disabled`), createdAt.
- `ApiKey`: id, accountId, name (optional), prefix (for display), hash, lastUsedAt, revokedAt, createdAt.

Everything else (tournaments, participants, brackets, matches, prizes) can be treated as **request payload + response payload** in v1.

## 4) API conventions (recommended)

### Versioning

- Prefix all routes with `/v1/...`.

### Request/trace metadata

- Accept `x-request-id` (generate if missing); return it in responses.

### Idempotency

- For create/commit endpoints, support `Idempotency-Key` header.

### Errors

Return a stable error shape:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "seed must be an integer",
    "details": [{ "path": "participants[0].seed", "issue": "Expected integer" }]
  },
  "requestId": "..."
}
```

### Security / privacy

- API keys are **write-only**: store hash only; return plaintext once on creation.
- Mask keys in lists: `sk_live_abc123…xyz`.
- Log safely: **never log raw API keys**; log key id/prefix.

## 5) Endpoint catalog

The following endpoints are organized by feature domain.

**Key assumptions:**

- Most endpoints are **account-scoped** and require `x-api-key`.
- All endpoints are **stateless, JSON-in/JSON-out**: no database, pure computation.

---

### Auth / Accounts

| Endpoint                                         | Purpose                | Notes                                                                   | Time         |
| ------------------------------------------------ | ---------------------- | ----------------------------------------------------------------------- | ------------ |
| `POST /v1/accounts`                              | Create a SaaS account  | Minimal fields: name, email, status. Typically **admin/internal** only. | 0.5–1 day    |
| `POST /v1/accounts/:accountId/api-keys`          | Generate API key       | Store hash only; return plaintext once. Auth: **admin/internal**.       | 1 day        |
| `GET /v1/accounts/:accountId/api-keys`           | List API keys (masked) | Dashboard/debug. Auth: **admin/internal**.                              | 0.5 day      |
| `DELETE /v1/accounts/:accountId/api-keys/:keyId` | Revoke API key         | Soft-delete or mark revoked. Auth: **admin/internal**.                  | 0.25–0.5 day |
| **Auth hook** (Fastify)                          | Validate `x-api-key`   | Attach `account` to request. Centralized 401 + rate-limit keying.       | 1 day        |

### Platform / Meta

| Endpoint          | Purpose               | Notes                                                            | Time     |
| ----------------- | --------------------- | ---------------------------------------------------------------- | -------- |
| `GET /v1/health`  | Health check          | Usually **public** (no auth). For uptime monitors.               | 0.25 day |
| `GET /v1/meta`    | Service metadata      | Version, build, env. Public or auth-gated.                       | 0.25 day |
| `GET /v1/games`   | Supported games/modes | Auth: `x-api-key` or public. Config-driven.                      | 0.5 day  |
| `GET /v1/formats` | Supported formats     | `single_elim`, `double_elim`, `round_robin`, `swiss` (optional). | 0.5 day  |

### Tournaments

| Endpoint                      | Purpose                         | Notes                                                    | Time       |
| ----------------------------- | ------------------------------- | -------------------------------------------------------- | ---------- |
| `POST /v1/tournaments/create` | Create a new tournament         | Auth: `x-api-key`. Initialize tournament with config.    | 1–1.5 days |
| `POST /v1/tournaments/plan`   | Normalize tournament definition | Auth: `x-api-key`. Output canonical rules + constraints. | 1.5–2 days |
| `POST /v1/tournaments/seed`   | Seed participants               | Auth: `x-api-key`. Strategies: rank, random, regions.    | 1–1.5 days |

### Brackets – Single Elimination

| Endpoint                            | Purpose          | Notes                                                    | Time     |
| ----------------------------------- | ---------------- | -------------------------------------------------------- | -------- |
| `POST /v1/brackets/single/generate` | Generate bracket | Pairing, byes, round structure. JSON-in/JSON-out, no DB. | 2–3 days |
| `POST /v1/brackets/single/update`   | Apply results    | Propagate winners, detect champion.                      | 2 days   |

### Brackets – Double Elimination

| Endpoint                            | Purpose          | Notes                                                       | Time     |
| ----------------------------------- | ---------------- | ----------------------------------------------------------- | -------- |
| `POST /v1/brackets/double/generate` | Generate bracket | Upper/lower bracket mapping, byes. JSON-in/JSON-out, no DB. | 2–3 days |
| `POST /v1/brackets/double/update`   | Apply results    | Losers drop, grand finals, reset rule.                      | 2–3 days |

### Brackets – Groups / Round Robin

| Endpoint                            | Purpose                   | Notes                                                    | Time     |
| ----------------------------------- | ------------------------- | -------------------------------------------------------- | -------- |
| `POST /v1/brackets/groups/generate` | Generate group stage      | Assign groups, compute matches. JSON-in/JSON-out, no DB. | 2–3 days |
| `POST /v1/brackets/groups/update`   | Apply results & standings | Tie-break rules, head-to-head.                           | 2 days   |

### Brackets – Swiss (optional v1)

| Endpoint                             | Purpose                   | Notes                                         | Time     |
| ------------------------------------ | ------------------------- | --------------------------------------------- | -------- |
| `POST /v1/brackets/swiss/generate`   | Generate round 1 pairings | Initial Swiss setup. Can defer if too heavy.  | 2–3 days |
| `POST /v1/brackets/swiss/next-round` | Compute next round        | Avoid repeats, score brackets, pairing rules. | 3–4 days |

### Matches

| Endpoint                           | Purpose                  | Notes                                         | Time       |
| ---------------------------------- | ------------------------ | --------------------------------------------- | ---------- |
| `POST /v1/matches/validate-result` | Validate score structure | Check best-of, no invalid scores.             | 1 day      |
| `POST /v1/matches/apply-result`    | Validate + apply result  | Returns bracket/standing changes.             | 1–1.5 days |
| `POST /v1/matches/schedule`        | Schedule matches         | Time windows, BO3/BO5, max parallel per team. | 2–3 days   |

### Rounds

| Endpoint                   | Purpose                    | Notes                                         | Time     |
| -------------------------- | -------------------------- | --------------------------------------------- | -------- |
| `POST /v1/rounds/generate` | Derive rounds from bracket | Bracket tree → list of rounds.                | 1 day    |
| `POST /v1/rounds/standing` | Compute standings          | After a given round. For groups/Swiss/league. | 2–3 days |

### Prizes

| Endpoint                   | Purpose                  | Notes                              | Time       |
| -------------------------- | ------------------------ | ---------------------------------- | ---------- |
| `POST /v1/prizes/allocate` | Compute prize allocation | % split, flat, mixed schemes.      | 1.5–2 days |
| `POST /v1/prizes/simulate` | Simulate prizes          | Same engine, marked as simulation. | 0.5 day    |

### Teams / Participants / Orgs / Users (Helpers)

| Endpoint                              | Purpose                     | Notes                              | Time       |
| ------------------------------------- | --------------------------- | ---------------------------------- | ---------- |
| `POST /v1/participants/normalize`     | Normalize participant shape | IDs, seed, mmr, teamId, metadata.  | 0.5–1 day  |
| `POST /v1/teams/validate`             | Validate rosters vs rules   | Min/max players, role constraints. | 1–1.5 days |
| `POST /v1/orgs/config/validate`       | Validate org config         | Limits, allowed formats.           | 1 day      |
| `POST /v1/users/permissions/evaluate` | Evaluate user permissions   | Roles + context → allowed actions. | 2–3 days   |

### Cross-cutting / Infrastructure

| Item                          | Purpose                       | Notes                                    | Time     |
| ----------------------------- | ----------------------------- | ---------------------------------------- | -------- |
| **Project setup & tooling**   | Initialize Fastify/TS project | Lint, tests, env, logger, error handler. | 3–4 days |
| **Rate limiting per API key** | Middleware/hook               | In-memory or Redis.                      | 1–2 days |
| **Docs & examples**           | OpenAPI spec + curl examples  | For clients + your internal Express app. | 1–2 days |

---

## 6) Definitions: bracket types (plain language)

- **Single elimination**: lose once → out. Simple tree, byes for non-power-of-two.
- **Double elimination**: lose once → drop to lower bracket; lose twice → out. Often has grand finals and possibly a "reset" match.
- **Groups / round robin**: everyone plays a set number of matches within a group; standings decide who advances.
- **Swiss**: pair teams with similar records each round; no full round robin, and usually no immediate elimination.

## 7) Recommended request/response shapes (examples)

### Create account

`POST /v1/accounts`

```json
{ "name": "Acme Esports", "email": "ops@acme.gg", "status": "active" }
```

Response:

```json
{ "account": { "id": "acc_...", "name": "Acme Esports", "status": "active" } }
```

### Create API key

`POST /v1/accounts/:accountId/api-keys`

```json
{ "name": "prod-key" }
```

Response (only time plaintext is returned):

```json
{
  "apiKey": {
    "id": "key_...",
    "prefix": "sk_live_abc123",
    "secret": "sk_live_abc123...FULL..."
  }
}
```

### Auth hook behavior

- Missing/invalid/revoked key → `401` with `error.code = "UNAUTHORIZED"`.
- Disabled/paused account → `403` with `error.code = "ACCOUNT_DISABLED"`.
- On success: attach `request.account` and `request.apiKeyId`.

## 8) Delivery roadmap (recommended)

### Phase 0 — SaaS foundation (week 1)

- Project setup/tooling, error format, logging, OpenAPI baseline.
- `/v1/health`, `/v1/meta`.
- Accounts + API key lifecycle + auth hook.
- Rate limiting per API key (simple) + audit logs for key usage.

**Exit criteria**: external client can authenticate and hit health/meta reliably; keys can be issued/revoked safely.

### Phase 1 — Tournament planning & seeding (week 2)

- `/v1/games`, `/v1/formats` (config-driven).
- `/v1/tournaments/plan` and `/v1/participants/normalize`.
- `/v1/tournaments/seed`.

**Exit criteria**: given participants + constraints, service returns a stable normalized config and seeded list.

### Phase 2 — Single elimination (weeks 3–4)

- `/v1/brackets/single/generate` + `/update`.
- `/v1/matches/validate-result` + `/apply-result`.

**Exit criteria**: clients can run a full single-elim tournament end-to-end (compute bracket, apply results).

### Phase 3 — Double elimination + groups (weeks 5–6)

- Double elimination generation/update.
- Groups generation/update + standings.
- `/v1/rounds/generate` + `/v1/rounds/standing`.

### Phase 4 — Scheduling + prizes + docs polish (weeks 7–8)

- Match scheduling constraints.
- Prize allocation/simulation.
- Docs/examples, hardening (load tests, timeouts, edge cases).

### Phase 5 — Swiss (optional)

- Swiss is feasible, but it's pairing-rule heavy; treat as an add-on milestone.

## 9) Operational considerations (SaaS)

- **Observability**: request logs (redacted), structured errors, metrics per endpoint/key, tracing.
- **Abuse protection**: rate limit + payload size limits; blocklist compromised keys.
- **Backwards compatibility**: additive changes only within v1; breaking changes → v2.
- **Data retention**: define retention for matches/results and whether customers can delete tournaments.

## 10) Open questions (worth deciding early)

- Do tournaments/brackets/matches persist in DB in v1, or is this an "engine-only" stateless API?
- Preferred ID format: UUID vs prefixed IDs (`acc_`, `tourn_`, `match_`).
- Do we want **game-specific rules** in v1 or generic best-of validation only?
- Will we support **partial updates** or only "apply result" events?
- Do we need staff/admin auth separate from customer API keys?

---

## Feedback & Notes

**Timeline Flexibility**: If the negotiation process requires additional time, we are prepared to extend our deadline to ensure proper alignment and delivery quality.

**Database Transaction Responsibility**: If we take charge of handling the database transactions, this will introduce a different deadline concept. The provided endpoints are arranged in order to handle that responsibility accordingly.
