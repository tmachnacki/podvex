"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

import { useAudio } from "@/providers/audio-provider";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/loading-spinner";
import { Doc } from "@/convex/_generated/dataModel";
import { Check, CheckCheck, Headphones, Shuffle } from "lucide-react";

export interface ProfilePodcastProps {
  podcasts: Doc<"podcasts">[];
  listeners: number;
}

export interface ProfileCardProps {
  podcastData: ProfilePodcastProps;
  imageUrl: string;
  userFirstName: string;
}

export const ProfileCard = ({
  podcastData,
  imageUrl,
  userFirstName,
}: ProfileCardProps) => {
  const { setAudio } = useAudio();

  const [randomPodcast, setRandomPodcast] = useState<Doc<"podcasts"> | null>(
    null,
  );

  const playRandomPodcast = () => {
    const randomIndex = Math.floor(Math.random() * podcastData.podcasts.length);

    setRandomPodcast(podcastData.podcasts[randomIndex]);
  };

  useEffect(() => {
    if (randomPodcast) {
      setAudio({
        title: randomPodcast.podcastTitle,
        audioUrl: randomPodcast.audioUrl || "",
        imageUrl: randomPodcast.imageUrl || "",
        author: randomPodcast.author,
        podcastId: randomPodcast._id,
      });
    }
  }, [randomPodcast, setAudio]);

  if (!imageUrl) return <LoadingSpinner />;

  return (
    <div className="flex flex-col gap-12 max-md:items-center md:flex-row">
      <div className="relative aspect-square w-60 shrink-0">
        <Image
          src={imageUrl}
          fill
          sizes={"240px"}
          alt="Podcast author"
          className="absolute inset-0 z-20 aspect-square rounded-xl object-cover object-center"
        />
        <Image
          src={imageUrl}
          fill
          sizes={"240px"}
          alt="Podcast author blurred background"
          className="absolute inset-0 z-10 aspect-square rounded-xl opacity-50 blur-2xl"
        />
      </div>
      <div className="flex flex-col max-md:items-center">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold leading-none">{userFirstName}</h1>
          <figure className="flex translate-y-0.5 items-center gap-2 pt-4">
            <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-cyan-500">
              <Check className="h-2 w-2 text-white" />
            </span>
            <h2 className="text-sm text-muted-foreground">Verified Creator</h2>
          </figure>

          <figure className="flex items-center gap-3 pb-12 pt-4">
            <Headphones className="h-5 w-5 text-muted-foreground" />
            <h2 className="font-semibold">
              {podcastData?.listeners} &nbsp;
              <span className="text-sm font-normal text-muted-foreground">
                monthly plays
              </span>
            </h2>
          </figure>

          {podcastData?.podcasts.length > 0 && (
            <Button
              onClick={playRandomPodcast}
              className="shadow-xl shadow-primary/30 transition-transform hover:scale-[102%] md:hover:scale-[103%]"
            >
              <Shuffle className="mr-2 h-4 w-4" />
              Play a random podcast
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
