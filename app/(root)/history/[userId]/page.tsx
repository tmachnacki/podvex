"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { useState } from "react";
import { PodcastRow } from "./podcast-row";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const LIMIT = 48;
export default function History({ params }: { params: { userId: string } }) {
  const userPodcastHistory = useQuery(api.podcasts.getPodcastHistory, {
    userId: params.userId,
    limit: LIMIT,
  });

  const userListeningHistory = useQuery(api.history.getUserHistory, {
    userId: params.userId,
  });

  return (
    <div className="flex flex-col gap-12">
      <section className="flex flex-col gap-8">
        <h1 className="pt-12 text-xl font-bold">Your History</h1>

        {userPodcastHistory && userPodcastHistory.length > 0 && (
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
              {userPodcastHistory.map((podcast) => {
                if (!podcast) return null;
                return (
                  <PodcastRow
                    key={podcast._id}
                    currentUserId={params.userId}
                    podcast={podcast}
                    lastPlayed={
                      userListeningHistory?.find(
                        (h) => h.podcastId === podcast._id,
                      )?.listenedAt
                    }
                  />
                );
              })}
            </TableBody>
          </Table>
        )}
      </section>
    </div>
  );
}
