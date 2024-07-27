"use client";
import { PodcastCard } from "@/components/podcast-card";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { PodcastGrid } from "@/components/podcast-grid";
import { PodcastGridLoader } from "@/components/podcast-grid-skeleton";
import { useAuth } from "@clerk/nextjs";

export default function Home() {
  const trendingPodcasts = useQuery(api.podcasts.getTrendingPodcasts);
  const { isLoaded, isSignedIn, userId } = useAuth();

  const isLoading = !trendingPodcasts || !isLoaded || !userId;

  return (
    <div className="flex flex-col gap-12 pt-12 md:overflow-hidden">
      <section className="flex flex-col space-y-8">
        <h1 className="text-xl font-bold">Trending Podcasts</h1>

        {trendingPodcasts && userId && isLoaded ? (
          <PodcastGrid>
            {trendingPodcasts?.map(
              ({
                _id,
                podcastTitle,
                podcastDescription,
                imageUrl,
                audioUrl,
                author,
                authorId,
              }) => (
                <PodcastCard
                  key={_id}
                  imageUrl={imageUrl as string}
                  title={podcastTitle}
                  description={podcastDescription}
                  podcastId={_id}
                  audioUrl={audioUrl}
                  author={author}
                  authorId={authorId}
                  currentUserId={userId}
                />
              ),
            )}
          </PodcastGrid>
        ) : (
          <PodcastGridLoader />
        )}
      </section>
    </div>
  );
}
