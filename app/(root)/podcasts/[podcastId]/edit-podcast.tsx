import { LoadingSpinner } from "@/components/loading-spinner";
import { Button } from "@/components/ui/button";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

import { zodResolver } from "@hookform/resolvers/zod";
import { set, useForm } from "react-hook-form";
import { z } from "zod";
import { useMutation } from "convex/react";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface EditPodcastProps {
  podcastId: Id<"podcasts">;
  podcastTitle: string;
  podcastDescription: string;
  podcastImageUrl: string;
  userId: string;
  authorId: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const editSchema = z.object({
  podcastTitle: z
    .string()
    .min(1, { message: "Title is required" })
    .max(100, { message: "Max length is 100 characters" }),
  podcastDescription: z
    .string()
    .min(1, { message: "Description is required" })
    .max(2200, { message: "Max length is 2200 characters" }),
});

export const EditPodcast = ({
  podcastId,
  podcastTitle,
  podcastDescription,
  podcastImageUrl,
  userId,
  authorId,
  open,
  setOpen,
}: EditPodcastProps) => {
  const [isPending, setIsPending] = useState(false);
  const updatePodcast = useMutation(api.podcasts.updatePodcast);

  const form = useForm<z.infer<typeof editSchema>>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      podcastTitle: podcastTitle,
      podcastDescription: podcastDescription,
    },
  });

  async function onSubmit(data: z.infer<typeof editSchema>) {
    console.log(data);
    setIsPending(true);
    try {
      await updatePodcast({
        podcastId,
        podcastTitle: data.podcastTitle,
        podcastDescription: data.podcastDescription,
        clerkId: userId,
        authorId,
      });
      setIsPending(false);
      toast.success("Podcast details updated");
      setOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Error updating podcast");
      setIsPending(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit Podcast</SheetTitle>
          <SheetDescription>Edit the details of your podcast</SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-8 space-y-8"
          >
            <FormField
              control={form.control}
              name="podcastTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="New Title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="podcastDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Textarea
                      maxLength={2200}
                      rows={10}
                      placeholder="Give a new description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <SheetFooter>
              <SheetClose asChild>
                <Button variant={"outline"} type="button">
                  Cancel
                </Button>
              </SheetClose>
              <Button variant={"default"} type="submit" disabled={isPending}>
                Save
                {isPending && (
                  <LoadingSpinner className="ml-2 h-4 w-4 text-inherit" />
                )}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};
