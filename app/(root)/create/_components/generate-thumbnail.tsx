"use client";

import { useRef, useState, Dispatch, SetStateAction } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "../../../../components/ui/button";
import { cn } from "@/lib/utils";
import { Label } from "../../../../components/ui/label";
import { Textarea } from "../../../../components/ui/textarea";
import { CloudUpload, Loader, Pencil, Trash2, X } from "lucide-react";
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
  setImageUrl: Dispatch<SetStateAction<string>>;
  setImageStorageId: Dispatch<SetStateAction<Id<"_storage"> | null>>;
  imageStorageId: Id<"_storage"> | null;
  imageUrl: string;
  imagePrompt: string;
  setImagePrompt: Dispatch<SetStateAction<string>>;
  isDeletingThumbnail: boolean;
  setIsDeletingThumbnail: Dispatch<SetStateAction<boolean>>;
  handleDeleteThumbnail: () => Promise<string | number | undefined>;
}

export const GenerateThumbnail = ({
  setImageUrl,
  setImageStorageId,
  imageStorageId,
  imageUrl,
  imagePrompt,
  setImagePrompt,
  isDeletingThumbnail,
  setIsDeletingThumbnail,
  handleDeleteThumbnail,
}: GenerateThumbnailProps) => {
  const [mediaMethod, setMediaMethod] = useState<"Upload" | "Generate">(
    "Upload",
  );
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const imageRef = useRef<HTMLInputElement>(null);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  // const deletePodcastThumbnail = useMutation(
  //   api.podcasts.deletePodcastThumbnail,
  // );

  const { startUpload } = useUploadFiles(generateUploadUrl);
  const getImageUrl = useMutation(api.podcasts.getUrl);
  // const handleGenerateThumbnail = useAction(api.openai.generateThumbnailAction);

  const handleImage = async (blob: Blob, fileName: string) => {
    setIsImageLoading(true);
    setImageUrl("");

    try {
      // if image already exists, delete it
      if (imageUrl && imageStorageId) {
        await handleDeleteThumbnail();
      }

      const file = new File([blob], fileName, { type: "image/png" });

      const uploaded = await startUpload([file]);
      const storageId = (uploaded[0].response as any).storageId;

      setImageStorageId(storageId);

      const newImageUrl = await getImageUrl({ storageId });
      setImageUrl(newImageUrl!);
      setIsImageLoading(false);
      toast("Thumbnail created successfully");
    } catch (error) {
      setIsImageLoading(false);
      console.error(error);
      toast.error("Error storing thumbnail");
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
    setImageUrl(imageUrl!);
    setIsImageLoading(false);
    toast("Thumbnail generated successfully");
  };

  // const handleDeleteThumbnail = async () => {
  //   if (!imageStorageId) return toast.error("image storage not provided");
  //   try {
  //     setIsDeletingThumbnail(true);
  //     await deletePodcastThumbnail({ imageStorageId });
  //     setImageStorageId(null);
  //     setImage("");

  //     setIsDeletingThumbnail(false);
  //     toast("Thumbnail deleted");
  //   } catch (error) {
  //     toast.error("Error deleting thumbnail");
  //     console.error(error);
  //     setIsDeletingThumbnail(false);
  //   }
  // };

  return (
    <div className="space-y-8 pb-4">
      {imageUrl && imageStorageId ? (
        <div className="group relative w-fit space-y-6">
          <Image
            src={imageUrl}
            width={200}
            height={200}
            className="relative rounded-lg"
            alt="thumbnail"
          />

          <Button
            variant={"outline"}
            className=""
            onClick={handleDeleteThumbnail}
            disabled={isDeletingThumbnail}
            type="button"
          >
            {isDeletingThumbnail ? (
              <LoadingSpinner className="mr-2 h-4 w-4 text-inherit" />
            ) : (
              <Pencil className="mr-2 h-4 w-4" />
            )}
            Change
          </Button>
        </div>
      ) : (
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
      )}
    </div>
  );
};
