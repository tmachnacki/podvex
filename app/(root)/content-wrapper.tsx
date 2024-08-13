"use client";

import { cn } from "@/lib/utils";
import { useAudio } from "@/providers/audio-provider";

export const ContentWrapper = ({ children }: { children: React.ReactNode }) => {
  const { audio } = useAudio();

  return (
    <div className={cn("flex flex-col pb-12", audio?.audioUrl && "mb-32")}>
      {children}
    </div>
  );
};
