"use client";

import { useTolgee, useTranslate } from "@tolgee/react";
import { setLanguage } from "@/tolgee/language";

export default function ChangeLanguageOption() {
  const tolgee = useTolgee(["language"]);
  const language = tolgee.getLanguage();

  const { t } = useTranslate();

  return (
    <select
      value={language}
      onChange={(e) => setLanguage(e.target.value)}
      className="bg-[#101010] cursor-pointer w-[100px] p-2"
    >
      <option value={"en-US"} className="text-textColor">
        {t("layouts.ChangeLanguageOption.en")}
      </option>
      <option value={"fa-IR"} className="text-textColor">
        {t("layouts.ChangeLanguageOption.fa")}
      </option>
    </select>
  );
}
