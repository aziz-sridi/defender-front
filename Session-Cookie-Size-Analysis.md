# 🔍 Session Cookie Size Analysis — Root Cause Documentation

**Date:** February 15, 2026  
**Status:** ⚠️ Warning (functional, but at risk)  
**Affected File:** `src/lib/api/auth.ts` (lines 117-161)

---

## 1. The Error

```
[next-auth][debug][CHUNKING_SESSION_COOKIE] {
  message: 'Session cookie exceeds allowed 4096 bytes.',
  emptyCookieSize: 163,
  valueSize: 3969,
  chunks: [ 4096, 199 ]
}
```

- **Cookie overhead (name, flags, etc.):** 163 bytes
- **Encrypted JWT value:** 3,969 bytes
- **Total per-cookie:** 4,132 bytes → exceeds the **4,096 byte** browser cookie limit
- **NextAuth auto-chunks into:** 2 cookies (`next-auth.session-token.0` = 4,096 bytes, `next-auth.session-token.1` = 199 bytes)

---

## 2. Root Cause — NOT Image Buffering

**❌ This is NOT caused by image URLs or image buffering.**

The `fetch failed` error for `api-dev.defendr.ggtournament` and the `/_next/image` 500 errors are **separate issues** (DNS resolution failure for the image CDN). They do NOT affect the session cookie size.

**✅ The actual root cause is: the ENTIRE `User` object from the backend API is stored in the JWT session cookie.**

---

## 3. The Data Flow (How the Cookie Gets Bloated)

```
┌─────────────────────────────────────────────────────────┐
│  Step 1: User logs in via /user/signinplayer             │
│  Backend returns: { user: { FULL USER OBJECT }, token }  │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│  Step 2: authorize() callback (auth.ts:45-79)            │
│  Returns: { ...data.user, accessToken: data.token }      │
│  ➜ Spreads ALL 57+ user fields into the return value     │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│  Step 3: jwt() callback (auth.ts:118-161)                │
│  Line 122: token.accessToken = user.accessToken          │
│  Line 124: token.user = { ...userWithAccessToken }       │
│  ➜ ENTIRE user object (including accessToken AGAIN)      │
│    is stored on the JWT token                            │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│  Step 4: NextAuth encrypts JWT → sets as cookie          │
│  JWT payload ≈ 3,969 bytes encrypted                     │
│  Cookie total ≈ 4,132 bytes → EXCEEDS 4,096 LIMIT       │
│  ➜ NextAuth CHUNKS into 2 cookies                        │
└─────────────────────────────────────────────────────────┘
```

---

## 4. What's Inside the User Object (Size Breakdown)

The `User` type (`src/types/userType.ts`) has **57+ fields**. Here's a breakdown of the biggest offenders:

### 🔴 Critical (High byte cost, low session value)

| Field                                | Type                                            | Estimated Size   | Why It's a Problem                                                                                                 |
| ------------------------------------ | ----------------------------------------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------ |
| `accessToken`                        | `string` (JWT)                                  | ~500-800 bytes   | **Stored TWICE**: once on `token.accessToken` AND inside `token.user.accessToken`                                  |
| `connectedAcc`                       | Nested object (8 platforms)                     | ~200-600 bytes   | Contains OAuth secrets (`access_token`, `refresh_token`) for Riot, BattleNet, Epic — **security risk** in a cookie |
| `connectedAcc.riot.access_token`     | OAuth token                                     | ~150-300 bytes   | Third-party OAuth token stored in browser cookie                                                                   |
| `connectedAcc.riot.refresh_token`    | OAuth token                                     | ~150-300 bytes   | Third-party OAuth **refresh** token in browser cookie                                                              |
| `connectedAcc.battleNet.accessToken` | OAuth token                                     | ~100-200 bytes   | Third-party OAuth token in browser cookie                                                                          |
| `connectedAcc.epicGames.accessToken` | OAuth token                                     | ~100-200 bytes   | Third-party OAuth token in browser cookie                                                                          |
| `favoriteGames`                      | `Game[]` (with `igdbData: Record<string, any>`) | ~200-1000+ bytes | Full game objects with arbitrary IGDB API data                                                                     |
| `following`                          | `string[]` (User IDs)                           | ~100-500+ bytes  | Grows with social activity                                                                                         |
| `followers`                          | `string[]` (User IDs)                           | ~100-500+ bytes  | Grows with social activity                                                                                         |
| `bluePoints`                         | `BluePoints[]` (per-game stats)                 | ~100-500 bytes   | Array that grows with games played                                                                                 |
| `teams`                              | `string[]`                                      | ~100-300 bytes   | Array of team IDs                                                                                                  |
| `redeemed`                           | `string[]`                                      | ~50-200 bytes    | Array of redeemed item IDs                                                                                         |
| `password`                           | `string` (hashed)                               | ~60-80 bytes     | **Hashed password stored in browser cookie — SECURITY VULNERABILITY**                                              |

