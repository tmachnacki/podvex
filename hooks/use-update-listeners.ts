import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { toast } from "sonner";

export const useUpdateListeners = () => {
  const increaseListeners = useMutation(api.users.updateListeners);

  const updateListeners = async ({
    listenerId,
    authorId,
  }: {
    listenerId: string;
    authorId: string;
  }) => {
    try {
      await increaseListeners({ listenerId, authorId });
    } catch (error) {
      console.error(error);
      toast.error("Error udpating podcast views");
    }
  };

  return { updateListeners };
};
