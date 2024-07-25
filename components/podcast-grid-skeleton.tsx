"use client";
import { LoadingSpinner } from "./loading-spinner";
import { PodcastCardSkeleton } from "./podcast-card-skeleton";

export const PodcastGridLoader = () => (
  // <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
  //   <PodcastCardSkeleton />
  //   <PodcastCardSkeleton />
  //   <PodcastCardSkeleton />
  //   <PodcastCardSkeleton />
  // </div>
  <div className="flex w-full items-center justify-center">
    <LoadingSpinner className="h-6 w-6 text-primary" />
  </div>
);
