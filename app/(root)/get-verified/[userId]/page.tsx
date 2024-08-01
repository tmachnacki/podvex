"use client";

import { stripePlans } from "@/lib/stripe-plans";
import { PriceCard } from "./price-card";
import { Check, CircleAlert } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function GetVerified({
  params,
}: {
  params: { userId: string };
}) {
  const { userId } = params;

  return (
    <div className="flex h-full w-full flex-1 flex-col items-center justify-center pt-12">
      <div className="flex items-center space-x-4">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-cyan-500">
          <Check className="h-4 w-4 text-background" />
        </span>
        <h1 className="text-6xl font-bold">Get Verified</h1>
      </div>
      <h2 className="pt-4 text-xl text-muted-foreground">
        Become a verified Podvex creator
      </h2>

      <div className="flex w-full max-w-3xl flex-col items-start justify-center gap-4 pt-24 sm:flex-row">
        {stripePlans.map((plan) => (
          <PriceCard key={plan.priceId} currentUserId={userId} {...plan} />
        ))}
      </div>

      <Alert className="mt-12 w-full max-w-3xl border-none bg-transparent">
        <CircleAlert className="h-4 w-4" />
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription className="text-sm text-muted-foreground">
          This is not real money. Use card number 4242 4242 4242 4242 for
          testing.
        </AlertDescription>
      </Alert>
    </div>
  );
}
