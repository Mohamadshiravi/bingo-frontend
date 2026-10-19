import type {
  InstagramAction,
  PromotionAction,
  PromotionEstimateRequest,
  PromotionEstimateResponse,
  YouTubeAction,
} from "./contracts";

interface ActionRule {
  /** Expected monthly actions per audience member. `watch` counts demo minutes. */
  quantity_per_member: number;
  unit_cost_minor: number;
}

/** Invented demo-only IRR prices, not production rates or revenue promises. */
export const promotionRules = {
  instagram: {
    like: { quantity_per_member: 0.3, unit_cost_minor: 1000 },
    comment: { quantity_per_member: 0.04, unit_cost_minor: 5000 },
    reply_story: { quantity_per_member: 0.02, unit_cost_minor: 4000 },
    view: { quantity_per_member: 1.2, unit_cost_minor: 200 },
    view_story: { quantity_per_member: 0.6, unit_cost_minor: 200 },
    share: { quantity_per_member: 0.03, unit_cost_minor: 3000 },
    share_to_story: { quantity_per_member: 0.01, unit_cost_minor: 4000 },
  },
  youtube: {
    like: { quantity_per_member: 0.15, unit_cost_minor: 1500 },
    comment: { quantity_per_member: 0.02, unit_cost_minor: 6000 },
    view: { quantity_per_member: 0.8, unit_cost_minor: 500 },
    watch: { quantity_per_member: 2.4, unit_cost_minor: 300 },
  },
} as const satisfies {
  instagram: Record<InstagramAction, ActionRule>;
  youtube: Record<YouTubeAction, ActionRule>;
};

export const MAX_DEMO_AUDIENCE = 1_000_000_000;

/** Defensive numeric bounds keep all quantities/costs finite and safely integral. */
export function normalizeAudienceSize(audienceSize: number): number {
  if (!Number.isFinite(audienceSize)) return 0;
  return Math.min(MAX_DEMO_AUDIENCE, Math.max(0, Math.floor(audienceSize)));
}

export function calculatePromotionEstimate(request: PromotionEstimateRequest): PromotionEstimateResponse {
  if (request.network !== "instagram" && request.network !== "youtube") {
    throw new RangeError("Unsupported demo network");
  }
  const audience = normalizeAudienceSize(request.audience_size);
  const rules: Partial<Record<PromotionAction, ActionRule>> = promotionRules[request.network];
  let totalCost = 0;
  const actionMix: PromotionEstimateResponse["data"]["action_mix"] = [];
  for (const action of Object.keys(rules) as PromotionAction[]) {
    const rule = rules[action];
    if (!rule) continue;
    const quantity = Math.floor(audience * rule.quantity_per_member);
    totalCost += quantity * rule.unit_cost_minor;
    actionMix.push({ action, estimated_quantity: quantity });
  }
  return { data: { total_cost_minor: totalCost, action_mix: actionMix } };
}