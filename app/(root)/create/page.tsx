"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { GeneratePodcast } from "@/app/(root)/create/_components/generate-podcast";
import { GenerateThumbnail } from "@/app/(root)/create/_components/generate-thumbnail";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { LoadingSpinner } from "@/components/loading-spinner";
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  podcastTitle: z
    .string()
    .min(1, { message: "Title is required" })
    .max(100, { message: "Max length is 100 characters" }),
  podcastDescription: z
    .string()
    .min(1, { message: "Description is required" })
    .max(2200, { message: "Max length is 2200 characters" }),
});

export default function CreatePodcast() {
  const router = useRouter();
  const [audioMediaMethod, setAudioMediaMethod] = useState<
    "Upload" | "Generate"
  >("Upload");
  const [imagePrompt, setImagePrompt] = useState("");
  const [imageStorageId, setImageStorageId] = useState<Id<"_storage"> | null>(
    null,
  );
  const [imageUrl, setImageUrl] = useState("");
  const [isDeletingThumbnail, setIsDeletingThumbnail] = useState(false);
  const deletePodcastThumbnail = useMutation(
    api.podcasts.deletePodcastThumbnail,
  );

  const [audioUrl, setAudioUrl] = useState("");
  const [isDeletingAudio, setIsDeletingAudio] = useState(false);
  const [audioStorageId, setAudioStorageId] = useState<Id<"_storage"> | null>(
    null,
  );
  const deletePodcastAudio = useMutation(api.podcasts.deletePodcastAudio);
  const [audioDuration, setAudioDuration] = useState(0);

  const [voice, setVoice] = useState<string | null>(null);
  const [voicePrompt, setVoicePrompt] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);

  const createPodcast = useMutation(api.podcasts.createPodcast);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      podcastTitle: "",
      podcastDescription: "",
    },
  });

  const handleDeleteThumbnail = async () => {
    if (!imageStorageId) return toast.error("image storage not provided");
    try {
      setIsDeletingThumbnail(true);
      await deletePodcastThumbnail({ imageStorageId });
      setImageStorageId(null);
      setImageUrl("");

      setIsDeletingThumbnail(false);
      toast("Thumbnail deleted");
    } catch (error) {
      toast.error("Error deleting thumbnail");
      console.error(error);
      setIsDeletingThumbnail(false);
    }
  };

  const handleDeleteAudio = async () => {
    if (!audioStorageId) return toast.error("audio storage not provided");
    try {
      setIsDeletingAudio(true);
      await deletePodcastAudio({ audioStorageId });
      setAudioStorageId(null);
      setAudioUrl("");

      setIsDeletingAudio(false);
      toast("Audio deleted");
    } catch (error) {
      toast.error("Error deleting audio");
      console.error(error);
      setIsDeletingAudio(false);
    }
  };

  const handleCancel = async () => {
    try {
      if (audioStorageId && audioUrl) {
        await handleDeleteAudio();
      }
      if (imageStorageId && imageUrl) {
        await handleDeleteThumbnail();
      }
      router.push("/");
    } catch (error) {
      console.error(error);
      toast.error("Error cancelling podcast");
    }
  };

  const isFormEmpty = (titleField: string, descriptionField: string) => {
    return !titleField || !descriptionField;
  };

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true);
      if (
        !audioUrl ||
        !imageUrl ||
        (audioMediaMethod === "Generate" && !voice)
      ) {
        toast.error("Please generate audio and image");
        setIsSubmitting(false);
        throw new Error("Please generate audio and image");
      }

      const podcast = await createPodcast({
        podcastTitle: data.podcastTitle,
        podcastDescription: data.podcastDescription,
        audioUrl,
        imageUrl,
        voiceType: voice ?? undefined,
        imagePrompt,
        voicePrompt,
        views: 0,
        audioDuration,
        audioStorageId: audioStorageId!,
        imageStorageId: imageStorageId!,
      });
      toast.success("Podcast created");
      setIsSubmitting(false);
      router.push("/");
    } catch (error) {
      console.error(error);
      toast.error("Error creating podcast");
      setIsSubmitting(false);
    }
  }

  return (
    <section className="flex flex-col pt-12">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full flex-col"
        >
          <div className="pb-8">
            <h2 className="text-lg font-semibold">Podcast Info</h2>
            <p className="text-muted-foreground">
              Provide some details about your podcast
            </p>
          </div>

          <div className="flex flex-col gap-8 border-b border-border pb-12">
            <FormField
              control={form.control}
              name="podcastTitle"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel className="">Title</FormLabel>
                  <FormControl>
                    <Input className="" placeholder="Title" {...field} />
                  </FormControl>
                  <FormMessage className="" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="podcastDescription"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel className="">Description</FormLabel>
                  <FormControl>
                    <Textarea
                      className=""
                      placeholder="Tell listeners about your podcast"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="" />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col space-y-8 pt-12">
            <div className="">
              <h2 className="text-lg font-semibold">Podcast Audio</h2>
              <p className="text-muted-foreground">
                {"Curate your podcast's audio experience"}
              </p>
            </div>

            <GeneratePodcast
              audioMediaMethod={audioMediaMethod}
              setAudioMediaMethod={setAudioMediaMethod}
              audioStorageId={audioStorageId}
              setAudioStorageId={setAudioStorageId}
              setAudioUrl={setAudioUrl}
              voice={voice!}
              setVoice={setVoice}
              audioUrl={audioUrl}
              voicePrompt={voicePrompt}
              setVoicePrompt={setVoicePrompt}
              setAudioDuration={setAudioDuration}
              isDeletingAudio={isDeletingAudio}
              setIsDeletingAudio={setIsDeletingAudio}
              handleDeleteAudio={handleDeleteAudio}
            />

            <Separator orientation="horizontal" />

            <div className="pt-4">
              <h2 className="text-lg font-semibold">Podcast Image</h2>
              <p className="text-muted-foreground">
                {"Upload a thumbnail for your podcast"}
              </p>
            </div>

            <GenerateThumbnail
              setImageUrl={setImageUrl}
              setImageStorageId={setImageStorageId}
              imageStorageId={imageStorageId}
              imageUrl={imageUrl}
              imagePrompt={imagePrompt}
              setImagePrompt={setImagePrompt}
              handleDeleteThumbnail={handleDeleteThumbnail}
              isDeletingThumbnail={isDeletingThumbnail}
              setIsDeletingThumbnail={setIsDeletingThumbnail}
            />

            <Separator orientation="horizontal" />

            <div className="flex w-full items-center justify-end gap-2 pt-4">
              <Button
                type="button"
                variant={"outline"}
                onClick={() => {
                  if (
                    audioUrl ||
                    imageUrl ||
                    voice ||
                    voicePrompt ||
                    form.getValues().podcastDescription !== "" ||
                    form.getValues().podcastTitle !== ""
                  ) {
                    setCancelOpen(true);
                  } else {
                    router.push("/");
                  }
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className=""
                variant={"default"}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    Submitting
                    <LoadingSpinner className="ml-2" />
                  </>
                ) : (
                  "Publish"
                )}
              </Button>
            </div>
          </div>
        </form>
      </Form>

      <AlertDialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to abandon this podcast?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isDeletingAudio || isDeletingThumbnail || isSubmitting}
            >
              Leave
              {isDeletingAudio ||
                (isDeletingThumbnail && (
                  <LoadingSpinner className="ml-2 text-inherit" />
                ))}
            </Button>
            <Button variant="default" onClick={() => setCancelOpen(false)}>
              Continue
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}
