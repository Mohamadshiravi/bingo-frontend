/** Run with `bun run utils/mocks/validate.ts`; no additional test dependencies. */
import assert from "node:assert/strict";
import http from "node:http";
import https from "node:https";
import axios from "axios";
import { accountFixtures, getAccountPreview } from "../../data/accounts";
import { calculatePromotionEstimate } from "../../data/promotions";
import type { SocialNetwork } from "../../data/contracts";
import client from "../axios";
import { mockAdapter, MOCK_RESPONSE_DELAY_MS } from "./adapter";

let networkAttempts = 0;
const blockNetwork = (): never => {
  networkAttempts++;
  throw new Error("Mock requests must never reach a network transport");
};
const originalHttp = http.request;
const originalHttps = https.request;
const originalFetch = globalThis.fetch;
const originalXHR = globalThis.XMLHttpRequest;
http.request = blockNetwork;
https.request = blockNetwork;
globalThis.fetch = blockNetwork;
globalThis.XMLHttpRequest = class {
  constructor() { blockNetwork(); }
} as unknown as typeof XMLHttpRequest;

async function expectError(request: Promise<unknown>, status: number) {
  await assert.rejects(request, (error: unknown) => {
    assert.ok(axios.isAxiosError(error));
    assert.equal(error.code, axios.AxiosError.ERR_BAD_REQUEST);
    assert.equal(error.response?.status, status);
    assert.equal(typeof error.response?.data.message, "string");
    return true;
  });
}

async function expectCanceled(request: Promise<unknown>) {
  await assert.rejects(request, (error: unknown) => {
    assert.ok(axios.isCancel(error));
    assert.ok(axios.isAxiosError(error));
    assert.equal(error.code, "ERR_CANCELED");
    return true;
  });
}

try {
  assert.equal(client.defaults.adapter, mockAdapter);
  const networks: SocialNetwork[] = ["instagram", "youtube"];
  await Promise.all(networks.map(async (network) => {
    for (const fixture of accountFixtures[network]) {
      const res = await client.post("public/account-preview", {
        network, handle: ` @${fixture.handle.toUpperCase()} `,
      });
      assert.equal(res.status, 200);
      assert.deepEqual(res.data, { data: fixture });
      assert.equal(res.config.method, "post");
      assert.equal(res.headers["Content-Type"], "application/json");
    }

    const body = { network, handle: "arbitrary.creator_42" };
    const first = await client.post("/public/account-preview", body);
    const repeated = await client.post("public/account-preview", JSON.stringify(body));
    assert.deepEqual(first.data, getAccountPreview(body));
    assert.deepEqual(repeated.data, first.data);
    first.data.data.display_name = "Consumer mutation";
    assert.deepEqual((await client.post("/public/account-preview", body)).data, repeated.data);

    let previousTotal = -1;
    for (const audience_size of [0, 260, 300, 1000, 1000.8, 1e12]) {
      const payload = { network, audience_size, goal: "smart" as const, country: "IR" };
      const res = await client.post("/public/promotions/estimate", JSON.stringify(payload));
      assert.deepEqual(res.data, calculatePromotionEstimate(payload));
      const { total_cost_minor, action_mix } = res.data.data;
      assert.ok(Number.isSafeInteger(total_cost_minor) && total_cost_minor >= previousTotal);
      for (const item of action_mix) {
        assert.ok(Number.isSafeInteger(item.estimated_quantity) && item.estimated_quantity >= 0);
      }
      previousTotal = total_cost_minor;
    }
    const reference = await client.post("public/promotions/estimate", { network, audience_size: 300 });
    assert.equal(reference.data.data.total_cost_minor, network === "instagram" ? 321000 : 439500);
  }));

  await Promise.all([
    undefined, null, [], "not json", "null", "[]", "42", {},
    { network: "tiktok", handle: "creator" },
    ...[undefined, 123, "", "@", "has space", "bad/name", "https://example.com"].map((handle) => ({ network: "instagram", handle })),
    { network: "youtube", handle: "bad/name" },
  ].map((body) => expectError(client.post("/public/account-preview", body), 400)));
  await Promise.all([
    {}, { network: "tiktok", audience_size: 300 },
    ...[undefined, null, "300", NaN, Infinity].map((audience_size) => ({ network: "youtube", audience_size })),
    { network: "instagram", audience_size: 300, goal: "other" },
    { network: "instagram", audience_size: 300, country: 42 },
  ].map((body) => expectError(client.post("/public/promotions/estimate", body), 400)));

  await Promise.all([
    expectError(client.post("/unknown", {}), 404),
    expectError(client.get("/public/account-preview"), 404),
    expectError(client.post("https://unavailable.invalid/unknown", {}), 404),
    expectError(client.post("/public/promoter-plans", {}), 404),
  ]);
  const payload = { network: "instagram", handle: "sara.studio" };
  const normalized = await client.post("https://unavailable.invalid/public/account-preview/?demo=1", payload);
  assert.deepEqual(normalized.data, { data: accountFixtures.instagram[0] });

  const started = performance.now();
  await client.post("/public/account-preview", payload);
  assert.ok(performance.now() - started >= MOCK_RESPONSE_DELAY_MS - 10, "Response should be asynchronous with realistic latency");

  for (const endpoint of ["/public/account-preview", "/public/promotions/estimate", "/unknown"]) {
    const before = new AbortController();
    before.abort();
    await expectCanceled(client.post(endpoint, payload, { signal: before.signal }));

    const during = new AbortController();
    let adds = 0;
    let removes = 0;
    const add = during.signal.addEventListener.bind(during.signal);
    const remove = during.signal.removeEventListener.bind(during.signal);
    during.signal.addEventListener = (...args: Parameters<AbortSignal["addEventListener"]>) => { adds++; add(...args); };
    during.signal.removeEventListener = (...args: Parameters<AbortSignal["removeEventListener"]>) => { removes++; remove(...args); };
    const pending = client.post(endpoint, payload, { signal: during.signal });
    const checked = expectCanceled(pending);
    const timer = setTimeout(() => during.abort(), 25);
    await checked;
    clearTimeout(timer);
    assert.equal(adds, 1);
    assert.equal(removes, 1, "Cancellation must remove the abort listener");
  }

  const completed = new AbortController();
  const res = await client.post("/public/account-preview", payload, { signal: completed.signal });
  completed.abort();
  assert.equal(res.status, 200);
  const source = axios.CancelToken.source();
  const tokenRequest = client.post("/public/account-preview", payload, { cancelToken: source.token });
  const tokenCheck = expectCanceled(tokenRequest);
  source.cancel();
  await tokenCheck;

  assert.equal(networkAttempts, 0);
  console.log("Mock API validation passed: both networks, fixtures, generation, consistency, estimates, invalid requests, path normalization, delay, cancellation, and zero HTTP transport attempts.");
} finally {
  http.request = originalHttp;
  https.request = originalHttps;
  globalThis.fetch = originalFetch;
  if (originalXHR) globalThis.XMLHttpRequest = originalXHR;
  else Reflect.deleteProperty(globalThis, "XMLHttpRequest");
}