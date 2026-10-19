import type { DemoLanguage, LocalizedText, PromoterPlansResponse } from "./contracts";

export const planFeatureContent = {
  basic_campaigns: { en: "Basic campaigns", fa: "کمپین‌های پایه" },
  standard_support: { en: "Standard support", fa: "پشتیبانی معمولی" },
  advanced_analytics: { en: "Advanced analytics", fa: "آمار و تحلیل پیشرفته" },
  priority_support: { en: "Priority support", fa: "پشتیبانی در اولویت" },
  unlimited_campaigns: { en: "Unlimited campaigns", fa: "کمپین‌های نامحدود" },
} as const satisfies Record<string, Required<LocalizedText>>;

export const promoterPlans: PromoterPlansResponse & { data: NonNullable<PromoterPlansResponse["data"]> } = {
  data: [
    {
      plan: {
        id: "demo-plan-free",
        slug: "free",
        tier: "free",
        display_name: { en: "Free", fa: "رایگان" },
        description: { en: "Start promoting at your own pace.", fa: "تبلیغات را با سرعت دلخواه خود شروع کنید." },
        features: ["basic_campaigns", "standard_support"],
      },
      variants: [{ currency: "IRR", price_minor: 0 }, { currency: "USD", price_minor: 0 }],
      default_variant_index: 0,
    },
    {
      plan: {
        id: "demo-plan-pro",
        slug: "pro",
        tier: "pro",
        display_name: { en: "Pro", fa: "حرفه‌ای" },
        description: { en: "More tools for growing creators.", fa: "ابزارهای بیشتر برای رشد تولیدکنندگان محتوا." },
        features: ["unlimited_campaigns", "advanced_analytics", "priority_support"],
      },
      variants: [{ currency: "IRR", price_minor: 2_990_000 }, { currency: "USD", price_minor: 999 }],
      default_variant_index: 0,
    },
  ],
};

/** Optional content lookup; the existing wire contract remains a string[] of keys. */
export function getPlanFeatureLabel(feature: string, language: DemoLanguage): string {
  if (!Object.hasOwn(planFeatureContent, feature)) return feature;
  const content = planFeatureContent[feature as keyof typeof planFeatureContent];
  return language === "fa-IR" ? content.fa : content.en;
}