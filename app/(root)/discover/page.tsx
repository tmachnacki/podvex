"use client";
import React from "react";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

import { EmptyState } from "@/components/empty-state";
import { PodcastCard } from "@/components/podcast-card";
import { Search } from "./search";
import { LoadingSpinner } from "@/components/loading-spinner";
import { PodcastGrid } from "@/components/podcast-grid";
import { PodcastGridLoader } from "@/components/podcast-grid-skeleton";

export default function Discover({
  searchParams: { search },
}: {
  searchParams: { search: string };
}) {
  const podcastsData = useQuery(api.podcasts.getPodcastBySearch, {
    search: search || "",
  });

  return (
    <div className="flex flex-col gap-12">
      <Search />
      <div className="flex flex-col gap-8">
        <h1 className="text-xl font-bold">
          {!search ? "Discover Top Podcasts" : "Search results for "}
          {search && <span className="">{search}</span>}
        </h1>

        {podcastsData ? (
          podcastsData.length > 0 ? (
            <PodcastGrid>
              {podcastsData?.map(
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
            </PodcastGrid>
          ) : (
            <EmptyState title="No results found" search />
          )
        ) : (
          <PodcastGridLoader />
        )}
      </div>
    </div>
  );
}
