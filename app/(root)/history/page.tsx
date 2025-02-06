"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { useAuth } from "@clerk/nextjs";
import { PodcastRow } from "./podcast-row";
import { Clock } from "lucide-react";
import { LoadingSpinner } from "@/components/loading-spinner";

const LIMIT = 48;
export default function History() {
  const { isLoaded, isSignedIn, userId: clerkId } = useAuth();

  const userPodcastHistory = useQuery(api.podcasts.getPodcastHistory, {
    limit: LIMIT,
  });
  const userListeningHistory = useQuery(api.history.getCurrentUserHistory);

  const showHistory =
    userPodcastHistory && userPodcastHistory.length > 0 && isLoaded && clerkId;

  return (
    <div className="flex flex-col gap-12">
      <section className="flex flex-col gap-8">
        <h1 className="pt-12 text-xl font-bold">Your History</h1>

        <Table>
          <TableCaption>A list of your recent podcasts.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-8"></TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Last Played</TableHead>
              <TableHead>
                <Clock className="h-4 w-4" />
              </TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {showHistory ? (
              userPodcastHistory.map((podcast) => {
                if (!podcast) return null;
                return (
                  <PodcastRow
                    key={podcast._id}
                    currentUserId={clerkId}
                    podcast={podcast}
                    lastPlayed={
                      userListeningHistory?.find(
                        (h) => h.podcastId === podcast._id,
                      )?.listenedAt
                    }
                  />
                );
              })
            ) : (
              <div className="flex w-full items-center justify-center">
                <LoadingSpinner />
              </div>
            )}
          </TableBody>
        </Table>
      </section>
    </div>
  );
}
