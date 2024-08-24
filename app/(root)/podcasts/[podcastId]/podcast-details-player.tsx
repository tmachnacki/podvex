"use client";
import { useMutation, useQuery } from "convex/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

import { useAudio } from "@/providers/audio-provider";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/loading-spinner";
import {
  AudioLines,
  BookmarkMinus,
  BookmarkPlus,
  Circle,
  Play,
} from "lucide-react";
import Link from "next/link";
import { useUpdateViews } from "@/hooks/use-update-views";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useUpdateHistory } from "@/hooks/use-update-history";
import { toTimeAgo } from "@/lib/utils";

export interface PodcastDetailPlayerProps {
  audioUrl: string;
  podcastTitle: string;
  author: string;
  isOwner: boolean;
  imageUrl: string;
  podcastId: Id<"podcasts">;
  imageStorageId: Id<"_storage">;
  audioStorageId: Id<"_storage">;
  authorImageUrl: string;
  authorId: string;
  views: number;
  audioDuration: number;
  creationTime: number;
  userId: string;
}

export const PodcastDetailPlayer = ({
  audioUrl,
  podcastTitle,
  author,
  imageUrl,
  podcastId,
  imageStorageId,
  audioStorageId,
  isOwner,
  authorImageUrl,
  authorId,
  views,
  creationTime,
  audioDuration,
  userId,
}: PodcastDetailPlayerProps) => {
  const { audio, setAudio } = useAudio();

  const userHasSaved = useQuery(api.users.getUserById, {
    clerkId: userId,
  })?.savedPodcasts?.includes(podcastId);
  const [optimisticSaved, setOptimisticSaved] = useState<boolean | undefined>(
    userHasSaved,
  );
  const [isSavePending, setIsSavePending] = useState(false);

  const savePodcast = useMutation(api.users.savePodast);
  const unsavePodcast = useMutation(api.users.unsavePodast);
  const [canIncreaseViews, setCanIncreaseViews] = useState(true);

  const { updateViews } = useUpdateViews();
  const { updateHistory } = useUpdateHistory();

  const handlePlay = () => {
    setAudio({
      title: podcastTitle,
      audioUrl,
      imageUrl,
      author,
      podcastId,
    });

    if (canIncreaseViews) {
      updateViews({ podcastId });
      setCanIncreaseViews(false);
    }

    updateHistory({ userId: userId, podcastId });
  };

  const handleSavePodcast = async () => {
    try {
      setIsSavePending(true);
      await savePodcast({ clerkId: userId, podcastId });
      setIsSavePending(false);
      toast.success("Podcast added to your library");
    } catch (error) {
      setIsSavePending(false);
      toast.error("Error adding podcast to your library");
    }
  };

  const handleUnsavePodcast = async () => {
    try {
      setIsSavePending(true);
      await unsavePodcast({ clerkId: userId, podcastId });
      setIsSavePending(false);
      toast("Podcast removed from your library");
    } catch (error) {
      setIsSavePending(false);
      toast.error("Error removing podcast from your library");
    }
  };

  const timestamp = toTimeAgo(new Date(creationTime));

  if (!imageUrl || !authorImageUrl) return <LoadingSpinner className="" />;

  return (
    <div className="flex w-full justify-between max-md:justify-center">
      <div className="flex w-full flex-col gap-12 max-md:items-center md:flex-row">
        <div className="relative aspect-square h-60 w-60 shrink-0 rounded-xl bg-transparent">
          <Image
            src={imageUrl}
            width={400}
            height={400}
            // fill
            // sizes="240"
            alt="Podcast thumbnail"
            className="absolute inset-0 z-20 aspect-square h-full w-full rounded-xl object-cover object-center"
          />
          <Image
            src={imageUrl}
            fill
            sizes="240"
            alt="Podcast thumbnail blurred background"
            className="absolute inset-0 z-10 aspect-square rounded-xl opacity-50 blur-2xl"
          />
        </div>
        <div className="flex w-full flex-col gap-12 max-md:items-center">
          <article className="flex flex-col gap-3">
            <h1 className="block text-3xl font-bold">{podcastTitle}</h1>
            <div className="inline-flex items-center space-x-2">
              <Link
                className="inline-flex w-fit cursor-pointer items-center gap-2"
                href={`/profile/${authorId}`}
              >
                <Image
                  src={authorImageUrl}
                  width={32}
                  height={32}
                  alt="Caster icon"
                  className="aspect-square rounded-full object-cover"
                />
                <h2 className="text-base hover:underline">{author}</h2>
              </Link>
              <Circle className="h-1 w-1 shrink-0 fill-current text-muted-foreground" />
              <p className="text-muted-foreground/70">{timestamp}</p>
            </div>
          </article>

          <div className="flex items-center gap-2">
            {audio?.podcastId === podcastId ? (
              <span className="flex h-10 cursor-default items-center justify-center px-2 font-semibold text-foreground">
                <AudioLines className="mr-2 h-4 w-4 animate-pulse text-primary" />
                {`Now playing`}
              </span>
            ) : (
              <Button
                onClick={handlePlay}
                className="w-fit shadow-xl shadow-primary/30 transition-transform hover:scale-[102%] md:hover:scale-[103%]"
              >
                <Play className="mr-2 h-4 w-4" />
                Play Podcast
              </Button>
            )}

            {userHasSaved !== undefined && (
              <TooltipProvider delayDuration={500}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      disabled={isSavePending}
                      variant={"secondary"}
                      size={"icon"}
                      onClick={
                        userHasSaved ? handleUnsavePodcast : handleSavePodcast
                      }
                    >
                      {isSavePending ? (
                        <LoadingSpinner className="h-4 w-4 text-secondary-foreground" />
                      ) : userHasSaved ? (
                        <BookmarkMinus className="h-4 w-4" />
                      ) : (
                        <BookmarkPlus className="h-4 w-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {userHasSaved ? "Remove from library" : "Add to library"}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
