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

export const sideNavItems = [
  {
    icon: <House className="h-6 w-6" />,
    route: "/",
    label: "Home",
  },
  {
    icon: <Compass className="h-6 w-6" />,
    route: "/discover",
    label: "Discover",
  },
  {
    icon: <Mic className="h-6 w-6" />,
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
      <section
        className={cn(
          "flex w-full flex-col justify-between pt-12",
          audio?.audioUrl ? "h-[calc(100vh-124px)]" : "h-screen",
        )}
      >
        <nav className="flex flex-col gap-4 px-4">
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
          {isSignedIn && (
            <Link
              href={`/library/${user?.id}`}
              className={cn(
                "relative flex items-center justify-center gap-3 rounded-lg px-4 py-3 max-lg:px-4 lg:justify-start",
                isActive(`/library/${user?.id}`)
                  ? "bg-gradient-to-r from-primary to-primary/0 text-white"
                  : "hover:bg-accent dark:hover:bg-background",
              )}
            >
              <Library className="h-6 w-6" />
              <p className="max-lg:hidden">Your Library</p>
            </Link>
          )}
        </nav>
        <div className="flex w-full flex-col items-center justify-center gap-2 py-12 max-lg:px-4 lg:px-8">
          <div className="flex w-full items-center space-x-2 text-sm">
            <ThemeSwitcher />
            {/* <span>{"Change Theme"}</span> */}
          </div>

          {isSignedIn && isLoaded ? (
            <div className="relative w-full">
              <div className="absolute left-0 top-1/2 inline-flex cursor-pointer items-center justify-start gap-2 transition">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.imageUrl!} alt={"user avatar"} />
                  <AvatarFallback>
                    <Skeleton className="h-8 w-8 rounded-full" />
                  </AvatarFallback>
                </Avatar>

                <span className="text-sm">{user?.fullName}</span>
              </div>
              <div className="absolute left-0 z-10 w-full opacity-50">
                <UserButton showName userProfileMode="modal" />
              </div>
            </div>
          ) : (
            <div className="flex h-10 items-center gap-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-6 w-40 rounded-md" />
            </div>
          )}

          {/* <SignedIn>
            <Button
              className="flex w-full items-center gap-2"
              variant={"outline"}
              onClick={() => signOut(() => router.push("/"))}
            >
              <LogOut className="h-4 w-4 rotate-180" />
              <span className="max-lg:hidden">Log Out</span>
            </Button>
          </SignedIn> */}
          {/* <SignedOut>
            <Button asChild className="w-full" variant={"primary_opaque"}>
              <Link href="/sign-in">Sign in</Link>
            </Button>
          </SignedOut> */}
        </div>
      </section>
      <ScrollBar />
    </ScrollArea>
  );
};

export { LeftSideNav };
