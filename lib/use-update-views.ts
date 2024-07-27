import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { toast } from "sonner";

export const useUpdateViews = () => {
  const increaseViews = useMutation(api.podcasts.updatePodcastViews);

  const updateViews = async ({ podcastId }: { podcastId: Id<"podcasts"> }) => {
    try {
      await increaseViews({ podcastId: podcastId });
    } catch (error) {
      console.error(error);
      toast.error("Error udpating podcast views");
    }
  };

  return { updateViews };
};
