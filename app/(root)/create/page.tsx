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
  podcastTitle: z.string().min(2),
  podcastDescription: z.string().min(2),
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

  const [audioUrl, setAudioUrl] = useState("");
  const [audioStorageId, setAudioStorageId] = useState<Id<"_storage"> | null>(
    null,
  );
  const [audioDuration, setAudioDuration] = useState(0);

  const [voice, setVoice] = useState<string | null>(null);
  const [voicePrompt, setVoicePrompt] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const createPodcast = useMutation(api.podcasts.createPodcast);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      podcastTitle: "",
      podcastDescription: "",
    },
  });

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
                    <Input
                      className=""
                      placeholder="Joe Rogan Experience"
                      {...field}
                    />
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
                      placeholder="Write a short podcast description"
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
              setAudioStorageId={setAudioStorageId}
              setAudio={setAudioUrl}
              voice={voice!}
              setVoice={setVoice}
              audio={audioUrl}
              voicePrompt={voicePrompt}
              setVoicePrompt={setVoicePrompt}
              setAudioDuration={setAudioDuration}
            />

            <Separator orientation="horizontal" />

            <div className="pt-4">
              <h2 className="text-lg font-semibold">Podcast Image</h2>
              <p className="text-muted-foreground">
                {"Upload a thumbnail for your podcast"}
              </p>
            </div>

            <GenerateThumbnail
              setImage={setImageUrl}
              setImageStorageId={setImageStorageId}
              imageStorageId={imageStorageId}
              image={imageUrl}
              imagePrompt={imagePrompt}
              setImagePrompt={setImagePrompt}
            />

            <Separator orientation="horizontal" />

            <div className="flex w-full items-center justify-end gap-2 pt-4">
              <Button
                type="button"
                variant={"outline"}
                onClick={() => {
                  if (
                    window.confirm(
                      "Are you sure you want to abandon this podcast?",
                    )
                  ) {
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
    </section>
  );
}
