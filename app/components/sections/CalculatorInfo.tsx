"use client";

import { useTranslate } from "@tolgee/react";
import YoutubeIcon from "@/assets/icons/youtube.svg";
import InstagramIcon from "@/assets/icons/instagram.svg";
import CalculatorIcon from "@/assets/icons/calculator.svg";
import LikeIcon from "@/assets/icons/like.svg";
import CommentIcon from "@/assets/icons/comment.svg";
import BrainIcon from "@/assets/icons/brain.svg";
import ViewIcon from "@/assets/icons/view.svg";
import ShareIcon from "@/assets/icons/share.svg";

import { ReactNode, useEffect, useRef, useState } from "react";
import axiosInstance from "@/utils/axios";
import { sendErrorToast } from "@/utils/toast";

type EstimateRange = {
  min: number;
  max: number;
};

export type ActionEstimates = {
  estimated_price: number;
  action_estimates: Record<string, EstimateRange>;
  max_interactions: {
    post: number;
    story: number;
  };
};

type PayloadType = {
  goal?: string;
  network?: string;
  audience_size?: number;
  country?: string;
};

export default function CalculatorInfo() {
  const [payload, setPayload] = useState<PayloadType>({
    goal: "smart",
    network: "instagram",
    audience_size: 300,
    country: "IR",
  });
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<null | ActionEstimates>(null);
  const hasShownMinFollowersError = useRef(false);
  const { t } = useTranslate();

  const infoRows: Record<
    string,
    { icon: ReactNode; label: string; key: string }[]
  > = {
    instagram: [
      {
        icon: <LikeIcon />,
        label: t("landing.calculator.like"),
        key: "like",
      },
      {
        icon: <CommentIcon />,
        label: t("landing.calculator.comment"),
        key: "comment",
      },
      {
        icon: <CommentIcon />,
        label: t("landing.calculator.reply_story"),
        key: "reply_story",
      },
      {
        icon: <ViewIcon />,
        label: t("landing.calculator.view"),
        key: "view",
      },
      {
        icon: <ViewIcon />,
        label: t("landing.calculator.view_story"),
        key: "view_story",
      },
      {
        icon: <ShareIcon />,
        label: t("landing.calculator.share"),
        key: "share",
      },
      {
        icon: <ShareIcon />,
        label: t("landing.calculator.share_to_story"),
        key: "share_to_story",
      },
    ],
    youtube: [
      {
        icon: <LikeIcon />,
        label: t("landing.calculator.like"),
        key: "like",
      },
      {
        icon: <CommentIcon />,
        label: t("landing.calculator.comment"),
        key: "comment",
      },
      {
        icon: <ViewIcon />,
        label: t("landing.calculator.view"),
        key: "view",
      },
      {
        icon: <ViewIcon />,
        label: t("landing.calculator.watchtime"),
        key: "watch",
      },
    ],
  };

  async function fetchData() {
    if (loading) return;
    if ((payload.audience_size ?? 0) < 260) {
      if (!hasShownMinFollowersError.current) {
        sendErrorToast(t("errors.minFollowers", { count: 260 }));
        hasShownMinFollowersError.current = true;
      }
      return;
    }

    hasShownMinFollowersError.current = false;

    try {
      setLoading(true);
      const res = await axiosInstance.post(
        "/public/promotions/estimate",
        payload,
      );
      const data = res.data.data as {
        total_cost_minor: number;
        action_mix: { action: string; estimated_quantity: number }[];
      };

      const action_estimates = Object.fromEntries(
        data.action_mix.map((item) => [
          item.action,
          { min: item.estimated_quantity, max: item.estimated_quantity },
        ]),
      ) as Record<string, EstimateRange>;

      const convertedPriceToToman = {
        estimated_price: +String(data.total_cost_minor).replace(/0$/, ""),
        action_estimates,
        max_interactions: {
          post: payload.audience_size ?? 0,
          story: payload.audience_size ?? 0,
        },
      };

      setData(convertedPriceToToman);
    } catch (_) {
      sendErrorToast(t("errors.default"));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const id = setTimeout(fetchData, 500);

    return () => {
      clearTimeout(id);
    };
  }, [payload]);

  return (
    <div
      className={`${
        loading && "scale-95"
      } relative transition-transform duration-500 md:w-[444px] w-full h-full border-schemes-outline border rounded-2xl shrink-0 p-5 flex flex-col`}
    >
      <div
        className={`${
          loading ? "scale-100" : "scale-0"
        } transition w-full h-full absolute top-0 left-0 backdrop-blur-[2px] rounded-2xl`}
      ></div>
      <div className="flex items-center gap-3 border-b border-dashed border-schemes-outline pb-4">
        <CalculatorIcon />
        <h3 className="font-medium text-lg">
          {t("landing.calculator.calculatorTitle")}
        </h3>
      </div>

      <div className="mt-6">
        <h4 className="font-medium">
          {t("landing.calculator.chooseCampaignType")}
        </h4>
        <div className="flex items-center md:gap-4 gap-2 mt-3">
          <button
            onClick={() =>
              setPayload((prev) => {
                return { ...(prev ?? {}), network: "instagram" };
              })
            }
            className={`${
              payload?.network === "instagram"
                ? "text-beenbo"
                : "text-schemes-outline"
            } active:scale-95 flex items-center justify-center w-28 h-9 cursor-pointer hover:border-beenbo hover:text-beenbo transition-all text-sm gap-1 border rounded-md`}
          >
            <InstagramIcon className="text-extended-red size-5" />
            <span>{t("landing.calculator.instagram")}</span>
          </button>

          <button
            onClick={() =>
              setPayload((prev) => {
                return { ...(prev ?? {}), network: "youtube" };
              })
            }
            className={`${
              payload?.network === "youtube"
                ? "text-beenbo"
                : "text-schemes-outline"
            } active:scale-95 flex items-center justify-center w-28 h-9 cursor-pointer hover:border-beenbo hover:text-beenbo transition-all text-sm gap-1 border rounded-md`}
          >
            <YoutubeIcon className="text-extended-red size-5" />
            <span>{t("landing.calculator.youtube")}</span>
          </button>
        </div>
      </div>

      <div className="mt-6">
        <h4 className="font-medium">
          {t("landing.calculator.chooseCampaignStrategy")}
        </h4>
        <div className="flex items-center md:gap-4 gap-2 mt-3">
          <button
            onClick={() =>
              setPayload((prev) => {
                return { ...(prev ?? {}), goal: "smart" };
              })
            }
            className={`${
              payload?.goal === "smart" ? "text-beenbo" : "text-schemes-outline"
            } active:scale-95 flex items-center justify-center w-28 h-9 cursor-pointer hover:border-beenbo hover:text-beenbo transition-all text-sm gap-1 border rounded-md`}
          >
            <BrainIcon className="text-extended-red size-5" />
            <span>{t("landing.calculator.smart")}</span>
          </button>
        </div>
      </div>

      <div className="flex mt-8 gap-2">
        <p className="font-semibold">
          {t("landing.calculator.startWithFollowersPt1")}
        </p>
        <input
          type="number"
          className="inline w-14 text-center outline-none bg-background-700 border border-schemes-surface-container-high rounded-md transition"
          value={payload?.audience_size}
          onChange={(e) =>
            setPayload((prev) => {
              return {
                ...(prev ?? {}),
                audience_size: +e.target.value,
              };
            })
          }
        />
        <p className="font-semibold">
          {t("landing.calculator.startWithFollowersPt2")}
        </p>
      </div>

      <div className="mt-4">
        <h4>
          {t("landing.calculator.servicesWithFollowers", {
            followers: payload.audience_size?.toLocaleString(),
          })}
        </h4>
        <div className="flex flex-col gap-2 mt-4">
          {data &&
            infoRows[payload.network ?? ""].map(
              (e, i) =>
                data.action_estimates[e.key] && (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="size-3.5 flex">{e.icon}</span>
                      <span className="text-schemes-outline text-sm">
                        {e.label}
                      </span>
                    </div>
                    <div className="text-schemes-outline">
                      {data?.action_estimates[e.key].min.toLocaleString()} {"~"}{" "}
                      {data?.action_estimates[e.key].max.toLocaleString()}{" "}
                      {t("landing.calculator.unit")}
                    </div>
                  </div>
                ),
            )}
        </div>
      </div>

      <div className="my-6 border border-dashed border-schemes-outline"></div>

      <div className="flex flex-col gap-2">
        {payload.network === "instagram" && data?.max_interactions.story && (
          <div className="flex items-center justify-between">
            <div className="text-schemes-outline text-sm">
              {t("landing.calculator.approximateCostPerStory")}
            </div>
            <div className="text-schemes-outline">
              {(data?.max_interactions.story ?? 0).toLocaleString()}{" "}
              {t("landing.calculator.currencySymbol")}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="text-schemes-outline text-sm">
            {t("landing.calculator.approximateCostPerPost")}
          </div>
          <div className="text-schemes-outline">
            {(data?.max_interactions.post ?? 0).toLocaleString()}{" "}
            {t("landing.calculator.currencySymbol")}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-lg flex sm:flex-row flex-col sm:items-center gap-1">
            <span>{t("landing.calculator.monthlyCost")}</span>
            <span className="text-schemes-outline text-sm">
              {t("landing.calculator.cancelAnytime")}
            </span>
          </div>
          <div className="text-xl">
            {data?.estimated_price.toLocaleString()}{" "}
            {t("landing.calculator.currencySymbol")}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <a
          target="_blank"
          href={process.env.NEXT_PUBLIC_PANEL_URL}
          className="text-schemes-outline block text-center border rounded-full w-full py-2 cursor-pointer border-schemes-outline hover:bg-schemes-outline hover:text-white transition"
        >
          {t("landing.calculator.createCampaign")}
        </a>
      </div>
    </div>
  );
}
