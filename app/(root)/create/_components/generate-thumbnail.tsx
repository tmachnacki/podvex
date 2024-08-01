"use client";

import { useRef, useState, Dispatch, SetStateAction } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "../../../../components/ui/button";
import { cn } from "@/lib/utils";
import { Label } from "../../../../components/ui/label";
import { Textarea } from "../../../../components/ui/textarea";
import { CloudUpload, Loader, Trash2, X } from "lucide-react";
import { Input } from "../../../../components/ui/input";
import Image from "next/image";
import { toast } from "sonner";
import { useAction, useMutation } from "convex/react";
import {
  useUploadFiles,
  UploadDropzone,
  UploadFileResponse,
} from "@xixixao/uploadstuff/react";
import { api } from "@/convex/_generated/api";
import { v4 as uuidv4 } from "uuid";
import { LoadingSpinner } from "../../../../components/loading-spinner";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export interface GenerateThumbnailProps {
  setImage: Dispatch<SetStateAction<string>>;
  setImageStorageId: Dispatch<SetStateAction<Id<"_storage"> | null>>;
  imageStorageId: Id<"_storage"> | null;
  image: string;
  imagePrompt: string;
  setImagePrompt: Dispatch<SetStateAction<string>>;
}

export const GenerateThumbnail = ({
  setImage,
  setImageStorageId,
  imageStorageId,
  image,
  imagePrompt,
  setImagePrompt,
}: GenerateThumbnailProps) => {
  const [mediaMethod, setMediaMethod] = useState<"Upload" | "Generate">(
    "Upload",
  );
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const imageRef = useRef<HTMLInputElement>(null);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const [isDeletingThumbnail, setIsDeletingThumbnail] = useState(false);
  const deletePodcastThumbnail = useMutation(
    api.podcasts.deletePodcastThumbnail,
  );
  const [isDeletingAudio, setIsDeletingAudio] = useState(false);
  const deletePodcastAudio = useMutation(api.podcasts.deletePodcastAudio);
  const { startUpload } = useUploadFiles(generateUploadUrl);
  const getImageUrl = useMutation(api.podcasts.getUrl);
  // const handleGenerateThumbnail = useAction(api.openai.generateThumbnailAction);

  const handleImage = async (blob: Blob, fileName: string) => {
    setIsImageLoading(true);
    setImage("");

    try {
      const file = new File([blob], fileName, { type: "image/png" });

      const uploaded = await startUpload([file]);
      const storageId = (uploaded[0].response as any).storageId;

      setImageStorageId(storageId);

      const imageUrl = await getImageUrl({ storageId });
      setImage(imageUrl!);
      setIsImageLoading(false);
      toast("Thumbnail generated successfully");
    } catch (error) {
      setIsImageLoading(false);
      console.error(error);
      toast.error("Error generating thumbnail");
    }
  };

  // const generateImage = async () => {
  //   try {
  //     setIsGenerating(true);
  //     const response = await handleGenerateThumbnail({ prompt: imagePrompt });
  //     const blob = new Blob([response], { type: "image/png" });
  //     handleImage(blob, `thumbnail-${uuidv4()}`);
  //     setIsGenerating(false);
  //   } catch (error) {
  //     console.error(error);
  //     toast.error("Error generating thumbnail");
  //     setIsGenerating(false);
  //   }
  // };

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    try {
      const files = e.target.files;
      if (!files) return;
      const file = files[0];
      const blob = await file.arrayBuffer().then((ab) => new Blob([ab]));

      handleImage(blob, file.name);
    } catch (error) {
      console.error(error);
      toast.error("Error uploading image");
    }
  };

  const handleUploadComplete = async (uploaded: UploadFileResponse[]) => {
    const storageId = (uploaded[0].response as any).storageId;
    setImageStorageId(storageId);
    const imageUrl = await getImageUrl({ storageId });
    setImage(imageUrl!);
    setIsImageLoading(false);
    toast("Thumbnail generated successfully");
  };

  const handleDeleteThumbnail = async () => {
    if (!imageStorageId) return toast.error("image storage not provided");
    try {
      setIsDeletingThumbnail(true);
      await deletePodcastThumbnail({ imageStorageId });
      setImageStorageId(null);
      setImage("");

      setIsDeletingThumbnail(false);
      toast("Thumbnail deleted");
    } catch (error) {
      toast.error("Error deleting thumbnail");
      console.error(error);
      setIsDeletingThumbnail(false);
    }
  };

  return (
    <div className="space-y-8 pb-4">
      <div
        className="flex h-40 w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-[2px] border-dashed border-input transition hover:border-muted-foreground"
        onClick={() => imageRef?.current?.click()}
      >
        <Input
          type="file"
          className="hidden"
          ref={imageRef}
          onChange={(e) => uploadImage(e)}
        />
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {!isImageLoading ? (
            <CloudUpload className="h-6 w-6" />
          ) : (
            <LoadingSpinner className="h-6 w-6" />
          )}
        </div>
        <div className="flex flex-col items-center gap-2 text-sm">
          <h2 className="text-primary">Click to upload</h2>
          <p className="text-muted-foreground">
            SVG, PNG, JPG, or GIF (max. 1080x1080px)
          </p>
        </div>
      </div>

      {/* <Tabs
        defaultValue="Upload"
        className="w-full"
        onValueChange={(value) =>
          setMediaMethod(value as "Upload" | "Generate")
        }
      >
        <TabsList className="mb-4">
          <TabsTrigger value="Upload">Upload</TabsTrigger>
          <TabsTrigger value="Generate">Generate</TabsTrigger>
        </TabsList>
        <TabsContent value="Upload" className="m-0 p-0">
          <div
            className="flex h-40 w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-[2px] border-dashed border-input transition hover:border-muted-foreground"
            onClick={() => imageRef?.current?.click()}
          >
            <Input
              type="file"
              className="hidden"
              ref={imageRef}
              onChange={(e) => uploadImage(e)}
            />
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
              {!isImageLoading ? (
                <CloudUpload className="h-6 w-6" />
              ) : (
                <LoadingSpinner className="h-6 w-6" />
              )}
            </div>
            <div className="flex flex-col items-center gap-2 text-sm">
              <h2 className="text-primary">Click to upload</h2>
              <p className="text-muted-foreground">
                SVG, PNG, JPG, or GIF (max. 1080x1080px)
              </p>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="Generate" className="m-0 space-y-6 p-0">
          <div className="space-y-2">
            <Label className="">AI Thumbnail Prompt</Label>
            <Textarea
              className=""
              placeholder="Provide text to generate thumbnail"
              rows={5}
              value={imagePrompt}
              onChange={(e) => setImagePrompt(e.target.value)}
            />
          </div>
          <div className="w-full">
            <Button
              type="button"
              className=""
              onClick={generateImage}
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
      </Tabs> */}

      {image && (
        <div className="group relative w-fit">
          <Image
            src={image}
            width={200}
            height={200}
            className="relative rounded-lg"
            alt="thumbnail"
          />

          <Button
            variant={"destructive"}
            className="absolute right-0 top-0 z-20 flex h-8 w-8 -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full p-0 opacity-0 transition hover:opacity-100 group-hover:opacity-100"
            onClick={handleDeleteThumbnail}
            disabled={isDeletingThumbnail}
            type="button"
          >
            {isDeletingThumbnail ? (
              <LoadingSpinner />
            ) : (
              <>
                <Trash2 className="h-4 w-4 text-white" />
                <span className="sr-only">Delete thumbnail</span>
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};
