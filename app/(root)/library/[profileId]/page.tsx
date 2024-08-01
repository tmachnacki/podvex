"use client";

import { PodcastCard } from "@/components/podcast-card";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { PodcastGrid } from "@/components/podcast-grid";
import { PodcastGridLoader } from "@/components/podcast-grid-skeleton";
import { EmptyState } from "@/components/empty-state";
import { useAuth, useUser } from "@clerk/nextjs";
import { useEffect } from "react";

export default function Library({ params }: { params: { profileId: string } }) {
  const { isLoaded, isSignedIn, userId } = useAuth();

  const savedPodcastsData = useQuery(api.podcasts.getSavedPodcasts, {
    clerkId: params.profileId,
  });

  useEffect(() => {
    console.log(savedPodcastsData);
  }, [savedPodcastsData]);

  return (
    <div className="flex flex-col gap-12">
      <section className="flex flex-col gap-8">
        <h1 className="pt-12 text-xl font-bold">Your Library</h1>

        {savedPodcastsData && isLoaded && userId ? (
          savedPodcastsData.length > 0 ? (
            <PodcastGrid>
              {savedPodcastsData.map((podcast) => {
                if (!podcast) return null;
                return (
                  <PodcastCard
                    key={podcast._id!}
                    imageUrl={podcast.imageUrl as string}
                    title={podcast.podcastTitle}
                    description={podcast.podcastDescription}
                    podcastId={podcast._id}
                    audioUrl={podcast.audioUrl}
                    author={podcast.author}
                    authorId={podcast.authorId}
                    currentUserId={userId}
                  />
                );
              })}
            </PodcastGrid>
          ) : (
            <EmptyState
              title="No podcasts saved"
              buttonLink="/discover"
              buttonText="Discover podcasts"
            />
          )
        ) : (
          <PodcastGridLoader />
        )}
      </section>
    </div>
  );
}
