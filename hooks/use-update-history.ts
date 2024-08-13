import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { toast } from "sonner";

export const useUpdateHistory = () => {
  const updateHistoryMutation = useMutation(api.history.updateHistory);

  const updateHistory = async ({
    userId,
    podcastId,
  }: {
    userId: string;
    podcastId: Id<"podcasts">;
  }) => {
    try {
      await updateHistoryMutation({ userId, podcastId });
    } catch (error) {
      console.error(error);
      toast.error("Error udpating user history");
    }
  };

  return { updateHistory };
};
