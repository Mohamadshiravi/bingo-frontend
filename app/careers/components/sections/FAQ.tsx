"use client";

import { PlusIcon } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useTranslate } from "@tolgee/react";

export default function FAQ() {
  const [openedFaq, setOpenedFaq] = useState<number | null>(null);
  const { t } = useTranslate();

  const items = [
    {
      title: t("careersLanding.faq.faqOne.title"),
      body: t("careersLanding.faq.faqOne.body"),
    },
    {
      title: t("careersLanding.faq.faqTwo.title"),
      body: t("careersLanding.faq.faqTwo.body"),
    },
    {
      title: t("careersLanding.faq.faqThree.title"),
      body: t("careersLanding.faq.faqThree.body"),
    },
  ];

  return (
    <section className="md:my-40 my-20 section-container">
      <div className="flex flex-col items-center gap-2">
        <h3 className="text-schemes-outline md:text-2xl text-xl text-center">
          {t("careersLanding.faq.needMoreInfo")}
        </h3>

        <h2 className="font-morabba md:text-5xl text-4xl font-semibold mt-3 text-center">
          {t("careersLanding.faq.faqTitle")}
        </h2>
      </div>

      <ul className="flex flex-col md:mt-30 mt-16 border-t border-surface-variant">
        {items.map((e, i) => (
          <FAQItem
            openedFaq={openedFaq}
            setOpenedFaq={setOpenedFaq}
            key={i}
            data={e}
            index={i}
          />
        ))}
      </ul>
    </section>
  );
}

function FAQItem({
  openedFaq,
  setOpenedFaq,
  data,

  index,
}: {
  openedFaq: number | null;
  setOpenedFaq: (value: number | null) => void;
  data: { title: string; body: string };
  index: number;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [height, setHeight] = useState(0);

  const contentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    setHeight(contentRef.current?.scrollHeight ?? 0);
  }, []);

  useEffect(() => {
    if (openedFaq !== index) {
      setIsOpen(false);
    }
  }, [openedFaq]);

  return (
    <li className="flex flex-col cursor-pointer border-b border-surface-variant">
      <div
        onClick={() => {
          setIsOpen(!isOpen);
          setOpenedFaq(index);
        }}
        className="flex items-center justify-between gap-10 md:py-10 py-6"
      >
        <h3 className="font-semibold md:text-2xl text-lg">{data.title}</h3>
        <button className="border rounded-full border-surface-variant p-0.5 cursor-pointer">
          <PlusIcon
            className={`md:size-7 size-6 ${
              isOpen && "rotate-45"
            } transition-all duration-300`}
          />
        </button>
      </div>

      <div
        style={{ height: isOpen ? height : 0, transition: "height 0.5s ease" }}
        ref={contentRef}
        className={`text-dim-grey max-w-3xl overflow-hidden`}
      >
        <div className="py-6 md:text-lg text-schemes-on-background">
          {data.body}
        </div>
      </div>
    </li>
  );
}
