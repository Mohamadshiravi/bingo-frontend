"use client";

import { MediaImage as Image } from "@/components/ui/Media";
import PhoneIcon from "@/assets/icons/phone.svg";
import UserIcon from "@/assets/icons/user.svg";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslate } from "@tolgee/react";
import { useEffect, useState } from "react";
import { RiMenu3Line } from "react-icons/ri";
import { IoClose } from "react-icons/io5";
import { createPortal } from "react-dom";

export default function Header() {
  const [isTop, setIsTop] = useState(true);
  const { t } = useTranslate();
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isCareers = pathname === "/careers" || pathname.startsWith("/careers/");

  useEffect(() => {
    function isTopHandler() {
      if (window.scrollY > 200) {
        setIsTop(false);
      } else {
        setIsTop(true);
      }
    }

    window.addEventListener("scroll", isTopHandler);
    return () => {
      window.removeEventListener("scroll", isTopHandler);
    };
  }, []);

  return (
    <header className="w-full relative md:h-20 h-16">
      <div
        className={`${
          isTop ? "absolute" : "fixed animate-fade-in"
        } w-full md:h-20 h-16 top-0 left-0 z-30`}
      >
        <div
          className={`${
            isTop
              ? "bg-background h-full"
              : "bg-linear-to-bl from-[#161818]/60 to-[#181a1a]/60 backdrop-blur-xl rounded-xl mt-2 py-4 border border-[#181a1a]"
          } md:px-8 px-4 section-container flex items-center justify-between`}
        >
          <HeaderMobileMenu />
          <Link
            href={"/"}
            aria-current={isHome ? "page" : undefined}
            className="flex items-center gap-1"
          >
            <span
              className={`${isHome ? "text-beenbo" : "text-schemes-outline"} text-lg font-bold hover:text-beenbo transition-all`}
            >
              {t("layouts.header.brandName")}
            </span>
          </Link>
          <ul className="text-schemes-outline items-center gap-12 font-medium md:flex hidden">
            <li className="hover:text-beenbo transition-all cursor-pointer">
              {t("layouts.header.services")}
            </li>
            <li className="hover:text-beenbo transition-all cursor-pointer">
              <Link
                href={"/careers"}
                aria-current={isCareers ? "page" : undefined}
                className={isCareers ? "text-beenbo" : undefined}
              >
                {t("layouts.header.career")}
              </Link>
            </li>
            <li className="hover:text-beenbo transition-all cursor-pointer">
              {t("layouts.header.support")}
            </li>
            <li className="hover:text-beenbo transition-all cursor-pointer">
              <Link href={"#about-beenbo"}> {t("layouts.header.about")}</Link>
            </li>
          </ul>
          <div className="flex items-center gap-3">
            <div className="md:flex hidden px-4 py-2 rounded-full border border-border-700 hover:bg-border-700 cursor-pointer transition-all items-center gap-2">
              <PhoneIcon className="size-4 text-beenbo" />
              <span className="text-sm">{t("layouts.header.callUs")}</span>
            </div>
            <a
              target="_blank"
              href={process.env.NEXT_PUBLIC_PANEL_URL}
              className="cursor-pointer"
            >
              <UserIcon className="size-6 text-schemes-outline" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

function HeaderMobileMenu() {
  const [isMount, setIsMount] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isCareers = pathname === "/careers" || pathname.startsWith("/careers/");

  const { t } = useTranslate();

  function handleOpen() {
    setIsMount(true);
    setTimeout(() => setIsOpen(true), 10);
  }

  function handleClose() {
    setIsOpen(false);
    setTimeout(() => setIsMount(false), 100);
  }

  useEffect(() => {
    if (isMount) {
      document.documentElement.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "auto";
    }
  }, [isMount]);

  return (
    <>
      <button
        onClick={handleOpen}
        className="md:hidden block text-2xl ltr:rotate-180"
      >
        <RiMenu3Line />
      </button>
      {isMount &&
        createPortal(
          <>
            <section
              className={`${
                isOpen
                  ? "backdrop-blur-sm opacity-100"
                  : "backdrop-blur-none opacity-0"
              } transition-all duration-200 fixed top-0 left-0 w-screen h-screen bg-background/50 z-40`}
            ></section>
            <nav
              className={`${
                isOpen
                  ? "translate-x-0"
                  : "rtl:translate-x-[300px] ltr:-translate-x-[300px]"
              } transition-all duration-200 fixed top-0 rtl:right-0 ltr:left-0 p-4 bg-background w-[300px] h-screen z-50`}
            >
              <button onClick={handleClose}>
                <IoClose className="text-3xl" />
              </button>
              <Link
                href={"/"}
                aria-current={isHome ? "page" : undefined}
                className="flex items-center justify-center mt-8 gap-1"
              >
                <Image
                  className="size-6"
                  src={"/logo/Logo.svg"}
                  alt="logo"
                  width={800}
                  height={800}
                />
                <span
                  className={`${isHome ? "text-beenbo" : "text-schemes-outline"} text-xl font-bold hover:text-beenbo transition-all`}
                >
                  {t("layouts.header.brandName")}
                </span>
              </Link>
              <ul
                onClick={handleClose}
                className="text-schemes-outline items-center gap-6 font-medium flex flex-col mt-10"
              >
                <li className="hover:text-beenbo transition-all cursor-pointer">
                  {t("layouts.header.services")}
                </li>
                <li className="hover:text-beenbo transition-all cursor-pointer">
                  <Link
                    href={"/careers"}
                    aria-current={isCareers ? "page" : undefined}
                    className={isCareers ? "text-beenbo" : undefined}
                  >
                    {t("layouts.header.career")}
                  </Link>
                </li>
                <li className="hover:text-beenbo transition-all cursor-pointer">
                  {t("layouts.header.support")}
                </li>
                <li className="hover:text-beenbo transition-all cursor-pointer">
                  <Link href={"#about-beenbo"}>
                    {t("layouts.header.about")}
                  </Link>
                </li>
              </ul>
              <div className="flex px-4 py-2 rounded-full border border-border-700 hover:bg-border-700 cursor-pointer transition-all items-center justify-center gap-2 mt-10">
                <PhoneIcon className="size-4 text-beenbo" />
                <span className="text-sm">{t("layouts.header.callUs")}</span>
              </div>
            </nav>
          </>,
          document.body,
        )}
    </>
  );
}
