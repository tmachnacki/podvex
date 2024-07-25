"use client";

import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";
import { ReactNode } from "react";

const convex = new ConvexReactClient(
  process.env.NEXT_PUBLIC_CONVEX_URL as string,
);

// TODO: change clerk styling
const ConvexClerkProvider = ({ children }: { children: ReactNode }) => (
  <ClerkProvider
    publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY as string}
    appearance={{
      layout: {
        logoImageUrl: "/logo.svg",
        socialButtonsVariant: "blockButton",
      },
      variables: {
        colorBackground: "#15171c",
        colorPrimary: "#e11d48",
        colorText: "white",
        colorInputBackground: "#1b1f29",
        colorInputText: "white",
        colorTextSecondary: "white",
        colorNeutral: "white",
      },
    }}
  >
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      {children}
    </ConvexProviderWithClerk>
  </ClerkProvider>
);

export default ConvexClerkProvider;
