import React, { useRef, useState } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { Label } from "../../../../components/ui/label";
import { Textarea } from "../../../../components/ui/textarea";
import { Button } from "../../../../components/ui/button";
import { useAction, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";

import { useUploadFiles } from "@xixixao/uploadstuff/react";
import { LoadingSpinner } from "../../../../components/loading-spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { CloudUpload } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface GeneratePodcastProps {
  audioMediaMethod: "Upload" | "Generate";
  setAudioMediaMethod: React.Dispatch<
    React.SetStateAction<"Upload" | "Generate">
  >;
  voiceCategories: string[];
  voiceType: string | null;
  setVoiceType: React.Dispatch<React.SetStateAction<string | null>>;
  setAudio: React.Dispatch<React.SetStateAction<string>>;
  audio: string;
  setAudioStorageId: React.Dispatch<
    React.SetStateAction<Id<"_storage"> | null>
  >;
  voicePrompt: string;
  setVoicePrompt: React.Dispatch<React.SetStateAction<string>>;
  setAudioDuration: React.Dispatch<React.SetStateAction<number>>;
}

export const GeneratePodcast = ({
  audioMediaMethod,
  setAudioMediaMethod,
  voiceCategories,
  voiceType,
  setVoiceType,
  setAudio,
  audio,
  setAudioStorageId,
  voicePrompt,
  setVoicePrompt,
  setAudioDuration,
}: GeneratePodcastProps) => {
  const [isAudioUploading, setIsAudioUploading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const audioRef = useRef<HTMLInputElement>(null);

  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const { startUpload } = useUploadFiles(generateUploadUrl);

  const getPodcastAudio = useAction(api.openai.generateAudioAction);

  const getAudioUrl = useMutation(api.podcasts.getUrl);

  const handleAudio = async (blob: Blob, fileName: string) => {
    setIsAudioUploading(true);
    setAudio("");

    try {
      const file = new File([blob], fileName, { type: "audio/mpeg" });

      const uploaded = await startUpload([file]);
      const storageId = (uploaded[0].response as any).storageId;

      setAudioStorageId(storageId);

      const imageUrl = await getAudioUrl({ storageId });
      setAudio(imageUrl!);
      setIsAudioUploading(false);
      toast("Audio uploaded successfully");
    } catch (error) {
      setIsAudioUploading(false);
      console.error(error);
      toast.error("Error processing audio");
    }
  };

  const uploadAudio = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    try {
      const files = e.target.files;
      if (!files) return;
      const file = files[0];
      const blob = await file.arrayBuffer().then((ab) => new Blob([ab]));

      handleAudio(blob, file.name);
    } catch (error) {
      console.error(error);
      toast.error("Error uploading audio");
    }
  };

  const generateAudio = async () => {
    if (!voiceType) {
      toast.warning("Please provide a voice type to generate a podcast");
      return setIsGenerating(false);
    }

    if (!voicePrompt) {
      toast.warning("Please provide a prompt to generate a podcast");
      return setIsGenerating(false);
    }

    try {
      setIsGenerating(true);
      const response = await getPodcastAudio({
        voice: voiceType,
        input: voicePrompt,
      });
      const blob = new Blob([response], { type: "audio/mpeg" });

      handleAudio(blob, `thumbnail-${uuidv4()}.mp3`);
      setIsGenerating(false);
    } catch (error) {
      console.error(error);
      toast.error("Error generating audio");
      setIsGenerating(false);
    }
  };

  // const handleGeneratePodcast = async () => {
  //   setIsGenerating(true);
  //   setAudio("");

  //   if (!voiceType) {
  //     toast.warning("Please provide a voice type to generate a podcast");
  //     return setIsGenerating(false);
  //   }

  //   if (!voicePrompt) {
  //     toast.warning("Please provide a prompt to generate a podcast");
  //     return setIsGenerating(false);
  //   }

  //   try {
  //     const response = await getPodcastAudio({
  //       voice: voiceType,
  //       input: voicePrompt,
  //     });

  //     const blob = new Blob([response], { type: "audio/mpeg" });
  //     const fileName = `podcast-${uuidv4()}.mp3`;
  //     const file = new File([blob], fileName, { type: "audio/mpeg" });

  //     const uploaded = await startUpload([file]);
  //     const storageId = (uploaded[0].response as any).storageId;

  //     setAudioStorageId(storageId);

  //     const audioUrl = await getAudioUrl({ storageId });
  //     setAudio(audioUrl!);
  //     setIsGenerating(false);
  //     toast.success("Podcast generated successfully");
  //   } catch (error) {
  //     console.error("Error generating podcast audio", error);
  //     toast.error("Error generating podcast audio");
  //     setIsGenerating(false);
  //   }
  // };

  return (
    <div className="space-y-4 pb-4">
      <Tabs
        defaultValue="Upload"
        className="w-full"
        onValueChange={(value) =>
          setAudioMediaMethod(value as "Upload" | "Generate")
        }
      >
        <TabsList className="mb-4">
          <TabsTrigger value="Upload">Upload</TabsTrigger>
          <TabsTrigger value="Generate">Generate</TabsTrigger>
        </TabsList>
        <TabsContent value="Upload" className="m-0 p-0">
          <div
            className="flex h-40 w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-[2px] border-dashed border-input transition hover:border-muted-foreground"
            onClick={() => audioRef?.current?.click()}
          >
            <Input
              type="file"
              className="hidden"
              ref={audioRef}
              onChange={(e) => uploadAudio(e)}
            />
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
              {!isAudioUploading ? (
                <CloudUpload className="h-6 w-6" />
              ) : (
                <LoadingSpinner className="h-6 w-6" />
              )}
            </div>
            <div className="flex flex-col items-center gap-2 text-sm">
              <h2 className="text-primary">Click to upload</h2>
              <p className="text-muted-foreground">MP3</p>
            </div>
          </div>

          {/* <UploadDropzone
            uploadUrl={generateUploadUrl}
            fileTypes={{
              "image/*": [".png", ".jpeg", ".jpg"],
            }}
            onUploadBegin={() => {
              setIsImageLoading(true);
              setImage("");
            }}
            onUploadComplete={handleUploadComplete}
            onUploadError={(error) => {
              console.error(error);
              toast.error("Image upload failed");
              setIsImageLoading(true);
            }}
          /> */}
        </TabsContent>
        <TabsContent value="Generate" className="m-0 space-y-4 p-0">
          <div className="space-y-2">
            <Label>AI Voice</Label>
            <Select onValueChange={setVoiceType}>
              <SelectTrigger
                className={`w-full max-w-[200px] ${voiceType === null ? "text-muted-foreground" : "text-foreground"}`}
              >
                <SelectValue
                  placeholder="Select AI voice type"
                  className={``}
                />
              </SelectTrigger>

              <SelectContent className="">
                {voiceCategories.map((category) => (
                  <SelectItem key={category} value={category} className="">
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
              {voiceType && (
                <audio src={`/${voiceType}.mp3`} autoPlay className="hidden" />
              )}
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="">AI Thumbnail Prompt</Label>
            <Textarea
              className=""
              placeholder="Provide text to generate thumbnail"
              rows={5}
              value={voicePrompt}
              onChange={(e) => setVoicePrompt(e.target.value)}
            />
          </div>
          <div className="w-full">
            <Button
              type="button"
              className=""
              onClick={generateAudio}
              disabled={isGenerating}
              variant={"primary_opaque"}
            >
              {isGenerating ? (
                <>
                  Generating
                  <LoadingSpinner className="ml-2" />
                </>
              ) : (
                "Generate"
              )}
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      {/* <div className="space-y-2">
        <Label className="">AI Audio Prompt</Label>
        <Textarea
          className=""
          placeholder="Provide text to generate podcast audio"
          rows={5}
          value={voicePrompt}
          onChange={(e) => setVoicePrompt(e.target.value)}
        />
      </div>
      <div className="w-full max-w-[200px]">
        <Button
          type="button"
          className=""
          onClick={handleGeneratePodcast}
          variant={"primary_opaque"}
        >
          {isGenerating ? (
            <>
              Generating
              <LoadingSpinner className="ml-2" />
            </>
          ) : (
            "Generate"
          )}
        </Button>
      </div> */}
      {audio && (
        <audio
          controls
          src={audio}
          autoPlay
          className=""
          onLoadedMetadata={(e) => setAudioDuration(e.currentTarget.duration)}
        />
      )}
    </div>
  );
};
