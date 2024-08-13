"use client";
import { PodcastCard } from "@/components/podcast-card";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { PodcastGrid } from "@/components/podcast-grid";
import { PodcastGridLoader } from "@/components/podcast-grid-skeleton";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";

export default function Home() {
  const { isLoaded, isSignedIn, userId } = useAuth();
  const trendingPodcasts = useQuery(api.podcasts.getTrendingPodcasts);
  const podcastHistory = useQuery(api.podcasts.getPodcastHistory, {
    userId: userId ? userId : undefined,
  });

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

      {podcastHistory && podcastHistory.length > 0 && (
        <section className="flex flex-col space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Jump Back In</h2>
            <Link
              href={`/history/${userId}`}
              className="text-muted-foreground hover:text-foreground"
            >
              See History
            </Link>
          </div>
          {trendingPodcasts && userId && isLoaded ? (
            <PodcastGrid>
              {podcastHistory?.map((podcast) => {
                if (!podcast) return;

                return (
                  <PodcastCard
                    key={podcast?._id}
                    imageUrl={podcast?.imageUrl as string}
                    title={podcast?.podcastTitle}
                    description={podcast.podcastDescription}
                    podcastId={podcast?._id}
                    audioUrl={podcast?.audioUrl}
                    author={podcast?.author}
                    authorId={podcast?.authorId}
                    currentUserId={userId}
                  />
                );
              })}
            </PodcastGrid>
          ) : (
            <PodcastGridLoader />
          )}
        </section>
      )}
    </div>
  );
}
