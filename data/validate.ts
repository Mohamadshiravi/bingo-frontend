/** Run with `bun run data/validate.ts`; no test framework or app runtime required. */
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import {
  accountFixtures,
  calculatePromotionEstimate,
  generateAccountProfile,
  getAccountPreview,
  getPlanFeatureLabel,
  MAX_DEMO_AUDIENCE,
  mediaManifest,
  missingMedia,
  normalizeAudienceSize,
  normalizeUsername,
  planFeatureContent,
  promoterPlans,
  promotionRules,
} from "./index";
import type { AccountProfile, SocialNetwork } from "./contracts";

const networks: SocialNetwork[] = ["instagram", "youtube"];
const available = Object.values(mediaManifest);
const localPaths = new Set<string>(available.map((media) => media.url));

function validateProfile(profile: AccountProfile, network: SocialNetwork): void {
  assert.deepEqual(Object.keys(profile).sort(), ["handle", "display_name", "avatar_url", "follower_count", "post_count", "is_private", "last_post"].sort());
  assert.equal(profile.handle, normalizeUsername(profile.handle));
  assert.ok(profile.display_name.length > 0);
  assert.ok(localPaths.has(profile.avatar_url));
  for (const count of [profile.follower_count, profile.post_count]) {
    assert.ok(Number.isSafeInteger(count) && count >= 0);
  }
  assert.equal(typeof profile.is_private, "boolean");
  if (profile.is_private || profile.post_count === 0) assert.equal(profile.last_post, null);
  if (profile.last_post) {
    assert.ok(profile.post_count > 0);
    const media = available.find((item) => item.url === profile.last_post?.url);
    assert.equal(media?.kind, profile.last_post.kind);
    if (profile.last_post.thumbnail_url) assert.ok(localPaths.has(profile.last_post.thumbnail_url));
    if (profile.last_post.kind === "video") assert.equal(profile.last_post.thumbnail_url, null);
    if (network === "youtube") assert.equal(profile.last_post.kind, "video");
  }
}

for (const media of available) {
  assert.equal(media.url, `/${media.source_file.slice("public/".length)}`);
  assert.ok(existsSync(fileURLToPath(new URL(`../${media.source_file}`, import.meta.url))), `Missing local media: ${media.source_file}`);
}
for (const missing of missingMedia) assert.ok(!("url" in missing));

let generatedCount = 0;
for (const network of networks) {
  const fixtures = accountFixtures[network];
  assert.ok(fixtures.length >= 3);
  assert.equal(new Set(fixtures.map((profile) => profile.handle)).size, fixtures.length);
  assert.ok(fixtures.some((profile) => profile.post_count === 0));
  assert.ok(fixtures.some((profile) => profile.last_post?.kind === "video"));
  for (const fixture of fixtures) {
    validateProfile(fixture, network);
    const response = getAccountPreview({ network, handle: ` @${fixture.handle.toUpperCase()} ` });
    assert.deepEqual(Object.keys(response), ["data"]);
    assert.deepEqual(response.data, fixture);
    response.data.display_name = "Changed by a consumer";
    if (response.data.last_post) response.data.last_post.url = "/consumer-change";
    assert.deepEqual(generateAccountProfile(network, fixture.handle), fixture);
  }
  for (let index = 0; index < 1000; index++) {
    const handle = `demo_creator_${index}`;
    const first = generateAccountProfile(network, handle);
    assert.deepEqual(generateAccountProfile(network, ` @${handle.toUpperCase()} `), first);
    validateProfile(first, network);
    generatedCount++;
  }
  for (const invalid of ["", "@", "has space", "https://example.com/user", "bad/name"]) {
    assert.throws(() => generateAccountProfile(network, invalid), TypeError);
  }
}
assert.ok(accountFixtures.instagram.some((profile) => profile.is_private));
assert.ok(accountFixtures.instagram.some((profile) => profile.last_post?.kind === "image"));
assert.notDeepEqual(generateAccountProfile("instagram", "same.user"), generateAccountProfile("youtube", "same.user"));
assert.equal(normalizeUsername("  @ＣＯＤＥ  "), "code");
validateProfile(generateAccountProfile("youtube", "@آموزش_برنامه‌نویسی".replace("‌", "")), "youtube");
validateProfile(generateAccountProfile("youtube", "@日本語チャンネル"), "youtube");
validateProfile(generateAccountProfile("instagram", "a".repeat(30)), "instagram");
assert.throws(() => generateAccountProfile("instagram", "a".repeat(31)), TypeError);

