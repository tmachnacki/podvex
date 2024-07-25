import { Id } from "@/convex/_generated/dataModel";
import Image from "next/image";
import React from "react";
import Link from "next/link";
import { useAudio } from "@/providers/audio-provider";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import { Play } from "lucide-react";
import { useRouter } from "next/navigation";

export interface PodcastCardProps {
  imageUrl: string;
  title: string;
  description: string;
  podcastId: Id<"podcasts">;
  audioUrl: string;
  author: string;
}

export const PodcastCard = ({
  imageUrl,
  title,
  description,
  podcastId,
  audioUrl,
  author,
}: PodcastCardProps) => {
  const increaseViews = useMutation(api.podcasts.updatePodcastViews);
  const router = useRouter();

  const { setAudio } = useAudio();

  const handleUpdateViews = async () => {
    try {
      await increaseViews({ podcastId: podcastId });
    } catch (error) {
      console.error(error);
      toast.error("Error udpating podcast views");
    }
  };

  const handlePlay = () => {
    setAudio({
      title,
      audioUrl,
      imageUrl,
      author,
      podcastId,
    });
    handleUpdateViews();
  };

  return (
    <div
      // href={`/podcasts/${podcastId}`}
      className="group relative cursor-pointer transition hover:!opacity-100 group-hover/podcasts:opacity-50"
      onClick={() => {
        handleUpdateViews();
        router.push(`/podcasts/${podcastId}`);
      }}
    >
      <figure className="relative flex flex-col gap-2 rounded-xl">
        <span
          className="absolute bottom-10 right-1.5 z-20 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-primary opacity-0 shadow-md shadow-black/50 transition duration-200 hover:scale-[105%] group-hover:-translate-y-4 group-hover:opacity-100"
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            handlePlay();
          }}
        >
          <Play className="h-4 w-4 text-primary-foreground" />
        </span>
        <div className="aspect-square w-full overflow-hidden rounded-xl">
          <Image
            src={imageUrl}
            width={160}
            height={160}
            alt={title}
            className="aspect-square h-fit w-full rounded-xl object-cover object-center transition-transform group-hover:scale-105"
          />
        </div>
        <div className="flex flex-col">
          <h3 className="truncate font-semibold">{title}</h3>
          <p className="truncate text-sm font-normal capitalize text-muted-foreground">
            {description}
          </p>
        </div>
      </figure>
    </div>
  );
};
