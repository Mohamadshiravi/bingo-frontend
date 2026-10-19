import {
  ScrollVelocityContainer,
  ScrollVelocityRow,
} from "@/components/ui/scroll-based-velocity";
import { MediaImage as Image } from "@/components/ui/Media";
import CommaIcon from "@/assets/icons/comma.svg";
import { getTranslate } from "@/tolgee/server";

type CommentType = {
  name: string;
  body: string;
  avatar: string;
};

export default async function Comments() {
  const t = await getTranslate();

  const comments: CommentType[] = [
    {
      name: t("careersLanding.comments.comment.name"),
      body: t("careersLanding.comments.comment.body"),
      avatar: "/careers/6.png",
    },
    {
      name: t("careersLanding.comments.comment.name"),
      body: t("careersLanding.comments.comment.body"),
      avatar: "/careers/10.png",
    },
  ];

  return (
    <div
      dir="ltr"
      className="relative flex w-full flex-col items-center justify-center overflow-hidden md:mt-40 mt-20"
    >
      <ScrollVelocityContainer className="w-full">
        <ScrollVelocityRow baseVelocity={6} direction={1} className="py-1.5">
          {comments.map((e, idx) => (
            <Comment data={e} key={idx} />
          ))}
        </ScrollVelocityRow>
        <ScrollVelocityRow baseVelocity={6} direction={-1} className="py-1.5">
          {comments.map((e, idx) => (
            <Comment data={e} key={idx} />
          ))}
        </ScrollVelocityRow>
      </ScrollVelocityContainer>
    </div>
  );
}

function Comment({ data }: { data: CommentType }) {
  return (
    <div
      dir="auto"
      className="mx-1.5 inline-block md:w-115 w-50 bg-background-700 relative"
    >
      <span className="absolute top-8 left-8">
        <CommaIcon />
      </span>
      <div className="flex md:flex-row flex-col items-center md:px-8 px-4 md:py-14 py-8 md:gap-8 gap-4">
        <Image
          className="rounded-full md:size-21 size-16"
          src={data.avatar}
          width={400}
          height={400}
          alt=""
        />
        <div className="flex flex-col md:items-start items-center gap-1">
          <h4 className="md:text-xl text-lg text-schemes-outline font-semibold">
            {data.name}
          </h4>
          <p className="md:text-lg text-sm text-wrap md:w-10/12">{data.body}</p>
        </div>
      </div>
    </div>
  );
}
