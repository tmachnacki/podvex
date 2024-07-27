"use client";

import { SignedIn, UserButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { LikeYouCarousel } from "./carousel";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { useAudio } from "@/providers/audio-provider";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Id } from "@/convex/_generated/dataModel";
import { UserNav } from "@/components/user-nav";

const RightSidebar = () => {
  const { user } = useUser();
  const topPodcasters = useQuery(api.users.getTopUserByPodcastCount);
  const router = useRouter();

  const { audio } = useAudio();

  return (
    <ScrollArea
      className={cn(
        "sticky right-0 top-0 h-screen w-[320px] border-l-[1px] border-border bg-neutral-50 dark:bg-neutral-900 max-xl:hidden",
        audio?.audioUrl ? "h-[calc(100vh-124px)]" : "h-screen",
      )}
    >
      <section
        className={cn(
          "flex w-full flex-col px-8 py-12 text-sm",
          audio?.audioUrl ? "h-[calc(100vh-124px)]" : "h-screen",
        )}
      >
        {/* <SignedIn>
          <div className="flex gap-3 pb-12">
            <UserButton />
            <Link
              href={`/profile/${user?.id}`}
              className="flex w-full items-center justify-between"
            >
              <h1 className="truncate font-semibold">
                {user?.firstName} {user?.lastName}
              </h1>
              <ChevronRight className="h-5 w-5 text-primary" />
            </Link>
          </div>
        </SignedIn> */}
        {/* <UserNav isMobileNav={false} /> */}
        <section className="space-y-2 pb-12">
          <header className="flex items-center justify-between">
            <h4 className="text-base font-semibold">For Listeners Like You</h4>
          </header>

          <LikeYouCarousel topCreators={topPodcasters!} />
        </section>
        <section className="flex flex-col space-y-2 pt-12">
          <header className="flex items-center justify-between">
            <h4 className="text-base font-semibold">Top creators</h4>
            <Link
              href={"/discover"}
              className="text-muted-foreground hover:text-foreground"
            >
              See All
            </Link>
          </header>
          <ul className="">
            {topPodcasters?.slice(0, 4).map((podcaster) => (
              <li
                key={podcaster._id}
                className="border-b border-border py-3 last:border-none"
                // onClick={() => router.push(`/profile/${podcaster.clerkId}`)}
              >
                <Link
                  href={`/profile/${podcaster.clerkId}`}
                  // key={podcaster._id}
                  className="flex cursor-pointer justify-between text-muted-foreground hover:text-foreground"
                  // onClick={() => router.push(`/profile/${podcaster.clerkId}`)}
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
