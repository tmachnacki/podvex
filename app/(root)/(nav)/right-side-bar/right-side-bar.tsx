"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { LikeYouCarousel } from "./carousel";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAudio } from "@/providers/audio-provider";
import { cn } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Check } from "lucide-react";

const RightSidebar = () => {
  const topPodcasters = useQuery(api.users.getTopUserByPodcastCount);

  const { audio } = useAudio();

  return (
    <ScrollArea
      className={cn(
        "sticky right-0 top-0 h-screen flex-shrink-0 border-l-[1px] border-border bg-neutral-50 dark:bg-neutral-900 max-xl:hidden",
        audio?.audioUrl ? "h-[calc(100vh-124px)]" : "h-screen",
      )}
    >
      <section
        className={cn(
          "flex h-full w-[270px] flex-col px-8 py-12 text-sm",
          // audio?.audioUrl ? "h-[calc(100vh-124px)]" : "h-screen",
        )}
      >
        <section className="space-y-2 pb-12">
          <header className="flex items-center justify-between">
            <h4 className="text-base font-semibold">For Listeners Like You</h4>
          </header>

          <LikeYouCarousel topCreators={topPodcasters!} />
        </section>
        <section className="flex flex-col space-y-2">
          <header className="flex items-center justify-between">
            <h4 className="text-base font-semibold">Top creators</h4>
            {/* <Link
              href={"/discover"}
              className="text-muted-foreground hover:text-foreground"
            >
              See All
            </Link> */}
          </header>
          <ul className="">
            {topPodcasters?.slice(0, 4).map((podcaster) => (
              <li
                key={podcaster._id}
                className="border-b border-border py-3 last:border-none"
              >
                <Link
                  href={`/profile/${podcaster.clerkId}`}
                  className="flex cursor-pointer justify-between text-muted-foreground hover:text-foreground"
                >
                  <figure className="flex items-center gap-2">
                    <Image
                      src={podcaster.imageUrl}
                      alt={podcaster.name}
                      width={36}
                      height={36}
                      className="aspect-square rounded-md"
                    />
                    <h2 className="">{podcaster.name}</h2>
                    {podcaster.isVerified && (
                      <span className="flex h-3 w-3 items-center justify-center rounded-full bg-cyan-500 text-background">
                        <Check className="h-2 w-2 text-background" />
                      </span>
                    )}
                  </figure>
                  <div className="flex items-center">
                    <p className="">{podcaster.totalPodcasts} podcasts</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </section>
      <ScrollBar />
    </ScrollArea>
  );
};

export { RightSidebar };
