"use client";

import { cn } from "@/lib/utils";
import { SignedIn, SignedOut, SignOutButton, useAuth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { Button } from "../../../components/ui/button";
import { useAudio } from "@/providers/audio-provider";
import { House, Compass, Mic, ArrowLeft, LogOut, Library } from "lucide-react";
import { ThemeSwitcher } from "@/components/theme-switcher";

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
  const { isSignedIn, userId: clerkId } = useAuth();

  const isActive = (route: string) =>
    pathname === route || pathname.startsWith(`${route}/`);

  return (
    <section
      className={cn(
        "sticky left-0 top-0 flex h-[calc(100vh-5px)] w-fit flex-col justify-between border-r-[1px] border-border bg-neutral-50 pt-8 dark:bg-neutral-900 max-md:hidden lg:w-[270px]",
        {
          "h-[calc(100vh-124px)]": audio?.audioUrl,
        },
      )}
    >
      <nav className="flex flex-col gap-4 px-4">
        <Link
          href="/"
          className="flex cursor-pointer items-center gap-2 px-4 pb-10 max-lg:justify-center"
        >
          <Image
            src="/logo.svg"
            alt="logo"
            width={36}
            height={36}
            className="aspect-square h-8 w-8"
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
              <p>{label}</p>
            </Link>
          );
        })}
        <Button
          onClick={() => {
            isSignedIn ? router.push(`/profile/${clerkId}/library`) : null;
          }}
          disabled={!isSignedIn}
          className={cn(
            "relative flex h-auto items-center justify-center gap-3 rounded-lg bg-transparent px-4 py-3 text-base max-lg:px-4 lg:justify-start",
            isActive(`/profile/${clerkId}`)
              ? "bg-gradient-to-r from-primary to-primary/0 text-white"
              : "hover:bg-accent dark:hover:bg-background",
          )}
        >
          <Library className="h-6 w-6" />
          <p>Your Library</p>
        </Button>
      </nav>
      <div className="flex w-full flex-col items-center justify-center gap-2 pb-14 max-lg:px-4 lg:px-8">
        <div className="flex w-full items-center space-x-2 text-sm">
          <ThemeSwitcher />
          <span>{"Change Theme"}</span>
        </div>
        <SignedIn>
          <SignOutButton redirectUrl="/">
            <Button className="w-full" variant={"outline"}>
              <LogOut className="mr-2 h-4 w-4 rotate-180" />
              Log Out
            </Button>
          </SignOutButton>
        </SignedIn>
        <SignedOut>
          <Button asChild className="w-full">
            <Link href="/sign-in">Sign in</Link>
          </Button>
        </SignedOut>
      </div>
    </section>
  );
};

export { LeftSideNav };
