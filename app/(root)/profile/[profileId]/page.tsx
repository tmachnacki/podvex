"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

import { EmptyState } from "@/components/empty-state";
import { LoadingSpinner } from "@/components/loading-spinner";
import { PodcastCard } from "@/components/podcast-card";
import { ProfileCard } from "./profile-card";
import { PodcastGrid } from "@/components/podcast-grid";
import { useAuth } from "@clerk/nextjs";

export default function ProfilePage({
  params,
}: {
  params: {
    profileId: string;
  };
}) {
  const authorUser = useQuery(api.users.getUserById, {
    clerkId: params.profileId,
  });
  const podcastsData = useQuery(api.podcasts.getPodcastByAuthorId, {
    authorId: params.profileId,
  });
  const { userId } = useAuth();

  const isOwnProfile = userId === params.profileId;

  if (!authorUser || !podcastsData || !userId) {
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
          listeners={authorUser.listeners.length}
          totalViews={podcastsData.totalViews}
          podcasts={podcastsData?.podcasts!}
          imageUrl={authorUser?.imageUrl!}
          userFirstName={authorUser?.name!}
          isVerified={authorUser.isVerified}
          currentUserId={userId}
          profileId={params.profileId}
        />
      </div>
      <section className="flex flex-col pt-12">
        <h1 className="pb-8 text-lg font-bold">
          {isOwnProfile
            ? "Your"
            : `${authorUser?.name}${authorUser?.name.endsWith("s") ? "'" : "'s"}`}
          {" Podcasts"}
        </h1>
        {podcastsData && podcastsData.podcasts.length > 0 ? (
          <PodcastGrid>
            {podcastsData.podcasts
              ?.slice(0, 8)
              .map((podcast) => (
                <PodcastCard
                  key={podcast._id}
                  imageUrl={podcast.imageUrl!}
                  title={podcast.podcastTitle!}
                  description={podcast.podcastDescription}
                  podcastId={podcast._id}
                  audioUrl={podcast.audioUrl!}
                  author={podcast.author!}
                  authorId={podcast.authorId!}
                  currentUserId={userId}
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
