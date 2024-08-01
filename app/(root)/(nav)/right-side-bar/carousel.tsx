"use client";
import { useRef } from "react";

import Autoplay from "embla-carousel-autoplay";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Id } from "@/convex/_generated/dataModel";
import { LoadingSpinner } from "@/components/loading-spinner";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export interface TopCreator {
  _id: Id<"users">;
  _creationTime: number;
  email: string;
  imageUrl: string;
  clerkId: string;
  name: string;
  podcast: {
    podcastTitle: string;
    podcastId: Id<"podcasts">;
  }[];
  totalPodcasts: number;
}

export const LikeYouCarousel = ({
  topCreators,
}: {
  topCreators: TopCreator[];
}) => {
  const router = useRouter();
  const plugin = useRef(Autoplay({ delay: 4000, stopOnInteraction: true }));

  const creatorSlides =
    topCreators && topCreators?.filter((item: any) => item.totalPodcasts > 0);

  if (!creatorSlides) {
    return (
      <div className="flex aspect-square w-full items-center justify-center">
        <LoadingSpinner className="h-4 w-4 text-foreground" />
      </div>
    );
  }

  return (
    <Carousel
      plugins={[plugin.current]}
      className="w-full max-w-xs"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent>
        {/* Carouesel Items */}
        {creatorSlides.slice(0, 5).map((creatorSlide) => (
          <CarouselItem key={creatorSlide._id} className="border-none">
            <Link
              className="relative flex aspect-square h-fit w-full flex-none cursor-pointer flex-col justify-end overflow-hidden rounded-xl border-none"
              // onClick={() =>
              //   router.push(`/podcasts/${creatorSlide.podcast[0]?.podcastId}`)
              // }
              href={`/podcasts/${creatorSlide.podcast[0]?.podcastId}`}
            >
              <Image
                src={creatorSlide.imageUrl}
                alt={"creator profile image"}
                fill
                sizes="240"
                className="absolute size-full rounded-xl border-none"
              />
              <div className="relative z-10 flex flex-col rounded-b-xl bg-black/60 p-4 backdrop-blur-sm">
                <h2 className="text-white">
                  {creatorSlide.podcast[0]?.podcastTitle}
                </h2>
                <p className="text-sm text-neutral-400">{creatorSlide.name}</p>
              </div>
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-0 -translate-x-1/2" />
      <CarouselNext className="right-0 translate-x-1/2" />
    </Carousel>
  );
};
