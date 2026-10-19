"use client";

import Image, { type ImageProps } from "next/image";
import { useState, type ImgHTMLAttributes, type VideoHTMLAttributes } from "react";
import { FALLBACK_IMAGE, resolveImageUrl, resolveMediaUrl } from "@/utils/media";

/** Keep the same image element/layout, with a local fallback on load failure. */
export function MediaImage({ src, alt, onError, ...props }: ImageProps) {
  const resolved = typeof src === "string" ? resolveImageUrl(src) : src;
  const [failed, setFailed] = useState<ImageProps["src"]>();
  return (
    <Image
      {...props}
      alt={alt}
      src={failed === resolved ? FALLBACK_IMAGE : resolved}
      unoptimized={props.unoptimized || (typeof resolved === "string" && resolved.startsWith("https://"))}
      onError={(event) => {
        setFailed(resolved);
        onError?.(event);
      }}
    />
  );
}

export function MediaImg({ src, srcSet, alt = "", onError, ...props }: ImgHTMLAttributes<HTMLImageElement>) {
  const resolved = resolveImageUrl(src);
  const [failed, setFailed] = useState<string>();
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      {...props}
      alt={alt}
      src={failed === resolved ? FALLBACK_IMAGE : resolved}
      srcSet={failed === resolved ? undefined : srcSet}
      onError={(event) => {
        setFailed(resolved);
        onError?.(event);
      }}
    />
  );
}

/** A failed/missing clip becomes its poster, never an unrelated placeholder video. */
export function MediaVideo({ src, poster, className, onError, ...props }: Omit<VideoHTMLAttributes<HTMLVideoElement>, "children">) {
  const resolved = resolveMediaUrl(src, "video");
  const [failed, setFailed] = useState<string>();
  const image = resolveImageUrl(poster);
  if (!resolved || failed === resolved) {
    return <MediaImg src={image} alt="" className={className} />;
  }
  return (
    <video
      {...props}
      key={resolved}
      className={className}
      poster={resolveMediaUrl(poster, "image")}
      onError={(event) => {
        setFailed(resolved);
        onError?.(event);
      }}
    >
      <source src={resolved} onError={() => setFailed(resolved)} />
    </video>
  );
}