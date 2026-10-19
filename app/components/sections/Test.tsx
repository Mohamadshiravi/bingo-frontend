"use client";

import YoutubeIcon from "@/assets/icons/youtube.svg";
import InstagramIcon from "@/assets/icons/instagram.svg";
import LikeIcon from "@/assets/icons/like.svg";
import NightIcon from "@/assets/icons/night.svg";
import CommentIcon from "@/assets/icons/comment.svg";
import ViewIcon from "@/assets/icons/view.svg";
import { useEffect, useRef, useState } from "react";
import { useTranslate } from "@tolgee/react";
import { IoCloseOutline } from "react-icons/io5";
import { AccountType } from "@/types/Account";
import { sendErrorToast } from "@/utils/toast";
import { LuLock } from "react-icons/lu";
import { setCookie } from "@/utils/cookies";
import axiosInstance from "@/utils/axios";
import { resolveImageUrl, resolvePostMedia } from "@/utils/media";
import { MediaImg, MediaVideo } from "@/components/ui/Media";
import { mediaManifest } from "@/data/media";

type UserContent = {
  src: string;
  type: "image" | "video";
  poster?: string;
};

const dataSchema: Record<string, Record<string, string>> = {
  instagram: {
    avatar: "avatar_url",
    username: "handle",
    fullName: "display_name",
    infoOne: "follower_count",
    infoTwo: "post_count",
  },
  youtube: {
    avatar: "avatar_url",
    username: "handle",
    fullName: "display_name",
    infoOne: "follower_count",
    infoTwo: "post_count",
  },
};

export default function Test() {
  const [isAccountSectionMount, setIsAccountSectionMount] = useState(false);
  const [isAccountSectionOpen, setIsAccountSectionOpen] = useState(false);
  const [input, setInput] = useState("");
  const [account, setAccount] = useState<AccountType | null>(null);
  const [isFullAccountFetched, setIsFullAccountFetched] = useState(false);
  const [userLastContent, setUserLastContent] = useState<null | UserContent>(
    null,
  );
  const [provider, setProvider] = useState("instagram");
  const [fetchLoading, setFetchLoading] = useState(false);

  const { t } = useTranslate();

  function handleOpen() {
    setIsAccountSectionMount(true);
    setTimeout(() => setIsAccountSectionOpen(true), 10);
  }

  function handleClose() {
    setIsAccountSectionOpen(false);
    setTimeout(() => setIsAccountSectionMount(false), 200);
  }

  function handleCleanUp() {
    setInput("");
    setAccount(null);
    setUserLastContent(null);
    setIsFullAccountFetched(false);
  }

  return (
    <section
      id="test"
      className="pt-16 section-container grid md:grid-cols-[4fr_8fr] md:gap-14 gap-14 items-center"
    >
      <div
        key={userLastContent ? 1 : 2}
        className="rounded-3xl overflow-hidden w-full md:h-[600px] h-[300px]"
      >
        {fetchLoading ? (
          <div className="w-full h-full skeleton-loading"></div>
        ) : !isFullAccountFetched ? (
          <MediaVideo
            className="w-full h-full object-cover rounded-xl"
            autoPlay
            loop
            muted
            playsInline
            src={mediaManifest.sectionTwo.url}
          />
        ) : userLastContent ? (
          userLastContent?.type === "video" ? (
            <MediaVideo
              className="w-full h-full object-cover rounded-xl"
              autoPlay
              loop
              muted
              playsInline
              src={userLastContent.src} poster={userLastContent.poster}
            />
          ) : (
            <MediaImg
              className="w-full h-full object-cover"
              src={resolveImageUrl(userLastContent.src)}
              alt=""
              width={800}
              height={800}
            />
          )
        ) : (
          !account?.is_private && (
            <MediaVideo
              className="w-full h-full object-cover rounded-xl"
              autoPlay
              loop
              muted
              playsInline
              src={"https://assets.beenbo.com/videos/test-section-men.mp4"}
            />
          )
        )}

        {account?.is_private && (
          <div className="w-full h-full flex bg-background-700 px-4 flex-col items-center justify-center text-schemes-outline gap-0">
            <LuLock className="size-20" />
            <h4 className="text-2xl font-medium text-on-surface mt-4 text-center">
              {t("landing.test.privateAccountTitle")}
            </h4>
            <p className="text-center">
              {t("landing.test.privateAccountDescription")}
            </p>
          </div>
        )}
      </div>

      <div className="relative">
        <SearchSection
          handleCleanUp={handleCleanUp}
          setProvider={setProvider}
          provider={provider}
          input={input}
          setInput={setInput}
          handleOpen={handleOpen}
          isAccountSectionOpen={isAccountSectionOpen}
          account={account}
          setAccount={setAccount}
          setIsFullAccountFetched={setIsFullAccountFetched}
          setUserLastContent={setUserLastContent}
        />
        {isAccountSectionMount && (
          <AccountSection
            handleCleanUp={handleCleanUp}
            fetchLoading={fetchLoading}
            setFetchLoading={setFetchLoading}
            account={account}
            setAccount={setAccount}
            isAccountSectionOpen={isAccountSectionOpen}
            handleClose={handleClose}
            provider={provider}
            isFullAccountFetched={isFullAccountFetched}
            setIsFullAccountFetched={setIsFullAccountFetched}
            setUserLastContent={setUserLastContent}
          />
        )}
      </div>
    </section>
  );
}

