# Phase 1: mock data foundation

This directory is standalone data and pure calculation code. It is **not wired
into the application**: no UI, API calls, proxy behavior, cookies, styles, or
animations have been changed. No server, database, dependencies, or network
requests are introduced. Import application exports from `@/data`; do not import
`validate.ts` into the app.

## Contract sources

- `app/components/sections/Test.tsx`: account-preview body `{ handle, network }`,
  response `{ data: profile }`, shared Instagram/YouTube profile fields, nullable
  `last_post`, and `kind`/`thumbnail_url`/`url` media selection.
- `app/components/sections/CalculatorInfo.tsx`: estimate request and response
  `{ data: { total_cost_minor, action_mix: [{ action, estimated_quantity }] } }`.
  The view's `estimated_price`, ranges, and `max_interactions` are **derived UI
  state**, not backend response fields, so they are not added to the mock body.
- `app/careers/components/sections/Plans.tsx`: optional plan localization,
  string-array feature keys, optional currency variants and default index.

Only observed fields are modeled; the unavailable backend cannot establish any
additional undocumented fields. `InstagramProfile` and `YouTubeProfile` have the
same observed structure; network is supplied by the request, not an invented
profile response property. `MediaReference` describes local demo post media.

## Accounts

Seven fictional fixtures are preserved before fallback generation:

| Network | Handle | Scenario |
| --- | --- | --- |
| Instagram | `sara.studio` | Public image post, 12,840 followers |
| Instagram | `reza.travels` | Public video post, 248,600 followers |
| Instagram | `mina.private` | Private, 418 followers, no exposed media |
| Instagram | `new.creator` | Public, 26 followers, no posts |
| YouTube | `codewitharia` | Public video, 87,600 subscribers |
| YouTube | `dailywithnilo` | Public video, 1,250,000 subscribers |
| YouTube | `quietchannel` | Public empty channel, zero subscribers |

YouTube fixtures/generation are public: a private-account flag would misleadingly
imply Instagram-style private YouTube channels. Private Instagram accounts can
retain nonzero post counts but never expose last-post media.

`getAccountPreview({ network, handle })` returns the JSON body synchronously.
`generateAccountProfile(network, handle)` returns just the profile. Usernames are
trimmed, NFKC-normalized, stripped of leading `@`, and lowercased. These same rules
apply to fixture lookup and generation. URLs and whitespace within usernames are
rejected; callers handling social URLs must extract the handle first (as the
existing UI already does). Instagram allows ASCII letters, digits, underscores,
and dots (no repeated/trailing dots), up to 30 characters. YouTube accepts Unicode
letters/marks/numbers and common handle separators up to 100 code points. This is
a demo syntax guard, not a complete replica of platform eligibility policies.

Fallback fields use fixed unsigned FNV-1a hashes of `network:normalizedHandle` and
derived seeds. There is no clock, random state, locale dependency, or external
lookup. The same key gives identical fields across calls/runs; network is part of
the seed. Generated counts vary, some profiles have no posts, and approximately
one in seven generated Instagram accounts is private. Results copy nested media
so editing a returned profile cannot mutate fixtures. Exported fixture tables
should be treated as configuration, not mutated by consumers.

## Demo pricing assumptions

All prices are invented demonstration values, **not real quotes**. Estimates are
monthly, support the current `smart` goal, and use the same IRR schedule regardless
of country. Country is accepted for contract compatibility, not currency
conversion. Missing goal defaults conceptually to `smart`; no other goals are
modeled because none are used by the UI.

| Network | Action | Quantity per audience member | IRR per unit |
| --- | --- | ---: | ---: |
| Instagram | like | 0.30 | 1,000 |
| Instagram | comment | 0.04 | 5,000 |
| Instagram | reply_story | 0.02 | 4,000 |
| Instagram | view | 1.20 | 200 |
| Instagram | view_story | 0.60 | 200 |
| Instagram | share | 0.03 | 3,000 |
| Instagram | share_to_story | 0.01 | 4,000 |
| YouTube | like | 0.15 | 1,500 |
| YouTube | comment | 0.02 | 6,000 |
| YouTube | view | 0.80 | 500 |
| YouTube | watch | 2.40 | 300 |

