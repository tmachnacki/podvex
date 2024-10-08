"use client";
import React from "react";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

import { EmptyState } from "@/components/empty-state";
import { PodcastCard } from "@/components/podcast-card";
import { Search } from "./search";
import { PodcastGrid } from "@/components/podcast-grid";
import { PodcastGridLoader } from "@/components/podcast-grid-skeleton";
import { useAuth } from "@clerk/nextjs";

export default function Discover({
  searchParams: { search },
}: {
  searchParams: { search: string };
}) {
  const podcastsData = useQuery(api.podcasts.getPodcastBySearch, {
    search: search || "",
  });
  const { userId } = useAuth();

  return (
    <div className="flex flex-col gap-12">
      <Search />
      <div className="flex flex-col gap-8">
        <h1 className="text-xl font-bold">
          {!search ? "Discover New Podcasts" : "Search results for "}
          {search && <span className="">{search}</span>}
        </h1>

        {podcastsData && userId ? (
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
            <EmptyState title="No results found" search />
          )
        ) : (
          <PodcastGridLoader />
        )}
      </div>
    </div>
  );
}
