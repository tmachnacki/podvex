"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { formatTime } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { useAudio } from "@/providers/audio-provider";

import { Progress } from "@/components/ui/progress";

import {
  FastForward,
  Rewind,
  Play,
  Pause,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const PodcastPlayer = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const { audio } = useAudio();

  const togglePlayPause = () => {
    if (audioRef.current?.paused) {
      audioRef.current?.play();
      setIsPlaying(true);
    } else {
      audioRef.current?.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted((prev) => !prev);
    }
  };

  const forward = () => {
    if (
      audioRef.current &&
      audioRef.current.currentTime &&
      audioRef.current.duration &&
      audioRef.current.currentTime + 5 < audioRef.current.duration
    ) {
      audioRef.current.currentTime += 5;
    }
  };

  const rewind = () => {
    if (audioRef.current && audioRef.current.currentTime - 5 > 0) {
      audioRef.current.currentTime -= 5;
    } else if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  };

  useEffect(() => {
    const updateCurrentTime = () => {
      if (audioRef.current) {
        setCurrentTime(audioRef.current.currentTime);
      }
    };

    const audioElement = audioRef.current;
    if (audioElement) {
      audioElement.addEventListener("timeupdate", updateCurrentTime);

      return () => {
        audioElement.removeEventListener("timeupdate", updateCurrentTime);
      };
    }
  }, []);

  useEffect(() => {
    const audioElement = audioRef.current;
    if (audio?.audioUrl) {
      if (audioElement) {
        audioElement.play().then(() => {
          setIsPlaying(true);
        });
      }
    } else {
      audioElement?.pause();
      setIsPlaying(true);
    }
  }, [audio]);
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  const iconClasses = `cursor-pointer text-muted-foreground hover:text-white h-4 w-4`;

  return (
    <TooltipProvider delayDuration={500}>
      <div
        className={cn(
          "sticky bottom-0 left-0 flex w-full flex-col shadow-[0_20px_25px_10px_rgba(0,0,0,0.2)]",
          {
            hidden: !audio?.audioUrl || audio?.audioUrl === "",
          },
        )}
      >
        <Progress
          value={(currentTime / duration) * 100}
          className="h-1 w-full rounded-none"
          max={duration > 0 ? duration : 100}
        />
        <section className="relative flex h-[120px] w-full items-center justify-between gap-8 bg-background/50 px-4 backdrop-blur-sm max-md:justify-center max-md:gap-4 md:px-12">
          <audio
            ref={audioRef}
            src={audio?.audioUrl}
            className="hidden"
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={handleAudioEnded}
          />
          <div className="flex w-full max-w-sm flex-grow items-center gap-4">
            <Link
              href={`/podcast/${audio?.podcastId}`}
              className="md:flex-shrink-0"
            >
              <Image
                src={audio?.imageUrl! || "/logo.svg"}
                width={96}
                height={96}
                alt="logo"
                className="aspect-square w-10 rounded-md object-cover object-center md:w-14"
              />
            </Link>
            <div className="hidden flex-col truncate md:flex">
              <h2 className="truncate font-semibold">{audio?.title}</h2>
              <p className="text-muted-foreground">{audio?.author}</p>
            </div>
          </div>
          <div className="flex cursor-pointer items-center justify-center gap-3 md:gap-6">
            <Tooltip>
              <TooltipTrigger>
                <div className="flex cursor-pointer items-center gap-2 text-muted-foreground hover:text-foreground">
                  <Rewind className="h-5 w-5" onClick={rewind} />
                  <span className="">-5</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>Rewind 5 seconds</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={"default"}
                  size={"icon"}
                  className="rounded-full"
                  onClick={togglePlayPause}
                >
                  {isPlaying ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{isPlaying ? "Pause" : "Play"}</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger>
                <div className="flex cursor-pointer items-center gap-2 text-muted-foreground hover:text-foreground">
                  <span className="">+5</span>
                  <FastForward className="h-5 w-5" onClick={rewind} />
                </div>
              </TooltipTrigger>
              <TooltipContent>Forward 5 seconds</TooltipContent>
            </Tooltip>
          </div>
          <div className="flex w-full max-w-sm items-center justify-end gap-6 md:flex-grow">
            {isMuted ? (
              <Tooltip>
                <TooltipTrigger>
                  <Volume2
                    className="h-5 w-5 cursor-pointer text-muted-foreground hover:text-foreground"
                    onClick={toggleMute}
                  />
                </TooltipTrigger>
                <TooltipContent>Unmute</TooltipContent>
              </Tooltip>
            ) : (
              <Tooltip>
                <TooltipTrigger>
                  <VolumeX
                    className="h-5 w-5 cursor-pointer text-muted-foreground hover:text-foreground"
                    onClick={toggleMute}
                  />
                </TooltipTrigger>
                <TooltipContent>Mute</TooltipContent>
              </Tooltip>
            )}
            <h2 className="text-16 text-white-2 font-normal max-md:hidden">
              {formatTime(duration)}
            </h2>
          </div>
        </section>
      </div>
    </TooltipProvider>
  );
};

export default PodcastPlayer;
