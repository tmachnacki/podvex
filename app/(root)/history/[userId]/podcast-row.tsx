import { Id } from "@/convex/_generated/dataModel";
import { useAudio } from "@/providers/audio-provider";
import { TableRow, TableCell } from "@/components/ui/table";
import { useUpdateViews } from "@/hooks/use-update-views";
import { useUpdateListeners } from "@/hooks/use-update-listeners";
import { useUpdateHistory } from "@/hooks/use-update-history";
import {
  AudioLines,
  BookmarkMinus,
  BookmarkPlus,
  ExternalLink,
  MoreHorizontal,
  Play,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatTime, toTimeAgo } from "@/lib/utils";
import { toast } from "sonner";
import { useState } from "react";
import { LoadingSpinner } from "@/components/loading-spinner";

interface PodcastRowProps {
  currentUserId: string;
  podcast: {
    _id: Id<"podcasts">;
    user: Id<"users">;
    podcastTitle: string;
    podcastDescription: string;
    audioUrl: string;
    audioStorageId: Id<"_storage">;
    imageUrl: string;
    imageStorageId: Id<"_storage">;
    author: string;
    authorId: string;
    authorImageUrl: string;
    voicePrompt: string;
    imagePrompt: string;
    voiceType?: string;
    audioDuration: number;
    views: number;
  };
  lastPlayed?: number;
}

export const PodcastRow = ({
  currentUserId,
  podcast,
  lastPlayed,
}: PodcastRowProps) => {
  const { audio, setAudio } = useAudio();
  const isOwnPodcast = currentUserId === podcast.authorId;
  const isPlaying = audio?.podcastId === podcast._id;

  const userHasSaved = useQuery(api.users.getUserById, {
    clerkId: currentUserId,
  })?.savedPodcasts?.includes(podcast._id);
  const [isSavePending, setIsSavePending] = useState(false);
  const savePodcast = useMutation(api.users.savePodast);
  const unsavePodcast = useMutation(api.users.unsavePodast);

  const { updateViews } = useUpdateViews();
  const { updateListeners } = useUpdateListeners();
  const { updateHistory } = useUpdateHistory();

  const handlePlay = () => {
    setAudio({
      title: podcast.podcastTitle,
      audioUrl: podcast.audioUrl,
      imageUrl: podcast.imageUrl,
      author: podcast.author,
      podcastId: podcast._id,
    });
    updateViews({ podcastId: podcast._id });
    updateListeners({ listenerId: currentUserId, authorId: podcast.authorId });
    updateHistory({ userId: currentUserId, podcastId: podcast._id });
  };

  const handleSavePodcast = async () => {
    try {
      setIsSavePending(true);
      await savePodcast({ clerkId: currentUserId, podcastId: podcast._id });
      setIsSavePending(false);
      toast.success("Podcast added to your library");
    } catch (error) {
      setIsSavePending(false);
      toast.error("Error adding podcast to your library");
    }
  };

  const handleUnsavePodcast = async () => {
    try {
      setIsSavePending(true);
      await unsavePodcast({ clerkId: currentUserId, podcastId: podcast._id });
      setIsSavePending(false);
      toast("Podcast removed from your library");
    } catch (error) {
      setIsSavePending(false);
      toast.error("Error removing podcast from your library");
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

  return (
    <TableRow className="group/row">
      <TableCell>
        {isPlaying ? (
          <span className="flex h-10 w-10 cursor-default items-center justify-center">
            <AudioLines className="h-4 w-4 animate-pulse text-primary" />
          </span>
        ) : (
          <Button
            variant={"default"}
            size={"icon"}
            className="rounded-full opacity-0 focus-visible:opacity-100 group-hover/row:opacity-100"
            onClick={handlePlay}
          >
            <Play className="h-4 w-4" />
          </Button>
        )}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          {/* <div className="relative aspect-square w-12 overflow-hidden rounded-sm"> */}
          <Image
            src={podcast.imageUrl}
            width={80}
            height={80}
            // fill
            // sizes=""
            alt="podcast thumbnail"
            className="aspect-square w-10 rounded-sm object-cover object-center"
          />
          {/* </div> */}

          <div className="flex flex-col truncate">
            <Link
              href={`/podcasts/${podcast._id}`}
              className="block truncate hover:underline"
            >
              {podcast.podcastTitle}
            </Link>
            <Link
              href={`/profile/${podcast.authorId}`}
              className="block truncate text-sm text-muted-foreground hover:underline"
            >
              {podcast.author}
            </Link>
          </div>
        </div>
      </TableCell>
      <TableCell className="font-normal">
        {lastPlayed && toTimeAgo(new Date(lastPlayed))}
      </TableCell>
      <TableCell className="">{formatTime(podcast.audioDuration)}</TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant={"ghost"}
              size={"icon"}
              className="data-[state=open]:bg-accent"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="bottom" align="end">
            <DropdownMenuItem onClick={handleShareLink}>
              <ExternalLink className="mr-2 h-4 w-4" />
              Share Link
            </DropdownMenuItem>

            {userHasSaved ? (
              <DropdownMenuItem
                onClick={handleUnsavePodcast}
                disabled={isSavePending}
              >
                {isSavePending ? (
                  <LoadingSpinner className="mr-2 h-4 w-4 text-secondary-foreground" />
                ) : (
                  <BookmarkMinus className="mr-2 h-4 w-4" />
                )}
                Remove from library
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem
                onClick={handleSavePodcast}
                disabled={isSavePending}
              >
                {isSavePending ? (
                  <LoadingSpinner className="mr-2 h-4 w-4 text-secondary-foreground" />
                ) : (
                  <BookmarkPlus className="mr-2 h-4 w-4" />
                )}
                Add to library
              </DropdownMenuItem>
            )}

            {/* {isOwnPodcast && (
              <>
                <DropdownMenuSeparator />

                <DropdownMenuItem className="focus:bg-destructive/10 focus:text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </>
            )} */}
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};
