"use client";
import { cn } from "@/lib/utils";

interface PodastGridProps {
  className?: string;
  children?: React.ReactNode;
}

export const PodcastGrid = ({ className, children }: PodastGridProps) => {
  return (
    <div
      className={cn(
        "group/podcasts grid grid-cols-1 gap-2 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4",
        className,
      )}
    >
      {children}
    </div>
  );
};
