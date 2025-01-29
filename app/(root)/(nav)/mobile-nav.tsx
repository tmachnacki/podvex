"use client";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { sideNavItems } from "./left-side-nav";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AlignRight, Library } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAudio } from "@/providers/audio-provider";
import { useUser } from "@clerk/nextjs";
import { UserNav } from "./user-nav";
import { useEffect, useState } from "react";

const MobileNav = () => {
  const pathname = usePathname();
  const { audio } = useAudio();
  const { user, isLoaded, isSignedIn } = useUser();
  const [showMenu, setShowMenu] = useState(false);

  const isActive = (route: string) =>
    pathname === route || pathname.startsWith(`${route}/`);

  useEffect(() => {
    setShowMenu(false);
  }, [pathname]);

  return (
    <section>
      <Sheet open={showMenu} onOpenChange={setShowMenu} defaultOpen={false}>
        <SheetTrigger asChild>
          <Button variant={"outline"} size={"icon"} className="">
            <AlignRight className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="min-w-[280px] overflow-y-auto md:hidden"
          overlayClassname="md:hidden"
        >
          <nav className={cn("flex w-full flex-col justify-between pt-12")}>
            <div className="flex flex-col gap-4">
              <Link
                href="/"
                className="flex cursor-pointer items-center px-4 pb-10"
              >
                <Image
                  src="/logo.svg"
                  alt="logo"
                  width={36}
                  height={36}
                  className="mr-0 aspect-square h-8 w-8 lg:mr-2"
                />
                <h1 className="text-2xl font-bold">Podvex</h1>
              </Link>

              {sideNavItems.map(({ route, label, icon }) => {
                return (
                  <Link
                    href={route}
                    key={label}
                    className={cn(
                      "relative flex items-center justify-start gap-3 rounded-lg px-4 py-3",
                      isActive(route)
                        ? "bg-gradient-to-r from-primary via-primary to-primary/0 text-white"
                        : "hover:bg-accent dark:hover:bg-background",
                    )}
                  >
                    {icon}
                    <p className="">{label}</p>
                  </Link>
                );
              })}
              {isSignedIn && isLoaded ? (
                <Link
                  href={`/library/${user?.id}`}
                  className={cn(
                    "relative flex items-center justify-start gap-3 rounded-lg px-4 py-3",
                    isActive(`/library/${user?.id}`)
                      ? "bg-gradient-to-r from-primary via-primary to-primary/0 text-white"
                      : "hover:bg-accent dark:hover:bg-background",
                  )}
                >
                  <Library className="h-5 w-5" />
                  <p className="">Your Library</p>
                </Link>
              ) : (
                <div className="relative flex cursor-default items-center justify-start gap-3 rounded-lg px-4 py-3 opacity-50">
                  <Library className="h-5 w-5" />
                  <p className="">Your Library</p>
                </div>
              )}
            </div>

            <UserNav />
          </nav>
          <SheetTitle className="sr-only">Menu</SheetTitle>
        </SheetContent>
      </Sheet>
    </section>
  );
};

export { MobileNav };
