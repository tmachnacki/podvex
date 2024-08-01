"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

import { useAudio } from "@/providers/audio-provider";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/loading-spinner";
import { Doc } from "@/convex/_generated/dataModel";
import { AudioLines, Check, Headphones, Shuffle } from "lucide-react";
import ShimmerButton from "@/components/magicui/shimmer-button";
import Link from "next/link";
import { useRouter } from "next/navigation";

export interface ProfileCardProps {
  podcasts: Doc<"podcasts">[];
  totalViews: number;
  listeners: number;
  imageUrl: string;
  userFirstName: string;
  isVerified: boolean;
  currentUserId: string;
  profileId: string;
}

export const ProfileCard = ({
  podcasts,
  totalViews,
  listeners,
  imageUrl,
  userFirstName,
  isVerified,
  currentUserId,
  profileId,
}: ProfileCardProps) => {
  const { setAudio } = useAudio();
  const router = useRouter();

  const [randomPodcast, setRandomPodcast] = useState<Doc<"podcasts"> | null>(
    null,
  );

  const isOwnProfile = profileId === currentUserId;

  const playRandomPodcast = () => {
    const randomIndex = Math.floor(Math.random() * podcasts.length);

    setRandomPodcast(podcasts[randomIndex]);
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

  // if (!imageUrl) return <LoadingSpinner />;

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
          <div className="flex items-center space-x-3">
            <h1 className="text-3xl font-bold leading-none">{userFirstName}</h1>

            {!isVerified && isOwnProfile && (
              <ShimmerButton
                className="h-10"
                shimmerColor="#06b6d4"
                onClick={() => router.push(`/get-verified/${currentUserId}`)}
              >
                <div className="flex items-center justify-center space-x-3 text-foreground">
                  <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-cyan-500">
                    <Check className="h-2 w-2 text-background" />
                  </span>
                  <span className="text-foreground">Get Verified</span>
                </div>
              </ShimmerButton>
            )}
          </div>

          {isVerified && (
            <figure className="flex items-center gap-2 pt-4">
              <span className="inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-cyan-500">
                <Check className="h-2 w-2 text-background" />
              </span>
              <h2 className="text-sm text-muted-foreground">
                Verified Creator
              </h2>
            </figure>
          )}
          <figure className="flex items-center gap-3 pt-4">
            <Headphones className="h-5 w-5 text-muted-foreground" />
            <p className="font-semibold">
              {listeners} &nbsp;
              <span className="text-sm font-normal text-muted-foreground">
                listeners
              </span>
            </p>
          </figure>

          <figure className="flex items-center gap-3 pb-12 pt-4">
            <AudioLines className="h-5 w-5 text-muted-foreground" />
            <p className="font-semibold">
              {totalViews} &nbsp;
              <span className="text-sm font-normal text-muted-foreground">
                plays
              </span>
            </p>
          </figure>

          {podcasts.length > 0 && (
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
