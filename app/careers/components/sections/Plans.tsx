import LeafIcon from "@/assets/icons/leaf.svg";
import StarIcon from "@/assets/icons/star.svg";
import CircleCheckIcon from "@/assets/icons/circle-check.svg";
import { getTranslate } from "@/tolgee/server";
import { getLanguage } from "@/tolgee/language";
import { promoterPlans } from "@/data/plans";
import type { LocalizedText, PromoterPlanItem } from "@/data/contracts";

type PlanCard = {
  id: string;
  title: string;
  description: string;
  tier: string;
  price: number;
  features: string[];
};

function getLocalizedText(
  value: LocalizedText | undefined,
  language: string,
  fallback: string,
) {
  if (!value) return fallback;
  const isFa = language.startsWith("fa");
  return (isFa ? value.fa : value.en) ?? value.fa ?? value.en ?? fallback;
}

function normalizeFeatureLabel(feature: string) {
  return feature
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function mapPlanCard(item: PromoterPlanItem, language: string): PlanCard {
  const variants = item.variants ?? [];
  const irrVariant = variants.find((variant) => variant.currency === "IRR");
  const defaultVariant = variants[item.default_variant_index ?? 0];
  const selectedVariant = irrVariant ?? defaultVariant ?? variants[0];

  return {
    id: item.plan.id,
    title: getLocalizedText(item.plan.display_name, language, item.plan.slug),
    description: getLocalizedText(item.plan.description, language, ""),
    tier: item.plan.tier,
    price: Number.isFinite(selectedVariant?.price_minor)
      ? (selectedVariant?.price_minor as number)
      : 0,
    features: (item.plan.features ?? []).map(normalizeFeatureLabel),
  };
}

function getPromoterPlans(language: string): PlanCard[] | null {
  const mapped = (promoterPlans.data ?? [])
    .map((item) => mapPlanCard(item, language))
    .filter((plan) => plan.title);

  return mapped.length > 0 ? mapped : null;
}

export default async function Plans() {
  const t = await getTranslate();
  const language = await getLanguage();

  const plans = getPromoterPlans(language);

  return (
    <section className="md:mt-50 mt-30 lg:max-w-240 max-w-11/12 mx-auto">
      <div className="flex flex-col items-center gap-2">
        <h3 className="text-schemes-outline md:text-2xl text-xl text-center">
          {t("careersLanding.plans.compareTitle")}
        </h3>

        <h2 className="font-morabba md:text-5xl text-4xl font-semibold mt-3 text-center">
          {t("careersLanding.plans.levelTitle")}
        </h2>

        <p className="md:mt-20 mt-10 md:text-2xl text-xl text-center">
          {t("careersLanding.plans.descriptionParagraph")}
        </p>
      </div>

      <div className="w-full grid md:grid-cols-2 items-start lg:gap-20 md:gap-12 gap-6 md:mt-20 mt-10 text-surface">
        {plans?.map((plan, i) => {
          const isPro = plan.tier.toLowerCase().includes("pro");

          return (
            <div
              key={`${plan.id}-${i}`}
              className={`${
                isPro
                  ? "bg-[#FFC4DD] shadow-[#FFC4DD]/30"
                  : "bg-white shadow-white/20"
              } hover:scale-102 md:py-16 transition duration-500 hover:shadow-xl py-10 md:px-10 px-6`}
            >
              {!isPro ? <LeafIcon /> : <StarIcon />}
              <div className="flex flex-col gap-1 mt-10">
                <h3 className="text-2xl font-bold">{plan.title}</h3>
                <h4 className="text-lg">{plan.description}</h4>
              </div>

              <div className="flex items-end md:my-10 my-6">
                <span className="font-bold md:text-4.5xl text-3xl">
                  {plan.price.toLocaleString()}{" "}
                  {t("careersLanding.plans.currency")}
                </span>
                <span className="text-3xl font-medium text-nowrap">
                  /{t("careersLanding.plans.perMonth")}
                </span>
              </div>

              <div
                className={`${
                  !isPro
                    ? "border-on-surface-variant"
                    : "border-surface-variant"
                } w-full border-b`}
              ></div>
              <div className="mt-8">
                <h4 className="font-semibold text-lg">
                  {t("careersLanding.plans.featuresTitle")}
                </h4>
                <ul className="mt-8 flex flex-col gap-4">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CircleCheckIcon className="shrink-0" />
                      <span className="font-semibold">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
