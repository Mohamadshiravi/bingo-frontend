import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { accountFixtures } from "./accounts";
import { mediaManifest } from "./media";
import { FALLBACK_IMAGE, resolveImageUrl, resolveMediaUrl, resolvePostMedia } from "../utils/media";

for (const media of Object.values(mediaManifest)) {
  assert.ok(existsSync(fileURLToPath(new URL(`../${media.source_file}`, import.meta.url))), media.source_file);
  assert.equal(resolveMediaUrl(media.url, media.kind), media.url);
  assert.equal(resolveMediaUrl(media.url, media.kind === "image" ? "video" : "image"), undefined);
}
for (const bad of [undefined, null, "", "javascript:alert(1)", "data:image/png;base64,x", "http://cdn.example/photo.jpg", "//cdn.example/photo.jpg", "/missing.jpg", "/image-proxy?url=test", "https://backend.example/image-proxy?url=test"]) {
  assert.equal(resolveMediaUrl(bad, "video"), undefined);
  assert.equal(resolveImageUrl(bad), FALLBACK_IMAGE);
}
for (const [kind, url] of [
  ["image", "https://cdn.example/photo.jpg?signature=a%2Fb&size=300#image"],
  ["video", "https://cdn.example/video.mp4?signature=a%2Fb"],
  ["video", "https://cdn.example/signed/stream?token=abc"],
] as const) assert.equal(resolveMediaUrl(url, kind), url);
assert.equal(resolveMediaUrl("https://cdn.example/post.jpg", "video"), undefined);
assert.equal(resolveMediaUrl("https://cdn.example/post.mp4", "image"), undefined);
assert.equal(resolveImageUrl("/logo/Logo.svg?v=1"), "/logo/Logo.svg?v=1");

const videoWithPoster = resolvePostMedia({ kind: "video", url: mediaManifest.sectionOne.url, thumbnail_url: mediaManifest.hero.url });
assert.equal(videoWithPoster?.src, mediaManifest.sectionOne.url);
assert.equal(videoWithPoster?.poster, mediaManifest.hero.url);
assert.equal(resolvePostMedia({ kind: "video", url: mediaManifest.hero.url, thumbnail_url: mediaManifest.hero.url }), null);
assert.equal(resolvePostMedia({ kind: "image", url: mediaManifest.hero.url, thumbnail_url: mediaManifest.sectionOne.url })?.src, mediaManifest.hero.url);
assert.equal(resolvePostMedia(null), null);
assert.equal(resolvePostMedia({ kind: "unknown", url: mediaManifest.hero.url }), null);

for (const profiles of Object.values(accountFixtures)) {
  for (const profile of profiles) {
    assert.equal(resolveImageUrl(profile.avatar_url), profile.avatar_url);
    const post = resolvePostMedia(profile.last_post);
    if (profile.is_private || profile.post_count === 0) assert.equal(post, null);
    if (profile.last_post) {
      assert.equal(post?.type, profile.last_post.kind);
      assert.equal(post?.src, profile.last_post.url);
    }
  }
}

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const preview = read("app/components/sections/Test.tsx");
assert.ok(preview.includes("avatar: resolveImageUrl("), "Handoff cookie uses the resolved avatar");
assert.ok(preview.includes("profile.is_private ? null : resolvePostMedia(profile.last_post)"));
assert.ok(preview.includes("!account?.is_private && ("), "No-post/private UI distinction remains");
assert.ok(!preview.includes("image-proxy") && !preview.includes("BACKEND_URL"));
assert.ok(read("app/components/sections/Beenbo.tsx").includes('src="/landing/section-1.mp4"'));
assert.ok(preview.includes("src={mediaManifest.sectionTwo.url}"));
assert.ok(preview.includes("https://assets.beenbo.com/videos/test-section-men.mp4"));
assert.ok(read("app/careers/components/sections/Beenbo.tsx").includes('src="/careers/section-1.mp4"'));
const careersHero = read("app/careers/components/sections/Hero.tsx");
for (let i = 1; i <= 12; i++) {
  const kind = [2, 4, 7, 9, 11].includes(i) ? "video" : "image";
  assert.ok(careersHero.includes(`{ src: "/careers/${i}.${kind === "video" ? "mp4" : "png"}", type: "${kind}" }`));
}
console.log("Phase 4 validated: 18 local assets, HTTPS preservation, invalid/mismatched sources, both networks, private/no-post profiles, handoff avatar, and section-specific assignments.");