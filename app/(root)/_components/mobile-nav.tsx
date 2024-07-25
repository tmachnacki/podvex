"use client";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { sideNavItems } from "./left-side-nav";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AlignRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const MobileNav = () => {
  const pathname = usePathname();

  return (
    <section>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant={"outline"} size={"icon"} className="">
            <AlignRight className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="">
          <Link
            href="/"
            className="flex w-fit cursor-pointer items-center justify-start gap-2 pb-10 pl-4"
          >
            <Image
              src="/logo.svg"
              alt="logo"
              width={24}
              height={24}
              className="h-8 w-8"
            />
            <h1 className="text-2xl font-bold">Podvex</h1>
          </Link>
          <div className="flex h-[calc(100vh-72px)] flex-col justify-between overflow-y-auto">
            <nav className="flex h-full flex-col gap-6">
              {sideNavItems.map(({ route, label, icon }) => {
                const isActive =
                  pathname === route || pathname.startsWith(`${route}/`);

                return (
                  <SheetClose asChild key={route}>
                    <Link
                      href={route}
                      className={cn(
                        "flex items-center justify-start gap-3 py-4 max-lg:px-4",
                        {
                          "bg-nav-focus border-orange-1 border-r-4": isActive,
                        },
                      )}
                    >
                      {icon}
                      <p>{label}</p>
                    </Link>
                  </SheetClose>
                );
              })}
            </nav>
          </div>
        </SheetContent>
      </Sheet>
    </section>
  );
};

export { MobileNav };
