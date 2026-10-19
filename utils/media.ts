import { mediaManifest } from "@/data/media";

export type MediaKind = "image" | "video";
export const FALLBACK_IMAGE = mediaManifest.logo.url;

const localMedia = new Map<string, MediaKind>(
  Object.values(mediaManifest).map((media) => [media.url, media.kind]),
);
const imageExtension = /\.(avif|gif|ico|jpe?g|png|svg|webp)$/i;
const videoExtension = /\.(mp4|webm|ogv|mov|m4v)$/i;

/** Public paths and direct HTTPS URLs only. Never depends on a backend origin. */
export function resolveMediaUrl(value: unknown, kind: MediaKind): string | undefined {
  if (typeof value !== "string" || !value.trim()) return undefined;
  const source = value.trim();
  if (/[\\\u0000-\u0020]/.test(source)) return undefined;
  let url: URL;
  try {
    url = new URL(source, "https://local.invalid");
  } catch {
    return undefined;
  }
  if (url.pathname.replace(/\/$/, "").endsWith("/image-proxy")) return undefined;
  if (source.startsWith("/") && !source.startsWith("//")) {
    return localMedia.get(url.pathname) === kind ? source : undefined;
  }
  if (!/^https:\/\//i.test(source) || url.protocol !== "https:" || url.username || url.password) {
    return undefined;
  }
  // Signed/extensionless CDN URLs remain intact; obvious type mismatches do not.
  if (kind === "video" && imageExtension.test(url.pathname)) return undefined;
  if (kind === "image" && videoExtension.test(url.pathname)) return undefined;
  return source;
}

export function resolveImageUrl(value: unknown): string {
  return resolveMediaUrl(value, "image") ?? FALLBACK_IMAGE;
}

export function resolvePostMedia(post: unknown): {
  type: MediaKind;
  src: string;
  poster?: string;
} | null {
  if (!post || typeof post !== "object") return null;
  const { kind, url, thumbnail_url: thumbnail } = post as Record<string, unknown>;
  if (kind !== "image" && kind !== "video") return null;
  const src =
    kind === "video"
      ? resolveMediaUrl(url, "video")
      : resolveMediaUrl(thumbnail, "image") ?? resolveMediaUrl(url, "image");
  return src
    ? {
        type: kind,
        src,
        poster: kind === "video" ? resolveMediaUrl(thumbnail, "image") : undefined,
      }
    : null;
}