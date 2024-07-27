"use client";

import { EmptyState } from "@/components/empty-state";
import { LoadingSpinner } from "@/components/loading-spinner";
import { PodcastDetailPlayer } from "./podcast-details-player";
import { PodcastCard } from "@/components/podcast-card";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import {
  Headphones,
  Sparkles,
  MoreVertical,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function PodcastDetails({
  params: { podcastId },
}: {
  params: { podcastId: Id<"podcasts"> };
}) {
  const router = useRouter();
  const { user } = useUser();
  const [isDeleting, setIsDeleting] = useState(false);
  const deletePodcast = useMutation(api.podcasts.deletePodcast);
  const increaseViews = useMutation(api.podcasts.updatePodcastViews);
  const podcast = useQuery(api.podcasts.getPodcastById, { podcastId });
  const similarPodcasts = useQuery(api.podcasts.getPodcastByVoiceType, {
    podcastId,
  });

  const isOwner = user?.id === podcast?.authorId;

  // useEffect(() => {
  //   const handleUpdateViews = async () => {
  //     try {
  //       await increaseViews({ podcastId: podcastId });
  //     } catch (error) {
  //       console.error(error);
  //       toast.error("Error viewing podcast");
  //     }
  //   };

  //   handleUpdateViews();
  // }, [podcastId, increaseViews]);

  const handleDelete = async () => {
    if (!podcastId || !podcast) {
      return toast.error("Attempteed to delete podcast with missing arguments");
    }
    try {
      setIsDeleting(true);
      await deletePodcast({
        podcastId,
        imageStorageId: podcast?.imageStorageId,
        audioStorageId: podcast?.audioStorageId,
      });
      setIsDeleting(false);
      toast("Podcast deleted");
      router.push("/");
    } catch (error) {
      setIsDeleting(false);
      console.error("Error deleting podcast", error);
      toast.error("Error deleting podcast");
    }
  };

  const handleShareLink = () => {
    try {
      navigator.clipboard.writeText(`${window.location.href}`);
      toast(`Link copied to clipboard`);
    } catch (error) {
      toast.error("Error copying link to clipboard");
    }
  };

  if (!similarPodcasts || !podcast || !user)
    return (
      <div className="mt-12 flex w-full items-center justify-center">
        <LoadingSpinner className="h-6 w-6" />
      </div>
    );

  return (
    <section className="flex w-full flex-col space-y-12 pt-12">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Podcast Details</h1>
        <div className="flex items-center gap-4">
          <figure className="flex gap-2">
            <Headphones className="h-5 w-5" />
            <h2 className="font-semibold">{podcast?.views}</h2>
          </figure>
          <Dialog>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size={"icon"}
                  variant={"ghost"}
                  className="data-[state=open]:bg-accent"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="bottom" align="end">
                <DropdownMenuItem onClick={handleShareLink}>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Share link
                </DropdownMenuItem>
                {isOwner && (
                  <>
                    <DropdownMenuSeparator />
                    <DialogTrigger asChild>
                      <DropdownMenuItem className="">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DialogTrigger>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Podcast?</DialogTitle>
                <DialogDescription>
                  Are your sure you want to delete this podcast and all its
                  data? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant={"outline"}>Cancel</Button>
                </DialogClose>

                <Button
                  variant={"destructive"}
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  Delete
                  {isDeleting && <LoadingSpinner className="ml-2" />}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <PodcastDetailPlayer
        isOwner={isOwner}
        podcastId={podcast._id}
        creationTime={podcast._creationTime}
        userId={user?.id}
        {...podcast}
      />

      <div className="space-y-2">
        <h2 className="font-semibold">Description</h2>
        <p className="text-muted-foreground">{podcast?.podcastDescription}</p>
      </div>

      {podcast?.voicePrompt && (
        <div className="space-y-2">
          <div className="flex items-center space-x-4">
            <h2 className="font-semibold">Transcription</h2>

            <div className="flex h-7 items-center justify-center rounded-full border border-border px-3.5 text-sm font-semibold">
              <span className="bg-gradient-to-r from-orange-600 to-primary bg-clip-text text-transparent">
                Made with AI
              </span>
              <Sparkles className="ml-2 h-4 w-4 text-primary" />
            </div>
          </div>
          <p className="text-muted-foreground">{podcast?.voicePrompt}</p>
        </div>
      )}

      {podcast?.imagePrompt && (
        <div className="space-y-2">
          <div className="flex items-center space-x-4">
            <h2 className="font-semibold">Thumbnail Prompt</h2>

            <div className="flex h-7 items-center justify-center rounded-full border border-border px-3.5 text-sm font-semibold">
              <span className="bg-gradient-to-r from-orange-600 to-primary bg-clip-text text-transparent">
                Made with AI
              </span>
              <Sparkles className="ml-2 h-4 w-4 text-primary" />
            </div>
          </div>
          <p className="text-muted-foreground">{podcast?.imagePrompt}</p>
        </div>
      )}

      <Separator orientation="horizontal" />

      <section className="mt-8 flex flex-col gap-6">
        <h1 className="font-semibold">You May Also Like</h1>

        {similarPodcasts && similarPodcasts.length > 0 ? (
          <div className="group/podcasts grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {similarPodcasts?.map(
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
          </div>
        ) : (
          <>
            <EmptyState
              title="No similar podcasts found"
              buttonLink="/discover"
              buttonText="Discover more podcasts"
            />
          </>
        )}
      </section>
    </section>
  );
}
