"use client";
import { Skeleton } from "./ui/skeleton";

export const PodcastCardSkeleton = () => (
  <div className="flex flex-col gap-2 rounded-xl">
    <Skeleton className="aspect-square w-full rounded-xl" />

    <div className="flex flex-col space-y-2">
      <Skeleton className="h-4 w-48" />
      <Skeleton className="h-3 w-full" />
    </div>
  </div>
);
