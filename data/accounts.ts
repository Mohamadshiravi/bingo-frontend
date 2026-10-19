import type {
  AccountPreviewRequest,
  AccountPreviewResponse,
  AccountProfile,
  MediaReference,
  SocialNetwork,
} from "./contracts";
import { mediaManifest } from "./media";

const imagePost: MediaReference = {
  kind: "image",
  url: mediaManifest.hero.url,
  thumbnail_url: null,
};
const videoPost: MediaReference = {
  kind: "video",
  url: mediaManifest.sectionOne.url,
  thumbnail_url: null,
};

export const accountFixtures: Record<SocialNetwork, AccountProfile[]> = {
  instagram: [
    { handle: "sara.studio", display_name: "Sara Design Studio", avatar_url: mediaManifest.logo.url, follower_count: 12840, post_count: 186, is_private: false, last_post: imagePost },
    { handle: "reza.travels", display_name: "رضا | سفر و طبیعت", avatar_url: mediaManifest.logo.url, follower_count: 248600, post_count: 432, is_private: false, last_post: videoPost },
    { handle: "mina.private", display_name: "مینا احمدی", avatar_url: mediaManifest.logo.url, follower_count: 418, post_count: 67, is_private: true, last_post: null },
    { handle: "new.creator", display_name: "A Fresh Start", avatar_url: mediaManifest.logo.url, follower_count: 26, post_count: 0, is_private: false, last_post: null },
  ],
  youtube: [
    { handle: "codewitharia", display_name: "Code with Aria", avatar_url: mediaManifest.logo.url, follower_count: 87600, post_count: 124, is_private: false, last_post: videoPost },
    { handle: "dailywithnilo", display_name: "روزمره با نیلو", avatar_url: mediaManifest.logo.url, follower_count: 1250000, post_count: 368, is_private: false, last_post: { kind: "video", url: mediaManifest.sectionTwo.url, thumbnail_url: null } },
    { handle: "quietchannel", display_name: "Quiet Channel", avatar_url: mediaManifest.logo.url, follower_count: 0, post_count: 0, is_private: false, last_post: null },
  ],
};

export function normalizeUsername(username: string): string {
  return username.trim().normalize("NFKC").replace(/^@+/, "").toLowerCase();
}

/** Syntax guard only, not a claim that a real social account exists. No URL fetching. */
function validateHandle(network: SocialNetwork, handle: string): void {
  if (network !== "instagram" && network !== "youtube") {
    throw new RangeError("Unsupported demo network");
  }
  const valid = network === "instagram"
    ? /^[a-z0-9_.]+$/.test(handle) && !handle.endsWith(".") && !handle.includes("..") && handle.length <= 30
    : /^[\p{L}\p{M}\p{N}_.\-·]+$/u.test(handle) && [...handle].length <= 100;
  if (!valid) throw new TypeError("Enter a nonempty username, not a URL or whitespace");
}

/** Stable unsigned FNV-1a over UTF-16 code units; never uses time or randomness. */
function hashKey(key: string): number {
  let hash = 2166136261;
  for (let index = 0; index < key.length; index++) {
    hash = Math.imul(hash ^ key.charCodeAt(index), 16777619) >>> 0;
  }
  return hash;
}

function cloneProfile(profile: AccountProfile): AccountProfile {
  return { ...profile, last_post: profile.last_post ? { ...profile.last_post } : null };
}

export function generateAccountProfile(network: SocialNetwork, username: string): AccountProfile {
  const handle = normalizeUsername(username);
  validateHandle(network, handle);
  const fixture = accountFixtures[network].find((profile) => profile.handle === handle);
  if (fixture) return cloneProfile(fixture);

  const seed = hashKey(`${network}:${handle}`);
  const isPrivate = network === "instagram" && seed % 7 === 0;
  const postCount = seed % 11 === 0 ? 0 : 1 + hashKey(`${seed}:posts`) % 750;
  const lastPost = isPrivate || postCount === 0
    ? null
    : network === "youtube" || seed % 2 === 0 ? videoPost : imagePost;

  return {
    handle,
    display_name: handle.replace(/[._-]+/g, " ").replace(/\b[a-z]/g, (letter) => letter.toUpperCase()),
    avatar_url: mediaManifest.logo.url,
    follower_count: hashKey(`${seed}:followers`) % 1500001,
    post_count: postCount,
    is_private: isPrivate,
    last_post: lastPost ? { ...lastPost } : null,
  };
}

/** Returns the HTTP JSON body, not an Axios response. No existing request is replaced. */
export function getAccountPreview(request: AccountPreviewRequest): AccountPreviewResponse {
  return { data: generateAccountProfile(request.network, request.handle) };
}