### 🟡 Medium (Adds up but may be needed)

| Field                  | Type                   | Estimated Size |
| ---------------------- | ---------------------- | -------------- |
| `gameProfiles`         | `GameProfile[]`        | ~100-300 bytes |
| `socialMediaLinks`     | Object (5 fields)      | ~50-200 bytes  |
| `userInventory`        | Object (3 arrays)      | ~50-200 bytes  |
| `adress`               | Object (4 fields)      | ~50-100 bytes  |
| `notificationSettings` | Object (3 booleans)    | ~30-50 bytes   |
| `joinedOrganizations`  | `JoinedOrganization[]` | ~50-200 bytes  |

### 🟢 Low (Essential for session, small size)

| Field             | Type           | Estimated Size |
| ----------------- | -------------- | -------------- |
| `_id`             | `string`       | ~24 bytes      |
| `email`           | `string`       | ~20-40 bytes   |
| `nickname`        | `string`       | ~10-30 bytes   |
| `profileImage`    | `string` (URL) | ~40-80 bytes   |
| `roles`           | `string[]`     | ~20-40 bytes   |
| `organization`    | `string`       | ~24 bytes      |
| `membershipLevel` | `string`       | ~10-20 bytes   |
| `verifmail`       | `boolean`      | ~5 bytes       |
| `activated`       | `boolean`      | ~5 bytes       |

---

## 5. Which `session.user` Fields Are Actually Used Client-Side?

After searching the entire codebase, here are the fields accessed from `session.user`:

| Field                 | Where Used                                                                      |
| --------------------- | ------------------------------------------------------------------------------- |
| `_id`                 | Everywhere (IDs for API calls, routing, socket connections)                     |
| `email`               | `verifmail/page.tsx`                                                            |
| `nickname`            | Navigation, user display                                                        |
| `profileImage`        | Avatar display                                                                  |
| `roles`               | `ManageParticipants.tsx` (admin check)                                          |
| `organization`        | Tournament setup                                                                |
| `joinedOrganizations` | Organization hub                                                                |
| `teams`               | `JoinTournament/index.tsx`                                                      |
| `following`           | `TournamentOverview/index.tsx`                                                  |
| `favoriteGames`       | `home/index.tsx` (only used as IDs, not full objects)                           |
| `accessToken`         | `battleNet/oauth/callback/page.tsx` (redundant — same as `session.accessToken`) |
| `connectedAcc`        | `ConnectAccountForm/index.tsx` (Riot ID, Mobile Legends)                        |
| `socialMediaLinks`    | `ConnectAccountForm/index.tsx` (Discord)                                        |
| `verifmail`           | Verification banner                                                             |
| `membershipLevel`     | Premium checks                                                                  |

### Fields that are NEVER accessed from session but still stored:

- `password` ❌
- `bluePoints` ❌
- `redPoints` ❌
- `souls` ❌
- `currency` ❌
- `country` ❌
- `adress` ❌
- `notificationSettings` ❌
- `userInventory` ❌
- `coverImage` ❌
- `fullname` / `firstName` / `lastName` ❌
- `sex` ❌
- `datenaiss` ❌
- `user_bio` / `link_bio` ❌
- `achieved` ❌
- `stripeCustomId` ❌
- `balance` ❌
- `otp` ❌
- `googleId` / `twitchId` / `discordId` / `facebookId` ❌
- `oauthEmail` / `provider` ❌
- `lastLogin` / `lastLoginIP` ❌
- `redeemed` ❌
- `followers` ❌ (note: `following` IS used, `followers` is NOT)
- `createdAt` / `updatedAt` ❌
- `connectedAcc.*.accessToken` (OAuth tokens) ❌
- `connectedAcc.*.refresh_token` ❌

---

## 6. Security Concerns

Beyond the size issue, storing the full user object in a JWT cookie creates security risks:

