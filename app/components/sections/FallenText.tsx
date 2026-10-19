"use client";

import FallenTextComponent from "@/components/ui/FallingText";
import { useTolgee } from "@tolgee/react";

export default function FallenText() {
  const tolgee = useTolgee(["language"]);
  const language = tolgee.getLanguage() ?? "en-US";

  const texts: Record<string, { text: string; highlight: string[] }> = {
    "fa-IR": {
      text: "کامنت گوگل ریپلای تماشا لایک یوتوب نظر اینستاگرام فالو ترافیک استوری سابسکرایب",
      highlight: ["ترافیک", "اینستاگرام", "یوتوب", "گوگل"],
    },
    "en-US": {
      text: "comment google reply watch like youtube view instagram follow traffic story subscribe",
      highlight: ["traffic", "instagram", "youtube", "google"],
    },
  };

  return (
    <section className="w-full h-[250px] section-container border border-border-700 rounded-4xl mt-20">
      <FallenTextComponent
        text={texts[language].text}
        highlightWords={texts[language].highlight}
        trigger="scroll"
        backgroundColor="transparent"
        wireframes={false}
        gravity={0.56}
        fontSize="2rem"
        mouseConstraintStiffness={0.9}
      />
    </section>
  );
}
