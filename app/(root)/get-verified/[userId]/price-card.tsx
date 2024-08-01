import { LoadingSpinner } from "@/components/loading-spinner";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { TStripePlan } from "@/lib/stripe-plans";
import { cn } from "@/lib/utils";
import { useAction, useQuery } from "convex/react";
import { useState } from "react";
import { toast } from "sonner";

type PriceCardProps = {
  currentUserId: string;
} & TStripePlan;

export const PriceCard = ({
  currentUserId,
  name,
  price,
  priceId,
  priceInterval,
  description,
  features,
  isFeatured,
  featuredLabel,
}: PriceCardProps) => {
  const createCheckoutSession = useAction(api.stripe.pay);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  // const createPortalSession = useAction(api.stripe.createPortal);
  // const [portalLoading, setPortalLoading] = useState(false);

  // const user = useQuery(api.users.getUserById, {
  //   clerkId: currentUserId,
  // });

  const handleCreateCheckoutSession = async (priceId: string) => {
    setCheckoutLoading(true);
    try {
      const sessionUrl = await createCheckoutSession({
        priceId,
      });
      window.location.href = sessionUrl;
    } catch (error) {
      console.error(error);
      toast.error(`Error creating checkout session ${error}`);
    } finally {
      setCheckoutLoading(false);
    }
  };

  // const handleCreatePortalSession = async () => {
  //   setPortalLoading(true);
  //   try {
  //     const portalSessionUrl = await createPortalSession();
  //     window.location.href = portalSessionUrl;
  //   } catch (error) {
  //     console.error(error);
  //     toast.error(`Error creating portal session ${error}`);
  //   }
  //   setPortalLoading(false);
  // };

  return (
    <Card
      className={cn(
        "relative flex h-80 w-full flex-col justify-between p-6",
        isFeatured && "border-primary shadow-2xl shadow-primary/30",
      )}
    >
      {isFeatured && (
        <span className="absolute left-1/2 top-0 -translate-x-[50%] -translate-y-[50%] rounded-full bg-primary px-4 py-1 text-sm text-primary-foreground">
          {featuredLabel}
        </span>
      )}
      <div className="space-y-8">
        <header className="space-y-4">
          <span className="mb-4">{name}</span>

          <CardTitle>
            <span>{`$ ${price}`}</span>

            <span className="ml-1 text-sm text-muted-foreground">
              {`/ ${priceInterval}`}
            </span>
          </CardTitle>
          <p className="text-sm text-muted-foreground">{description}</p>
        </header>

        {features && features.length > 0 && (
          <ul className="font-light">
            {features.map((feature) => (
              <li
                className="relative flex items-center gap-3"
                key={feature.name}
              >
                <span
                  className="h-2 w-2 rounded-full border border-cyan-500 bg-transparent"
                  aria-hidden="true"
                ></span>
                <p>{feature.name}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* {user &&
        (user.isVerified ? (
          <Button
            className="w-full"
            variant={"outline"}
            onClick={() => handleCreatePortalSession()}
            disabled={portalLoading}
          >
            Manage Plan
            {portalLoading && <LoadingSpinner className="ml-2 h-4 w-4" />}
          </Button>
        ) : (
          <Button
            variant={isFeatured ? "default" : "outline"}
            className={cn(
              "w-full",
              isFeatured && "shadow-lg shadow-primary/30",
            )}
            onClick={() => handleCreateCheckoutSession(priceId)}
            disabled={checkoutLoading}
          >
            Get Verified
            {checkoutLoading && <LoadingSpinner className="ml-2 h-4 w-4" />}
          </Button>
          ))} */}
      <Button
        variant={isFeatured ? "default" : "outline"}
        className={cn("w-full", isFeatured && "shadow-lg shadow-primary/30")}
        onClick={() => handleCreateCheckoutSession(priceId)}
        disabled={checkoutLoading}
      >
        Get Verified
        {checkoutLoading && (
          <LoadingSpinner className="ml-2 h-4 w-4 text-foreground" />
        )}
      </Button>
    </Card>
  );
};
