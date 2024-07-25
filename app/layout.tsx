import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import ConvexClerkProvider from "@/providers/convex-clerk-provider";
import AudioProvider from "@/providers/audio-provider";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Podvex",
  description: "AI podcasting built with convex",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AudioProvider>
        <body className={inter.className}>
          <NextTopLoader color="#e11d48" showSpinner={false} />
          <ConvexClerkProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              {children}
            </ThemeProvider>
            <Toaster position="top-right" closeButton richColors />
          </ConvexClerkProvider>
        </body>
      </AudioProvider>
    </html>
  );
}
