import type { AvailableMedia, MissingMedia } from "./contracts";

/** Verified local public assets; tracked records the original inventory status. */
export const mediaManifest = {
  logo: {
    kind: "image",
    url: "/logo/Logo.svg",
    source_file: "public/logo/Logo.svg",
    tracked: true,
    usage: "Brand logo; shared demo avatar until dedicated portraits exist.",
  },
  hero: {
    kind: "image",
    url: "/landing/hero.jpg",
    source_file: "public/landing/hero.jpg",
    tracked: false,
    usage: "Existing landing image; shared demo image post (not a real account photo).",
  },
  sectionOne: {
    kind: "video",
    url: "/landing/section-1.mp4",
    source_file: "public/landing/section-1.mp4",
    tracked: false,
    usage: "Existing landing clip; shared demo video post.",
  },
  sectionTwo: {
    kind: "video",
    url: "/landing/section-2.mp4",
    source_file: "public/landing/section-2.mp4",
    tracked: false,
    usage: "Existing test-section clip; shared demo video post.",
  },
  careersSection: {
    kind: "video",
    url: "/careers/section-1.mp4",
    source_file: "public/careers/section-1.mp4",
    tracked: false,
    usage: "Careers explainer; distinct from landing clips.",
  },
  careersApp: {
    kind: "image",
    url: "/careers/mobile.png",
    source_file: "public/careers/mobile.png",
    tracked: false,
    usage: "Careers app illustration.",
  },
  careersHero1: {
    kind: "image",
    url: "/careers/1.png",
    source_file: "public/careers/1.png",
    tracked: false,
    usage: "Careers hero tile 1; original numbered assignment.",
  },
  careersHero2: {
    kind: "video",
    url: "/careers/2.mp4",
    source_file: "public/careers/2.mp4",
    tracked: false,
    usage: "Careers hero tile 2; original numbered assignment.",
  },
  careersHero3: {
    kind: "image",
    url: "/careers/3.png",
    source_file: "public/careers/3.png",
    tracked: false,
    usage: "Careers hero tile 3; original numbered assignment.",
  },
  careersHero4: {
    kind: "video",
    url: "/careers/4.mp4",
    source_file: "public/careers/4.mp4",
    tracked: false,
    usage: "Careers hero tile 4; original numbered assignment.",
  },
  careersHero5: {
    kind: "image",
    url: "/careers/5.png",
    source_file: "public/careers/5.png",
    tracked: false,
    usage: "Careers hero tile 5; original numbered assignment.",
  },
  careersHero6: {
    kind: "image",
    url: "/careers/6.png",
    source_file: "public/careers/6.png",
    tracked: false,
    usage: "Careers hero tile 6; original numbered assignment.",
  },
  careersHero7: {
    kind: "video",
    url: "/careers/7.mp4",
    source_file: "public/careers/7.mp4",
    tracked: false,
    usage: "Careers hero tile 7; original numbered assignment.",
  },
  careersHero8: {
    kind: "image",
    url: "/careers/8.png",
    source_file: "public/careers/8.png",
    tracked: false,
    usage: "Careers hero tile 8; original numbered assignment.",
  },
  careersHero9: {
    kind: "video",
    url: "/careers/9.mp4",
    source_file: "public/careers/9.mp4",
    tracked: false,
    usage: "Careers hero tile 9; original numbered assignment.",
  },
  careersHero10: {
    kind: "image",
    url: "/careers/10.png",
    source_file: "public/careers/10.png",
    tracked: false,
    usage: "Careers hero tile 10; original numbered assignment.",
  },
  careersHero11: {
    kind: "video",
    url: "/careers/11.mp4",
    source_file: "public/careers/11.mp4",
    tracked: false,
    usage: "Careers hero tile 11; original numbered assignment.",
  },
  careersHero12: {
    kind: "image",
    url: "/careers/12.png",
    source_file: "public/careers/12.png",
    tracked: false,
    usage: "Careers hero tile 12; original numbered assignment.",
  },
} as const satisfies Record<string, AvailableMedia>;

export const missingMedia: MissingMedia[] = [
  {
    kind: "image",
    source: "Dedicated demo profile portraits and post images",
    reason: "No account-specific images exist locally; fixtures explicitly reuse logo/hero assets.",
  },
  {
    kind: "image",
    source: "Dedicated video poster images",
    reason: "Not available locally. Video fixtures use null thumbnails to preserve playable URLs.",
  },
  {
    kind: "video",
    source: "https://assets.beenbo.com/videos/test-section-men.mp4",
    reason: "No-post account preview clip has no verified local equivalent; retain direct external source with a static fallback.",
  },
  ...Array.from({ length: 9 }, (_, index): MissingMedia => ({
    kind: "image",
    source: `https://assets.beenbo.com/marque/${index + 1}.svg`,
    reason: "Landing marquee artwork has no local copy.",
  })),
  ...[1015, 1011, 1020, 1021, 1023, 1028, 1076, 1029, 1039, 1050, 1052, 1080, 1056, 1059, 1057]
    .map((id): MissingMedia => ({
      kind: "image",
      source: `https://picsum.photos/id/${id}`,
      reason: "Posts.tsx uses this remote photo at varying dimensions; no local copy.",
    })),
];