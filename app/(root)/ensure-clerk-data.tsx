"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

export function EnsureClerkData({
  children,
  loading,
}: {
  children: JSX.Element;
  loading?: JSX.Element;
}) {
  const [loginStatus, user] = useQuery(api.users.userLoginStatus) || [
    "Loading",
    null,
  ];
  console.log({ loginStatus });

  // used for the side effect of keeping the current user loaded
  useQuery(api.users.currentUser);
  if (loginStatus !== "Logged In") {
    return loading ?? null; // waiting for user row
  }
  return children;
}
