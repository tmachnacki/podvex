"use client";
import { LoadingSpinner } from "./loading-spinner";
import { PodcastCardSkeleton } from "./podcast-card-skeleton";

export const PodcastGridLoader = () => (
  <div className="flex w-full items-center justify-center">
    <LoadingSpinner className="h-6 w-6 text-primary" />
  </div>
);
