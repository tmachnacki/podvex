import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { toast } from "sonner";

export const useUpdateHistory = () => {
  const updateHistoryMutation = useMutation(api.history.updateHistory);

  const updateHistory = async ({
    podcastId,
  }: {
    podcastId: Id<"podcasts">;
  }) => {
    try {
      await updateHistoryMutation({ podcastId });
    } catch (error) {
      console.error(error);
      toast.error("Error updating your history", { description: `${error}` });
    }
  };

  return { updateHistory };
};
