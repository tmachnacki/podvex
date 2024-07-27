"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

import { EmptyState } from "@/components/empty-state";
import { LoadingSpinner } from "@/components/loading-spinner";
import { PodcastCard } from "@/components/podcast-card";
import { ProfileCard } from "./profile-card";
import { PodcastGrid } from "@/components/podcast-grid";

export default function ProfilePage({
  params,
}: {
  params: {
    profileId: string;
  };
}) {
  const user = useQuery(api.users.getUserById, {
    clerkId: params.profileId,
  });
  const podcastsData = useQuery(api.podcasts.getPodcastByAuthorId, {
    authorId: params.profileId,
  });

  if (!user || !podcastsData) {
    return (
      <section className="flex flex-col">
        <h1 className="pb-8 pt-12 text-xl font-bold max-md:text-center">
          Podvex Profile
        </h1>
        <div className="flex items-center justify-center">
          <LoadingSpinner className="h-6 w-6" />
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col">
      <h1 className="pb-8 pt-12 text-xl font-bold max-md:text-center">
        Podvex Profile
      </h1>
      <div className="flex flex-col gap-6 max-md:items-center md:flex-row">
        <ProfileCard
          podcastData={podcastsData!}
          imageUrl={user?.imageUrl!}
          userFirstName={user?.name!}
        />
      </div>
      <section className="flex flex-col pt-12">
        <h1 className="pb-8 text-lg font-bold">
          {`${user?.name}${user?.name.endsWith("s") ? "'" : "'s"} Podcasts`}
        </h1>
        {podcastsData && podcastsData.podcasts.length > 0 ? (
          <PodcastGrid>
            {podcastsData?.podcasts
              ?.slice(0, 4)
              .map((podcast) => (
                <PodcastCard
                  key={podcast._id}
                  imageUrl={podcast.imageUrl!}
                  title={podcast.podcastTitle!}
                  description={podcast.podcastDescription}
                  podcastId={podcast._id}
                  audioUrl={podcast.audioUrl!}
                  author={podcast.author!}
                />
              ))}
          </PodcastGrid>
        ) : (
          <EmptyState
            title="You have not created any podcasts yet"
            buttonLink="/create"
            buttonText="Create Podcast"
          />
        )}
      </section>
    </section>
  );
}
