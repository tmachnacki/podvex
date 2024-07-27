"use client";

import { cn } from "@/lib/utils";
import {
  SignedIn,
  SignedOut,
  SignOutButton,
  useAuth,
  useClerk,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { Button } from "../../../components/ui/button";
import { useAudio } from "@/providers/audio-provider";
import {
  House,
  Compass,
  Mic,
  ArrowLeft,
  LogOut,
  Library,
  User,
} from "lucide-react";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { ScrollBar, ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { UserNav } from "@/components/user-nav";

export const sideNavItems = [
  {
    icon: <House className="h-5 w-5" />,
    route: "/",
    label: "Home",
  },
  {
    icon: <Compass className="h-5 w-5" />,
    route: "/discover",
    label: "Discover",
  },
  {
    icon: <Mic className="h-5 w-5" />,
    route: "/create",
    label: "Create Podcast",
  },
  // {
  //   icon: <Library className="h-6 w-6" />,
  //   route: "/library",
  //   label: "Your Library",
  // },
];

const LeftSideNav = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { audio } = useAudio();
  // const { userId: clerkId, signOut,  } = useAuth();
  const { user, isLoaded, isSignedIn } = useUser();

  const isActive = (route: string) =>
    pathname === route || pathname.startsWith(`${route}/`);

  return (
    <ScrollArea
      className={cn(
        "sticky left-0 top-0 h-screen w-fit border-r-[1px] border-border bg-neutral-50 dark:bg-neutral-900 max-md:hidden lg:w-[270px]",
        audio?.audioUrl ? "h-[calc(100vh-124px)]" : "h-screen",
      )}
    >
      <nav
        className={cn(
          "flex w-full flex-col justify-between pt-12",
          audio?.audioUrl ? "h-[calc(100vh-124px)]" : "h-screen",
        )}
      >
        <div className="flex flex-col gap-4 px-4">
          <Link
            href="/"
            className="flex cursor-pointer items-center px-4 pb-10 max-lg:justify-center"
          >
            <Image
              src="/logo.svg"
              alt="logo"
              width={36}
              height={36}
              className="mr-0 aspect-square h-8 w-8 lg:mr-2"
            />
            <h1 className="text-2xl font-bold max-lg:hidden">Podvex</h1>
          </Link>

          {sideNavItems.map(({ route, label, icon }) => {
            return (
              <Link
                href={route}
                key={label}
                className={cn(
                  "relative flex items-center justify-center gap-3 rounded-lg px-4 py-3 max-lg:px-4 lg:justify-start",
                  isActive(route)
                    ? "bg-gradient-to-r from-primary to-primary/0 text-white"
                    : "hover:bg-accent dark:hover:bg-background",
                )}
              >
                {icon}
                <p className="max-lg:hidden">{label}</p>
              </Link>
            );
          })}
          {isSignedIn && isLoaded ? (
            <Link
              href={`/library/${user?.id}`}
              className={cn(
                "relative flex items-center justify-center gap-3 rounded-lg px-4 py-3 max-lg:px-4 lg:justify-start",
                isActive(`/library/${user?.id}`)
                  ? "bg-gradient-to-r from-primary to-primary/0 text-white"
                  : "hover:bg-accent dark:hover:bg-background",
              )}
            >
              <Library className="h-5 w-5" />
              <p className="max-lg:hidden">Your Library</p>
            </Link>
          ) : (
            <div className="flex w-full items-center px-4 py-3">
              <Skeleton className="h-7 w-40 rounded-md" />
            </div>
          )}
        </div>

        <UserNav />
      </nav>
      <ScrollBar />
    </ScrollArea>
  );
};

export { LeftSideNav };