1. **🔴 Hashed password in cookie** — `password` field from backend is stored in the JWT
2. **🔴 Third-party OAuth tokens in cookie** — Riot `access_token`/`refresh_token`, BattleNet `accessToken`, Epic `accessToken` are stored in the browser cookie
3. **🟡 Stripe customer ID in cookie** — `stripeCustomId` is exposed
4. **🟡 IP address in cookie** — `lastLoginIP` is stored

Even though the JWT is encrypted, these sensitive values should never leave the server.

---

## 7. Recommended Fix

### Option A: Slim JWT (Recommended — Minimal Code Change)

In `src/lib/api/auth.ts`, modify the `jwt` callback to only store essential fields:

```typescript
// Before (line 124):
token.user = { ...userWithAccessToken }

// After:
token.user = {
  _id: userWithAccessToken._id,
  email: userWithAccessToken.email,
  nickname: userWithAccessToken.nickname,
  profileImage: userWithAccessToken.profileImage,
  roles: userWithAccessToken.roles,
  organization: userWithAccessToken.organization,
  joinedOrganizations: userWithAccessToken.joinedOrganizations,
  teams: userWithAccessToken.teams,
  membershipLevel: userWithAccessToken.membershipLevel,
  membershipPeriod: userWithAccessToken.membershipPeriod,
  verifmail: userWithAccessToken.verifmail,
  activated: userWithAccessToken.activated,
  following: userWithAccessToken.following,
  // Strip sensitive OAuth tokens from connectedAcc
  connectedAcc: userWithAccessToken.connectedAcc
    ? {
        Riotgames: userWithAccessToken.connectedAcc.Riotgames
          ? {
              riotid: userWithAccessToken.connectedAcc.Riotgames.riotid,
              tagline: userWithAccessToken.connectedAcc.Riotgames.tagline,
            }
          : undefined,
        mobileLegends: userWithAccessToken.connectedAcc.mobileLegends,
        battleNet: userWithAccessToken.connectedAcc.battleNet
          ? {
              battletag: userWithAccessToken.connectedAcc.battleNet.battletag,
              region: userWithAccessToken.connectedAcc.battleNet.region,
            }
          : undefined,
        steam: userWithAccessToken.connectedAcc.steam
          ? {
              steamId: userWithAccessToken.connectedAcc.steam.steamId,
              username: userWithAccessToken.connectedAcc.steam.username,
            }
          : undefined,
      }
    : undefined,
  socialMediaLinks: userWithAccessToken.socialMediaLinks
    ? { discord: userWithAccessToken.socialMediaLinks.discord }
    : undefined,
  // favoriteGames: store only IDs, not full Game objects
  favoriteGames: userWithAccessToken.favoriteGames?.map(g => (typeof g === 'string' ? g : g._id)),
} as unknown as User
```

**Estimated savings: ~1,500–2,500 bytes** → cookie drops to ~1,500–2,500 bytes (well under 4,096).

### Option B: Database Session Strategy (Bigger Change)

Switch from JWT strategy to database sessions in `authOptions`:

```typescript
session: {
  strategy: 'database', // instead of 'jwt'
}
```

This stores session data server-side and only sends a short session ID cookie (~50 bytes). Requires a database adapter (e.g., `@next-auth/mongodb-adapter`).

---

## 8. Why the Cookie Still Works (For Now)

NextAuth's chunking mechanism splits the cookie:

```
next-auth.session-token.0 = <4096 bytes>
next-auth.session-token.1 = <199 bytes>
```

This works in modern browsers, but risks:

- **CDN/proxy header size limits** (some have 8KB total header limit)
- **Cookie count limits** (older browsers limit cookies per domain)
- **Performance** (larger cookies = more data on EVERY request)
- **Will break when user data grows** (more followers, teams, games, connected accounts → bigger JWT → more chunks → eventual failure)

---

## 9. Quick Summary

| Question                         | Answer                                                                         |
| -------------------------------- | ------------------------------------------------------------------------------ |
| Is it from image buffering/URLs? | **No.** The image errors are a separate DNS issue.                             |
| What causes the cookie bloat?    | The **entire User object** (57+ fields) is stored in the JWT cookie.           |
| Is it dangerous?                 | **Yes** — sensitive data (password hash, OAuth tokens) in browser cookie.      |
| Will it get worse?               | **Yes** — as users gain followers, teams, games, the cookie will keep growing. |
| What's the fix?                  | Only store ~15 essential fields instead of all 57+ in the JWT.                 |