`watch` means demo watch-minutes. Audience is floored, clamped to 0–1 billion;
NaN/infinities map to zero. Each quantity is `floor(audience * multiplier)` and
the total is the sum of quantity × unit price. All network actions are returned,
including zero quantities. Bounds keep totals safely integral, finite, and
nonnegative. No tax, discount, randomness, minimum charge, or exchange-rate logic
is applied. The UI's 260-audience minimum remains a UI rule; the foundation can
calculate smaller audiences and zero. Unsupported networks throw.

At audience 300: Instagram costs 321,000 IRR (32,100 toman); YouTube costs
439,500 IRR (43,950 toman). Every total is divisible by ten, preserving the
current calculator's trailing-zero IRR-to-toman conversion.

Free and Pro plans include `en`/`fa` names and descriptions, IRR and USD monthly
variants, and valid default indices. Free is zero; Pro is 2,990,000 IRR or 999
USD cents. These are independent demo prices, **not exchange-rate equivalents**.
Plan prices preserve `price_minor` unchanged, matching the existing plan UI
(which does not perform the calculator's conversion). Feature keys remain a
`string[]` for compatibility; `planFeatureContent` and `getPlanFeatureLabel` supply
English/Persian labels without changing that response contract or the UI.

## Media inventory and limitations

`mediaManifest` registers all 18 existing public media files, including the
landing hero/two clips and the separate careers explainer, app illustration,
and twelve numbered hero tiles. Section assignments are unchanged. Demo profiles
reuse the logo and landing media; dedicated portraits and video posters are absent.

`utils/media.ts` resolves registered root-relative public paths and direct HTTPS
URLs without a backend origin. Valid URLs retain query strings/signatures. Unknown
local paths, unsafe schemes, proxy endpoints, and obvious source-type mismatches
are rejected. Register new public assets in the manifest before using them.
`resolvePostMedia` never selects a thumbnail as a video source; a video thumbnail
is only a poster. Private and no-post profiles retain their existing UI branches.
The account handoff cookie stores the resolved avatar URL.

`components/ui/Media.tsx` preserves image/video layout props and handles load
errors. Images fall back to the local brand logo; videos fall back to their poster
or the logo, not another section's clip. External images load directly without
Next image-optimizer host restrictions. No new dependencies or downloads are used.

`missingMedia` inventories dedicated portraits/posters, the original external
no-post clip, nine marquee SVGs, and fifteen gallery photos without local copies.
The original external sources are preserved. During Phase 4 validation,
`assets.beenbo.com` failed DNS resolution from this environment; Picsum rejected
HEAD requests (405). Availability is therefore not guaranteed; load-error
fallbacks are provided. Imported `assets/icons/*.svg` remain bundled UI artwork.

The existing `public/landing/*` and `public/careers/*` assets were **untracked**
when this work started. Include them in deployment/version control; no media files
were created or downloaded. `tracked` records inventory status, not a live git
query. Both validators fail if a registered local asset is absent.

## Validation

From the repository root, run:

```sh
bun run data/validate.ts
bun run data/validate-media.ts
bun run lint
bunx tsc --noEmit
bun run build
```

The framework-free validator uses existing Node APIs and Bun's TypeScript runner.
It checks fixture schemas/media/count consistency, normalized fixture preservation,
returned-object isolation, 2,000 deterministic fallback profiles, Unicode and
invalid handles, network-specific actions, hand-calculated reference totals,
numeric edge cases, monotonic costs, existing calculator conversion compatibility,
localized plan content, variant indices, and every usable media file on disk.

### Implementation verification results

- Foundation validator: passed (7 fixtures, 2,000 generated profiles, 26 pricing
  edge cases, monotonic pricing, 2 plans, 4 existing local media files).
- `bunx eslint data`: passed.
- `bunx tsc --noEmit --incremental false`: passed (incremental output disabled to
  avoid changing unrelated build metadata).
- Repository-wide lint: blocked by the existing
  `react-hooks/preserve-manual-memoization` error in `components/ui/CardSwap.tsx`;
  also reports five existing image-element warnings outside this directory.
- Production build: attempted, but the existing `next/font` imports in
  `app/layout.tsx` could not fetch Inter and Teko from Google Fonts. No font or
  layout changes were made because they are outside this phase.