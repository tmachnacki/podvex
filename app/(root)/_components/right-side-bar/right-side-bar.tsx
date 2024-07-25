"use client";

import { SignedIn, UserButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React from "react";
// import Header from "./Header";
// import Carousel from "./Carousel";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
// import LoaderSpinner from "./LoaderSpinner";
import { useAudio } from "@/providers/audio-provider";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

const RightSidebar = () => {
  const { user } = useUser();
  const topPodcasters = useQuery(api.users.getTopUserByPodcastCount);
  const router = useRouter();

  const { audio } = useAudio();

  return (
    <section
      className={cn(
        "sticky right-0 top-0 flex h-[calc(100vh-5px)] w-[310px] flex-col overflow-y-hidden border-l border-border bg-neutral-50 px-[30px] pt-8 dark:bg-neutral-900 max-xl:hidden",
        {
          "h-[calc(100vh-124px)]": audio?.audioUrl,
        },
      )}
    >
      <SignedIn>
        <div className="flex gap-3">
          <UserButton />
          <Link
            href={`/profile/${user?.id}`}
            className="flex w-full items-center justify-between"
          >
            <h1 className="text-16 text-white-1 truncate font-semibold">
              {user?.firstName} {user?.lastName}
            </h1>
            <ChevronRight className="h-6 w-6 text-primary" />
          </Link>
        </div>
      </SignedIn>
      <section>
        {/* <Header headerTitle="Fans Like You" /> */}
        {/* <Carousel fansLikeDetail={topPodcasters!}/> */}
      </section>
      <section className="flex flex-col gap-8 pt-12">
        {/* <Header headerTitle="Top Podcastrs" /> */}
        <div className="flex flex-col gap-6">
          {topPodcasters?.slice(0, 3).map((podcaster) => (
            <div
              key={podcaster._id}
              className="flex cursor-pointer justify-between"
              onClick={() => router.push(`/profile/${podcaster.clerkId}`)}
            >
              <figure className="flex items-center gap-2">
                <Image
                  src={podcaster.imageUrl}
                  alt={podcaster.name}
                  width={44}
                  height={44}
                  className="aspect-square rounded-lg"
                />
                <h2 className="text-14 text-white-1 font-semibold">
                  {podcaster.name}
                </h2>
              </figure>
              <div className="flex items-center">
                <p className="text-12 text-white-1 font-normal">
                  {podcaster.totalPodcasts} podcasts
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
      Right Side Bar
    </section>
  );
};

export { RightSidebar };
