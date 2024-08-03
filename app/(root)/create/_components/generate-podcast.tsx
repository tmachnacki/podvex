"use client";

import React, { useEffect, useRef, useState } from "react";
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
import { CloudUpload, Sparkles } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { aiVoices } from "@/lib/ai-voices";

export interface GeneratePodcastProps {
  audioMediaMethod: "Upload" | "Generate";
  setAudioMediaMethod: React.Dispatch<
    React.SetStateAction<"Upload" | "Generate">
  >;
  voice: string | null;
  setVoice: React.Dispatch<React.SetStateAction<string | null>>;
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
  voice,
  setVoice,
  setAudio,
  audio,
  setAudioStorageId,
  voicePrompt,
  setVoicePrompt,
  setAudioDuration,
}: GeneratePodcastProps) => {
  const [isAudioUploading, setIsAudioUploading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const audioInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const voiceRef = useRef<HTMLAudioElement>(null);

  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const { startUpload } = useUploadFiles(generateUploadUrl);

  // const getPodcastAudio = useAction(api.openai.generateAudioAction);
  const getPodcastAudio = useAction(api.texttospeech.generateAudioAction);

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
    if (!voice) {
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
        voice: voice,
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

  useEffect(() => {
    if (!voiceRef.current) return;

    voiceRef.current.play();
  }, [voice, voiceRef]);

  return (
    <div className="space-y-4 pb-4">
      <Tabs
        defaultValue="Upload"
        className="w-full"
        onValueChange={(value) =>
          setAudioMediaMethod(value as "Upload" | "Generate")
        }
      >
        <TabsList className="mb-4 dark:bg-neutral-900">
          <TabsTrigger value="Upload">Upload</TabsTrigger>
          <TabsTrigger value="Generate">
            <span className="bg-gradient-to-r from-fuchsia-500 to-primary bg-clip-text text-transparent">
              Generate
            </span>
            <Sparkles className="ml-2 h-4 w-4 text-primary" />
          </TabsTrigger>
        </TabsList>
        <TabsContent value="Upload" className="m-0 p-0">
          <div
            className="flex h-40 w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-[2px] border-dashed border-input transition hover:border-muted-foreground"
            onClick={() => audioInputRef?.current?.click()}
          >
            <Input
              type="file"
              className="hidden"
              ref={audioInputRef}
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
        </TabsContent>
        <TabsContent value="Generate" className="m-0 space-y-6 p-0">
          <div className="space-y-2">
            <Label>AI Voice</Label>
            <Select onValueChange={setVoice} value={voice ?? undefined}>
              <SelectTrigger
                className={`w-full max-w-[200px] ${voice === null ? "text-muted-foreground" : "text-foreground"}`}
              >
                <SelectValue
                  placeholder="Select AI voice type"
                  className={``}
                />
              </SelectTrigger>

              <SelectContent className="">
                {aiVoices.map((voice) => (
                  <SelectItem
                    key={voice.value}
                    value={voice.value}
                    className=""
                  >
                    {voice.value}
                  </SelectItem>
                ))}
              </SelectContent>
              {voice && (
                <audio
                  src={`/${voice}.mp3`}
                  ref={voiceRef}
                  className="hidden"
                />
              )}
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="">AI Audio Prompt</Label>
            <Textarea
              className=""
              placeholder="Provide text to generate audio"
              rows={5}
              value={voicePrompt}
              onChange={(e) => setVoicePrompt(e.target.value)}
              maxLength={1000}
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

      {audio && (
        <audio
          controls
          src={audio}
          autoPlay
          className="pt-2"
          onLoadedMetadata={(e) => setAudioDuration(e.currentTarget.duration)}
        />
      )}
    </div>
  );
};
