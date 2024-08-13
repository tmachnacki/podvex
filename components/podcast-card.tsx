import { Id } from "@/convex/_generated/dataModel";
import Image from "next/image";
import React from "react";
import Link from "next/link";
import { useAudio } from "@/providers/audio-provider";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import { AudioLines, Play } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUpdateViews } from "@/hooks/use-update-views";
import { useUpdateListeners } from "@/hooks/use-update-listeners";
import { useUpdateHistory } from "@/hooks/use-update-history";

export interface PodcastCardProps {
  imageUrl: string;
  title: string;
  description: string;
  podcastId: Id<"podcasts">;
  audioUrl: string;
  author: string;
  currentUserId: string;
  authorId: string;
}

export const PodcastCard = ({
  imageUrl,
  title,
  description,
  podcastId,
  audioUrl,
  author,
  currentUserId,
  authorId,
}: PodcastCardProps) => {
  const router = useRouter();

  const { setAudio, audio } = useAudio();
  const { updateViews } = useUpdateViews();
  const { updateListeners } = useUpdateListeners();
  const { updateHistory } = useUpdateHistory();

  const handlePlay = () => {
    setAudio({
      title,
      audioUrl,
      imageUrl,
      author,
      podcastId,
    });
    updateViews({ podcastId });
    updateListeners({ listenerId: currentUserId, authorId });
    updateHistory({ userId: currentUserId, podcastId });
  };

  return (
    <div
      // href={`/podcasts/${podcastId}`}
      className="group relative cursor-default rounded-lg p-3 transition hover:bg-accent hover:!opacity-100 group-hover/podcasts:opacity-70 dark:hover:bg-neutral-900 dark:group-hover/podcasts:opacity-50"
      onClick={() => {
        router.push(`/podcasts/${podcastId}`);
      }}
    >
      <figure className="relative flex flex-col gap-2 rounded-xl">
        {audio?.podcastId !== podcastId && (
          <span
            className="absolute bottom-12 right-1.5 z-20 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-primary opacity-0 shadow-lg shadow-primary/30 transition duration-200 hover:scale-[105%] group-hover:-translate-y-2 group-hover:opacity-100"
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              handlePlay();
            }}
          >
            <Play className="h-4 w-4 text-primary-foreground" />
          </span>
        )}
        <div className="relative aspect-square w-full overflow-hidden rounded-xl">
          <Image
            src={imageUrl}
            width={360}
            height={360}
            // fill
            // sizes="160"
            alt={title}
            className="aspect-square h-fit w-full rounded-xl object-cover object-center transition-transform group-hover:scale-105"
            placeholder="blur"
            blurDataURL="data:image/svg+xml;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAABCAQAAABN/Pf1AAAADUlEQVR42mP8X8+AAQAdgwGAL0naIQAAAABJRU5ErkJggg=="
          />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h3 className="truncate font-semibold">{title}</h3>
            {audio?.podcastId === podcastId && (
              <AudioLines className="h-4 w-4 animate-pulse text-primary" />
            )}
          </div>
          <p className="truncate text-sm font-normal capitalize text-muted-foreground">
            {description}
          </p>
        </div>
      </figure>
    </div>
  );
};
