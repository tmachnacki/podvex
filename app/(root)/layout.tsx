import { LeftSideNav } from "@/app/(root)/_components/left-side-nav";
import { MobileNav } from "@/app/(root)/_components/mobile-nav";
import { RightSidebar } from "@/app/(root)/_components/right-side-bar/right-side-bar";
import Image from "next/image";
import Link from "next/link";
import PodcastPlayer from "@/components/podcast-player";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative flex flex-col">
      <main className="relative flex">
        <LeftSideNav />

        <section className="flex min-h-screen flex-1 flex-col px-4 sm:px-14">
          <div className="mx-auto flex w-full max-w-5xl flex-col max-sm:px-4">
            <div className="flex h-16 items-center justify-between border-b border-border md:hidden">
              <Link
                href={"/"}
                className="flex items-center justify-start gap-2"
              >
                <Image src="/logo.svg" width={28} height={28} alt="menu icon" />
                <p className="text-2xl font-bold">Podvex</p>
              </Link>
              <MobileNav />
            </div>
            <div className="flex flex-col md:pb-14">{children}</div>
          </div>
        </section>

        <RightSidebar />
      </main>

      <PodcastPlayer />
    </div>
  );
}
