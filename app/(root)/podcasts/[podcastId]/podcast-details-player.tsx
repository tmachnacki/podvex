"use client";
import { useMutation } from "convex/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

import { useAudio } from "@/providers/audio-provider";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/loading-spinner";
import { Play } from "lucide-react";
import Link from "next/link";

import { Separator } from "@/components/ui/separator";

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
}: PodcastDetailPlayerProps) => {
  const { setAudio } = useAudio();

  const handlePlay = () => {
    setAudio({
      title: podcastTitle,
      audioUrl,
      imageUrl,
      author,
      podcastId,
    });
  };

  const handleFavorite = () => {};

  const timestamp = new Date(creationTime).toLocaleDateString();

  if (!imageUrl || !authorImageUrl) return <LoadingSpinner className="" />;

  return (
    <div className="flex w-full justify-between max-md:justify-center">
      <div className="flex w-full flex-col gap-12 max-md:items-center md:flex-row">
        <div className="relative aspect-square h-60 w-60 shrink-0 rounded-xl bg-transparent">
          <Image
            src={imageUrl}
            fill
            sizes="240"
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
        <div className="flex w-full flex-grow flex-col gap-12 max-md:items-center">
          <article className="flex flex-col gap-3">
            <div className="flex">
              <h1 className="mr-2 text-3xl font-bold">{podcastTitle}</h1>
            </div>
            <Link
              className="flex w-fit cursor-pointer items-center gap-2"
              href={`/profile/${authorId}`}
            >
              <Image
                src={authorImageUrl}
                width={32}
                height={32}
                alt="Caster icon"
                className="aspect-square rounded-full object-cover"
              />
              <h2 className="text-base text-muted-foreground hover:underline">
                {author}
              </h2>
            </Link>
            {/* <div className="text-light flex items-center space-x-2 text-sm text-muted-foreground/60">
              <p>{audioDuration}</p>
              <Separator orientation="vertical" />
              <p>{timestamp}</p>
            </div> */}
          </article>

          <Button
            onClick={handlePlay}
            className="w-full max-w-56 shadow-xl shadow-primary/30 transition-transform hover:scale-[102%] md:hover:scale-[103%]"
          >
            <Play className="mr-2 h-4 w-4" />
            Play Podcast
          </Button>
        </div>
      </div>
    </div>
  );
};
