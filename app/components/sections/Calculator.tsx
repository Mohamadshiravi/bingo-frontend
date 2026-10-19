import { getTranslate } from "@/tolgee/server";
import CalculatorInfo from "./CalculatorInfo";

export default async function Calculator() {
  const t = await getTranslate();

  return (
    <section
      id="calculator"
      className="section-container flex lg:flex-row flex-col items-center md:gap-20 gap-10 lg:pt-40 pt-20"
    >
      <div>
        <h3 className="text-schemes-outline md:text-2xl text-xl">
          {t("landing.calculator.wantToEstimate")}
        </h3>
        <h2 className="font-morabba md:text-5xl text-4xl font-semibold mt-3">
          {t("landing.calculator.transparentPricing")}
        </h2>

        <p className="mt-12 md:text-2xl text-xl">
          {t("landing.calculator.paragraph1")}
          <br />
          <br />
          {t("landing.calculator.paragraph2")}
          <br />
          <br />
          {t("landing.calculator.paragraph3")}
          <br />
          <br />
          {t("landing.calculator.paragraph4")}
        </p>
      </div>

      <CalculatorInfo />
    </section>
  );
}
