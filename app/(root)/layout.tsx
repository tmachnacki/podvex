import { LeftSideNav } from "@/app/(root)/(nav)/left-side-nav";
import { MobileNav } from "@/app/(root)/(nav)/mobile-nav";
import { RightSidebar } from "@/app/(root)/(nav)/right-side-bar/right-side-bar";
import Image from "next/image";
import Link from "next/link";
import PodcastPlayer from "@/components/podcast-player";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ContentWrapper } from "./content-wrapper";
import { SignedIn } from "@clerk/nextjs";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className="relative flex flex-col overflow-hidden"
      style={{ height: "100dvh" }}
    >
      <main className="relative flex overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute -top-40 left-0 -z-10 transform-gpu overflow-hidden blur-3xl md:-top-80"
        >
          <div
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary/50 to-pink-500/50 opacity-30 md:left-[calc(50%-30rem)] md:w-[72.1875rem]"
          />
        </div>

        <LeftSideNav />

        <ScrollArea className="min-h-screen flex-1">
          <section className="flex flex-1 flex-col px-4 sm:px-14">
            <div className="mx-auto flex w-full max-w-5xl flex-col max-sm:px-4">
              <div className="flex h-16 items-center justify-between border-b border-border md:hidden">
                <Link
                  href={"/"}
                  className="flex items-center justify-start gap-2"
                >
                  <Image
                    src="/logo.svg"
                    width={28}
                    height={28}
                    alt="menu icon"
                  />
                  <p className="text-2xl font-bold">Podvex</p>
                </Link>
                <MobileNav />
              </div>
              <ContentWrapper>{children}</ContentWrapper>
            </div>
          </section>
          <ScrollBar />
        </ScrollArea>

        <RightSidebar />

        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl md:top-[calc(100%-30rem)]"
        >
          <div
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
            className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-primary/50 to-pink-500/50 opacity-30 md:left-[calc(50%+36rem)] md:w-[72.1875rem]"
          />
        </div>
      </main>

      <PodcastPlayer />
    </div>
  );
}
