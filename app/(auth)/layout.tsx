import { WavyBackground } from "@/components/aceternity/wavy-background";
import Image from "next/image";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="relative h-screen w-full">
      <WavyBackground className="" containerClassName="absolute size-full" />

      {children}
    </main>
  );
}
