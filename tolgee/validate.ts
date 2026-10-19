import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { ALL_LANGUAGES, DEFAULT_LANGUAGE, TolgeeBase } from "./shared";

const originalFetch = globalThis.fetch;
let networkRequests = 0;
globalThis.fetch = (() => {
  networkRequests++;
  throw new Error("Localization must not use the network");
}) as typeof fetch;

const tolgee = TolgeeBase().init();

function entries(data: object, prefix = ""): [string, string][] {
  return Object.entries(data).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return typeof value === "string" ? [[path, value]] : entries(value, path);
  });
}

try {
  await tolgee.run();
  assert.equal(tolgee.getLanguage(), DEFAULT_LANGUAGE);
  assert.equal(tolgee.isDev(), false);

  let checked = 0;
  for (const language of [...ALL_LANGUAGES, DEFAULT_LANGUAGE]) {
    await tolgee.changeLanguage(language);
    assert.equal(tolgee.getLanguage(), language);
    const translations = JSON.parse(
      readFileSync(new URL(`../i18n/${language}.json`, import.meta.url), "utf8"),
    );
    for (const [key, value] of entries(translations)) {
      const params = { count: 100, followers: 2000 };
      const expected = value.replace(/\{(count|followers)\}/g, (_, name: keyof typeof params) => String(params[name]));
      assert.equal(tolgee.t(key, params), expected, `${language}: ${key}`);
      checked++;
    }
    assert.equal(tolgee.t("phase5.missing", "Local fallback"), "Local fallback");
  }

  assert.equal(networkRequests, 0);
  console.log(`Offline localization validated: ${checked} translations, language switching, missing-key fallback, no DevTools, zero fetch requests.`);
} finally {
  tolgee.stop();
  globalThis.fetch = originalFetch;
}