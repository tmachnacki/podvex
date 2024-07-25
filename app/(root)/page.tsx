"use client";
import { PodcastCard } from "@/components/podcast-card";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { LoadingSpinner } from "@/components/loading-spinner";
import { PodcastGrid } from "@/components/podcast-grid";
import { PodcastGridLoader } from "@/components/podcast-grid-skeleton";

const mockPodcastData = [
  {
    id: "1",
    title: "Podcast Title 1",
    description: "A long form, in-depth conversation",
    imgURL: "/podcast-cover.jpg",
  },
  {
    id: "2",
    title: "Podcast Title 2",
    description: "This is how the news should sound",
    imgURL: "/podcast-cover.jpg",
  },
  {
    id: "3",
    title: "Podcast Title 3",
    description: "And his name is John Cena",
    imgURL: "/podcast-cover.jpg",
  },
  {
    id: "4",
    title: "Podcast Title 4",
    description: "This is how the news should sound",
    imgURL: "/podcast-cover.jpg",
  },
  {
    id: "5",
    title: "Podcast Title 5",
    description: "A long form, in-depth conversation",
    imgURL: "/podcast-cover.jpg",
  },
  {
    id: "6",
    title: "Podcast Title 6",
    description: "And his name is John Cena",
    imgURL: "/podcast-cover.jpg",
  },
  {
    id: "7",
    title: "Podcast Title 7",
    description: "A long form, in-depth conversation",
    imgURL: "/podcast-cover.jpg",
  },
  {
    id: "8",
    title: "Podcast Title 8",
    description: "This is how the news should sound",
    imgURL: "/podcast-cover.jpg",
  },
];

export default function Home() {
  const trendingPodcasts = useQuery(api.podcasts.getTrendingPodcasts);

  const isLoadingTrendingPodcasts = !trendingPodcasts;

  return (
    <div className="flex flex-col gap-12 pt-12 md:overflow-hidden">
      <section className="flex flex-col space-y-8">
        <h1 className="text-xl font-bold">Trending Podcasts</h1>

        {trendingPodcasts ? (
          <PodcastGrid>
            {trendingPodcasts?.map(
              ({
                _id,
                podcastTitle,
                podcastDescription,
                imageUrl,
                audioUrl,
                author,
              }) => (
                <PodcastCard
                  key={_id}
                  imageUrl={imageUrl as string}
                  title={podcastTitle}
                  description={podcastDescription}
                  podcastId={_id}
                  audioUrl={audioUrl}
                  author={author}
                />
              ),
            )}

            {/* {mockPodcastData.map(({ id, title, description, imgURL }) => (
              <PodcastCard
                key={id}
                imgUrl={imgURL as string}
                title={title}
                description={description}
                podcastId={id}
              />
            ))} */}
          </PodcastGrid>
        ) : (
          <PodcastGridLoader />
        )}
      </section>
    </div>
  );
}