function AccountSection({
  isAccountSectionOpen,
  handleClose,
  account,
  provider,
  setAccount,
  isFullAccountFetched,
  setIsFullAccountFetched,
  setUserLastContent,
  setFetchLoading,
  fetchLoading,
  handleCleanUp,
}: {
  handleCleanUp: () => void;
  fetchLoading: boolean;
  setFetchLoading: (value: boolean) => void;
  isAccountSectionOpen: boolean;
  handleClose: () => void;
  account: AccountType | null;
  provider: string;
  setAccount: (value: AccountType | null) => void;
  isFullAccountFetched: boolean;
  setIsFullAccountFetched: (value: boolean) => void;
  setUserLastContent: (value: null | UserContent) => void;
}) {
  const { t } = useTranslate();

  async function fetchFullAccount() {
    try {
      setFetchLoading(true);
      const res = await axiosInstance.post("public/account-preview", {
        handle: account?.handle,
        network: provider,
      });

      setIsFullAccountFetched(true);
      const profile = res.data.data;
      setAccount(profile);
      setUserLastContent(profile.is_private ? null : resolvePostMedia(profile.last_post));
    } catch (_) {
      sendErrorToast(t("landing.test.accountNotFound"));
    } finally {
      setFetchLoading(false);
    }
  }

  function formatNumber(num: number) {
    if (num >= 1_000_000_000) {
      return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";
    }
    if (num >= 1_000_000) {
      return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
    }
    if (num >= 1_000) {
      return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
    }
    return num.toString();
  }

  useEffect(() => {
    if (!isFullAccountFetched && account) {
      fetchFullAccount();
    }
  }, [isFullAccountFetched, account]);

  const labels: Record<string, Record<string, string>> = {
    instagram: {
      infoOne: t("landing.test.followers"),
      infoTwo: t("landing.test.posts"),
    },
    youtube: {
      infoOne: t("landing.test.subscriber"),
      infoTwo: t("landing.test.videos"),
    },
  };

  function handleRedirectUser() {
    if (!account) return;

    const payload = {
      username: account[dataSchema[provider].username],
      avatar: resolveImageUrl(account[dataSchema[provider].avatar]),
    };

    setCookie("user-info", JSON.stringify(payload));
    window.open(process.env.NEXT_PUBLIC_PANEL_URL, "_blank");
    handleCleanUp();
    handleClose();
  }

  return (
    <div
      className={`${
        isAccountSectionOpen
          ? "opacity-100 scale-100 bg-background/90 backdrop-blur-sm"
          : "opacity-0 scale-90 bg-background/20 backdrop-blur-none"
      } transition-all duration-300 w-full h-full z-10 absolute top-0 left-0 flex flex-col justify-center gap-6`}
    >
      <div className="flex flex-col gap-1">
        <h3 className="text-schemes-outline md:text-2xl text-xl">
          {t("landing.test.isThisYourAccount")}
        </h3>
        <h2 className="font-morabba md:text-5xl text-4xl font-semibold mt-3">
          {t("landing.test.freeTest")}
        </h2>
      </div>

      {account && !fetchLoading ? (
        <div className="flex gap-4 h-18">
          <MediaImg
            src={resolveImageUrl(account[dataSchema[provider].avatar])}
            width={300}
            height={300}
            alt=""
            className="size-18 rounded-lg bg-background"
          />
          <div className="h-full flex flex-col justify-center">
            <div className="flex items-center gap-3 text-schemes-outline bo">
              <span>
                <span>
                  {formatNumber(+account[dataSchema[provider].infoOne ?? 0])}
                </span>{" "}
                {labels[provider].infoOne}
              </span>
              <span>|</span>
              <span>
                <span>
                  {Number(
                    account[dataSchema[provider].infoTwo] ?? 0,
                  ).toLocaleString()}{" "}
                </span>
                {labels[provider].infoTwo}
              </span>
            </div>
            <span className="text-2xl font-bold rtl:translate-y-2">
              {account[dataSchema[provider].username]}
            </span>
          </div>
        </div>
      ) : (
        <div className="flex gap-4 h-18">
          <div className="size-18 rounded-lg bg-schemes-surface-container-high skeleton-loading"></div>
          <div className="h-full flex flex-col justify-between">
            <div className="flex items-center gap-3 text-schemes-outline">
              <span className="h-8 w-20 rounded-md bg-schemes-surface-container-high skeleton-loading"></span>
              <span>|</span>
              <span className="h-8 w-20 rounded-md bg-schemes-surface-container-high skeleton-loading"></span>
            </div>
            <span className="text-2xl rounded-md font-bold h-6 bg-schemes-surface-container-high skeleton-loading"></span>
          </div>
        </div>
      )}
      <div className="relative">
        {account?.is_private && (
          <div className="w-full h-full absolute top-0 left-0 z-10 bg-background/50 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-center gap-1">
                <h4 className="text-2xl font-medium text-on-surface mt-4">
                  {t("landing.test.privateAccountTitle")}
                </h4>
                <p>{t("landing.test.privateAccountDescription")}</p>
                <button
                  onClick={() => {
                    handleCleanUp();
                    handleClose();
                  }}
                  className="px-4 py-1.5 mt-2 bg-beenbo rounded-full hover:shadow-xl hover:scale-105 shadow-beenbo/30 text-surface cursor-pointer transition-all duration-300"
                >
                  {t("landing.test.ok")}
                </button>
              </div>
            </div>
          </div>
        )}

        {fetchLoading && (
          <div className="w-full h-full absolute z-10 top-0 left-0 bg-background/90">
            <div className="w-full h-full skeleton-loading rounded-xl"></div>
          </div>
        )}

        <div
          className={`${
            account?.is_private && "scale-80 opacity-50"
          } w-full h-full flex flex-col gap-6 relative`}
        >
          <div className="mt-4 md:text-2xl/12 text-xl/8">
            {t("landing.test.afterConfirmPart1")}
            <div className="inline-flex relative rtl:-translate-x-1.5 ltr:translate-x-1.5">
              <span className="inline-flex items-center justify-center gap-2 w-20 sm:h-10 h-9 bg-[#4E4E4E] rounded-full border border-background">
                <span className="text-xl">50</span>
                <LikeIcon className="size-5" />
              </span>
              <span className="rtl:translate-x-2 ltr:-translate-x-2 inline-flex items-center justify-center gap-2 w-20 sm:h-10 h-9 bg-[#4E4E4E] rounded-full border border-background">
                <span className="text-xl">10</span>
                <CommentIcon className="size-5" />
              </span>
              <span className="rtl:translate-x-4 ltr:-translate-x-4 inline-flex items-center justify-center gap-2 w-20 sm:h-10 h-9 bg-[#4E4E4E] rounded-full border border-background">
                <span className="text-xl">70</span>
                <ViewIcon className="size-5" />
              </span>
            </div>
            {t("landing.test.afterConfirmPart2")}
            <span className="inline-flex items-center mx-2 gap-2 px-7 py-3 bg-[linear-gradient(251deg,#28376B_11.52%,#1C1515_89.85%)] rounded-full border border-background">
              <NightIcon className="size-3 scale-320" />
            </span>
            {t("landing.test.afterConfirmPart3")}
          </div>
          <p className="text-schemes-outline text-lg">
            {t("landing.test.afterConfirmParagraphs")}
          </p>
          <div className="flex items-center sm:justify-start justify-center gap-3">
            <button
              onClick={handleRedirectUser}
              className="px-4 py-1.5 bg-beenbo rounded-full hover:shadow-xl hover:scale-105 shadow-beenbo/30 text-surface cursor-pointer transition-all duration-300"
            >
              {t("landing.test.confirmAndReceive")}
            </button>
            <button
              onClick={() => {
                handleCleanUp();
                handleClose();
              }}
              className="px-4 py-1.5 text-schemes-outline border rounded-full hover:bg-schemes-outline border-schemes-outline cursor-pointer hover:text-surface transition-all duration-300"
            >
              {t("landing.test.notMyAccount")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SearchSection({
  handleCleanUp,
  provider,
  setProvider,
  account,
  setAccount,
  input,
  setInput,
  handleOpen,
  isAccountSectionOpen,
  setIsFullAccountFetched,
  setUserLastContent,
}: {
  handleCleanUp: () => void;
  provider: string;
  setProvider: (value: string) => void;
  account: AccountType | null;
  setAccount: (value: AccountType | null) => void;
  input: string;
  setInput: (value: string) => void;
  handleOpen: () => void;
  isAccountSectionOpen: boolean;
  setIsFullAccountFetched: (value: boolean) => void;
  setUserLastContent: (value: UserContent | null) => void;
}) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSearchMount, setIsSearchMount] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  const [data, setData] = useState<null | AccountType[]>(null);

  const controllerRef = useRef<AbortController | null>(null);
  const { t } = useTranslate();

  function isLink(value: string): boolean {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  }

  function handleOpenSearch() {
    setIsSearchMount(true);
    setTimeout(() => setIsSearchOpen(true), 15);
  }

  function handleCloseSearch() {
    setIsSearchOpen(false);
    setTimeout(() => setIsSearchMount(false), 200);
  }

  async function handleLink() {
    const username = new URL(input).pathname.split("/").filter(Boolean).pop();

    const signal = createController();

    try {
      setSearchLoading(true);
      const res = await axiosInstance.post(
        "public/account-preview",
        {
          handle: username,
          network: provider,
        },
        { signal },
      );

      setIsFullAccountFetched(true);
      const profile = res.data.data;
      setAccount(profile);
      const lastPost = profile.last_post;
      if (lastPost) {
        setUserLastContent({
          type: lastPost.kind === "video" ? "video" : "image",
          src: lastPost.thumbnail_url || lastPost.url,
        });
      }
      setInput("");
    } catch (_) {
      sendErrorToast(t("landing.test.accountNotFound"));
    } finally {
      setSearchLoading(false);
    }
  }

  async function handleSearch() {
    handleOpenSearch();

    const signal = createController();

    try {
      setSearchLoading(true);
      const res = await axiosInstance.post(
        "public/account-preview",
        {
          handle: input,
          network: provider,
        },
        { signal },
      );
      setData([res.data.data]);
    } catch (_) {
      sendErrorToast(t("landing.test.searchError"));
    } finally {
      setSearchLoading(false);
    }
  }

  function createController() {
    if (controllerRef.current) {
      controllerRef.current.abort();
    }
    controllerRef.current = new AbortController();
    return controllerRef.current.signal;
  }

  useEffect(() => {
    handleCleanUp();
    setData(null);
  }, [provider]);

  useEffect(() => {
    if (input === "") {
      handleCloseSearch();
      return;
    }

    const id = setTimeout(() => {
      if (isLink(input)) {
        handleLink();
        handleCloseSearch();
      } else {
        handleSearch();
      }
    }, 500);

    return () => {
      clearInterval(id);
    };
  }, [input]);

  return (
    <div
      className={`${
        isAccountSectionOpen ? "scale-90" : ""
      } transition-all duration-300 flex flex-col gap-8`}
    >
      <div className="flex flex-col gap-1">
        <h3 className="text-schemes-outline md:text-2xl text-xl">
          {t("landing.test.wantToSeeQuality")}
        </h3>
        <h2 className="font-morabba md:text-5xl text-4xl font-semibold mt-3">
          {t("landing.test.freeTest")}
        </h2>
      </div>

      <div className="mt-4 md:text-2xl/12 text-xl">
        {t("landing.test.enterProfileBeforeSocial")}
        <span className="size-9 instagram-gradient inline-grid place-content-center rounded-full mx-2">
          <InstagramIcon className="size-5" />
        </span>
        {t("landing.test.andOr")}
        <span className="size-9 bg-[#781919] inline-grid place-content-center rounded-full mx-2">
          <YoutubeIcon className="size-5" />
        </span>
        {t("landing.test.enterProfileAfterSocial")}
        <div className="inline-flex relative rtl:-translate-x-1.5 ltr:translate-x-1.5">
          <span className="inline-flex items-center justify-center gap-2 w-20 sm:h-10 h-9 bg-[#4E4E4E] rounded-full border border-background">
            <span className="text-xl">50</span>
            <LikeIcon className="size-5" />
          </span>
          <span className="rtl:translate-x-2 ltr:-translate-x-2 inline-flex items-center justify-center gap-2 w-20 sm:h-10 h-9 bg-[#4E4E4E] rounded-full border border-background">
            <span className="text-xl">10</span>
            <CommentIcon className="size-5" />
          </span>
          <span className="rtl:translate-x-4 ltr:-translate-x-4 inline-flex items-center justify-center gap-2 w-20 sm:h-10 h-9 bg-[#4E4E4E] rounded-full border border-background">
            <span className="text-xl">70</span>
            <ViewIcon className="size-5" />
          </span>
        </div>
        {t("landing.test.freeWithoutPay")}
      </div>

      <div className="flex items-center md:gap-4 gap-2">
        <button
          onClick={() => setProvider("instagram")}
          className={`${
            provider === "instagram" ? "text-beenbo" : "text-schemes-outline"
          } active:scale-95 flex items-center justify-center w-28 h-9 cursor-pointer hover:border-beenbo hover:text-beenbo transition-all text-sm gap-1 border rounded-md`}
        >
          <InstagramIcon className="text-extended-red size-5" />
          <span>{t("landing.test.instagram")}</span>
        </button>

        <button
          onClick={() => setProvider("youtube")}
          className={`${
            provider === "youtube" ? "text-beenbo" : "text-schemes-outline"
          } active:scale-95 flex items-center justify-center w-28 h-9 cursor-pointer hover:border-beenbo hover:text-beenbo transition-all text-sm gap-1 border rounded-md`}
        >
          <YoutubeIcon className="text-extended-red size-5" />
          <span>{t("landing.test.youtube")}</span>
        </button>
      </div>

      <div className="flex flex-col gap-4">
        <h4 className="text-on-surface">
          {t("landing.test.enterProfileLink")}
        </h4>

        <div className="flex sm:flex-row flex-col gap-4">
          <div className="w-full relative">
            <div className="w-full bg-background-700 border rounded-lg border-schemes-surface-container-high h-13">
              {!account ? (
                <div className="flex items-center justify-between h-full">
                  <input
                    className={`${
                      searchLoading
                        ? "opacity-50 cursor-not-allowed"
                        : "opacity-100"
                    } w-full h-full px-4 outline-none`}
                    type="text"
                    placeholder={t("landing.test.profilePlaceholder")}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                  />
                  {searchLoading && (
                    <span className="size-6 block shrink-0 border-2 border-t-transparent border-beenbo animate-spin rounded-full mx-3"></span>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-3 h-full px-2 hover:bg-">
                  <MediaImg
                    src={resolveImageUrl(account[dataSchema[provider].avatar])}
                    width={300}
                    height={300}
                    alt=""
                    className="size-10 rounded-lg bg-background"
                  />
                  <span className="font-semibold text-lg font-sans">
                    {account[dataSchema[provider].username]}
                  </span>
                  <button
                    onClick={() => {
                      handleCleanUp();
                      setData(null);
                    }}
                    className="text-2xl hover:bg-schemes-surface-container-high/50 cursor-pointer rounded-full p-1.5 transition-all"
                  >
                    <IoCloseOutline />
                  </button>
                </div>
              )}
            </div>
            {isSearchMount && (
              <ul
                className={`${
                  isSearchOpen
                    ? "opacity-100 blur-none scale-100 translate-y-0"
                    : "opacity-0 blur-lg scale-90 -translate-y-6"
                } transition-all duration-300 p-2 gap-2 flex overflow-y-auto flex-col z-10 top-16 absolute bg-background-700 border shadow-xl rounded-xl border-schemes-surface-container-high w-full h-[30vh]`}
              >
                {!searchLoading ? (
                  data?.length !== 0 ? (
                    data?.map((e) => (
                      <li
                        onClick={() => {
                          setInput("");
                          setAccount(e);
                          handleCloseSearch();
                        }}
                        key={e.handle}
                        className="flex items-center gap-4 hover:bg-schemes-surface-container-high/50 p-2 rounded-md transition cursor-pointer"
                      >
                        <MediaImg
                          src={resolveImageUrl(e[dataSchema[provider].avatar])}
                          width={300}
                          height={300}
                          alt=""
                          className="size-14 rounded-lg bg-background"
                        />
                        <div className="flex flex-col">
                          <span className="font-semibold text-lg">
                            {e[dataSchema[provider].fullName]}
                          </span>
                          <span className="text-schemes-outline">
                            {e[dataSchema[provider].username]}
                          </span>
                        </div>
                      </li>
                    ))
                  ) : (
                    <div className="text-lg font-semibold p-4">
                      {t("landing.test.accountNotFound")}
                    </div>
                  )
                ) : (
                  <div className="w-full h-full grid place-content-center">
                    <span className="size-12 border-3 border-t-transparent border-beenbo animate-spin rounded-full"></span>
                  </div>
                )}
              </ul>
            )}
          </div>
          <button
            disabled={account ? false : true}
            onClick={handleOpen}
            className={`${
              !account
                ? "opacity-50 cursor-not-allowed"
                : "hover:shadow-xl hover:scale-105 cursor-pointer"
            } md:px-18 px-12 py-3 rounded-full transition-all duration-300 bg-beenbo  shadow-beenbo/30 text-surface`}
          >
            {t("landing.test.search")}
          </button>
        </div>
      </div>
    </div>
  );
}
