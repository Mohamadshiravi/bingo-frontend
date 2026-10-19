/** Contracts inferred from Test.tsx, CalculatorInfo.tsx, and careers/Plans.tsx. */
export type SocialNetwork = "instagram" | "youtube";
export type DemoLanguage = "en-US" | "fa-IR";
export type LocalMediaPath = `/${string}`;

export type MediaReference =
  | { kind: "image"; url: LocalMediaPath; thumbnail_url: LocalMediaPath | null }
  | { kind: "video"; url: LocalMediaPath; thumbnail_url: LocalMediaPath | null };

/** Both networks use these exact field names in the existing account UI. */
export interface AccountProfile {
  handle: string;
  display_name: string;
  avatar_url: LocalMediaPath;
  follower_count: number;
  post_count: number;
  is_private: boolean;
  last_post: MediaReference | null;
}

// Separate names for network-specific consumers; the observed wire shapes match.
export type InstagramProfile = AccountProfile;
export type YouTubeProfile = AccountProfile;
export interface ProfilesByNetwork {
  instagram: InstagramProfile;
  youtube: YouTubeProfile;
}

export interface AccountPreviewRequest {
  handle: string;
  network: SocialNetwork;
}

export interface AccountPreviewResponse<N extends SocialNetwork = SocialNetwork> {
  data: ProfilesByNetwork[N];
}

export type InstagramAction =
  | "like"
  | "comment"
  | "reply_story"
  | "view"
  | "view_story"
  | "share"
  | "share_to_story";
export type YouTubeAction = "like" | "comment" | "view" | "watch";
export type PromotionAction = InstagramAction | YouTubeAction;

export interface PromotionEstimateRequest {
  network: SocialNetwork;
  audience_size: number;
  goal?: "smart";
  country?: string;
}

export interface PromotionEstimateResponse {
  data: {
    total_cost_minor: number;
    action_mix: { action: PromotionAction; estimated_quantity: number }[];
  };
}

export interface LocalizedText {
  en?: string;
  fa?: string;
}

export interface PromoterPlan {
  id: string;
  slug: string;
  tier: string;
  display_name?: LocalizedText;
  description?: LocalizedText;
  features?: string[];
}

export interface PlanVariant {
  currency?: string;
  price_minor?: number;
}

export interface PromoterPlanItem {
  plan: PromoterPlan;
  variants?: PlanVariant[];
  default_variant_index?: number;
}

export interface PromoterPlansResponse {
  data?: PromoterPlanItem[];
}

export interface AvailableMedia {
  kind: "image" | "video";
  url: LocalMediaPath;
  source_file: `public/${string}`;
  tracked: boolean;
  usage: string;
}

/** Missing media intentionally has no usable `url` field. */
export interface MissingMedia {
  kind: "image" | "video";
  source: string;
  reason: string;
}