assert.deepEqual(calculatePromotionEstimate({ network: "instagram", audience_size: 300 }), {
  data: {
    total_cost_minor: 321000,
    action_mix: [
      { action: "like", estimated_quantity: 90 },
      { action: "comment", estimated_quantity: 12 },
      { action: "reply_story", estimated_quantity: 6 },
      { action: "view", estimated_quantity: 360 },
      { action: "view_story", estimated_quantity: 180 },
      { action: "share", estimated_quantity: 9 },
      { action: "share_to_story", estimated_quantity: 3 },
    ],
  },
});
assert.deepEqual(calculatePromotionEstimate({ network: "youtube", audience_size: 300 }), {
  data: {
    total_cost_minor: 439500,
    action_mix: [
      { action: "like", estimated_quantity: 45 },
      { action: "comment", estimated_quantity: 6 },
      { action: "view", estimated_quantity: 240 },
      { action: "watch", estimated_quantity: 720 },
    ],
  },
});

const audienceCases = [-100, 0, 1, 259, 260, 300, 300.9, 10000, MAX_DEMO_AUDIENCE, Number.MAX_VALUE, NaN, Infinity, -Infinity];
for (const network of networks) {
  for (const audience of audienceCases) {
    const request = { network, audience_size: audience, goal: "smart" as const, country: "IR" };
    const response = calculatePromotionEstimate(request);
    assert.deepEqual(response, calculatePromotionEstimate(request));
    assert.deepEqual(Object.keys(response), ["data"]);
    assert.deepEqual(Object.keys(response.data).sort(), ["action_mix", "total_cost_minor"]);
    assert.deepEqual(response.data.action_mix.map((item) => item.action), Object.keys(promotionRules[network]));
    assert.ok(Number.isSafeInteger(response.data.total_cost_minor) && response.data.total_cost_minor >= 0);
    let expectedCost = 0;
    for (const item of response.data.action_mix) {
      assert.deepEqual(Object.keys(item).sort(), ["action", "estimated_quantity"]);
      const rule = Object.entries(promotionRules[network]).find(([action]) => action === item.action)?.[1];
      assert.ok(rule);
      assert.equal(item.estimated_quantity, Math.floor(normalizeAudienceSize(audience) * rule.quantity_per_member));
      assert.ok(Number.isSafeInteger(item.estimated_quantity) && item.estimated_quantity >= 0);
      expectedCost += item.estimated_quantity * rule.unit_cost_minor;
    }
    assert.equal(response.data.total_cost_minor, expectedCost);
    assert.equal(response.data.total_cost_minor % 10, 0);
    // Match the exact current CalculatorInfo.tsx adapter, including zero.
    assert.equal(+String(response.data.total_cost_minor).replace(/0$/, ""), expectedCost / 10);
  }
  let previousCost = -1;
  for (let size = 0; size <= 10000; size += 17) {
    const cost = calculatePromotionEstimate({ network, audience_size: size }).data.total_cost_minor;
    assert.ok(cost >= previousCost);
    previousCost = cost;
  }
}

assert.equal(new Set(promoterPlans.data.map((item) => item.plan.id)).size, promoterPlans.data.length);
for (const tier of ["free", "pro"]) {
  const item = promoterPlans.data.find((entry) => entry.plan.tier === tier);
  assert.ok(item);
  assert.ok(item.plan.display_name?.en && item.plan.display_name.fa);
  assert.ok(item.plan.description?.en && item.plan.description.fa);
  assert.ok(item.variants?.length);
  assert.ok(item.variants[item.default_variant_index ?? 0]);
  for (const variant of item.variants) {
    assert.ok(variant.currency && Number.isSafeInteger(variant.price_minor));
    assert.ok((variant.price_minor ?? -1) >= 0);
    assert.equal(variant.price_minor === 0, tier === "free");
  }
  assert.ok(item.variants.some((variant) => variant.currency === "IRR"));
  for (const feature of item.plan.features ?? []) {
    assert.ok(Object.hasOwn(planFeatureContent, feature));
    assert.notEqual(getPlanFeatureLabel(feature, "en-US"), feature);
    assert.notEqual(getPlanFeatureLabel(feature, "fa-IR"), feature);
  }
}
assert.equal(getPlanFeatureLabel("unknown", "fa-IR"), "unknown");
console.log(`Mock foundation validated: 7 fixtures, ${generatedCount} generated profiles, ${networks.length * audienceCases.length} pricing edge cases, monotonic pricing, 2 plans, ${available.length} local media files.`);