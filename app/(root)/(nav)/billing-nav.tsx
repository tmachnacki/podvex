import { api } from "@/convex/_generated/api";
import { useAction, useQuery } from "convex/react";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TooltipContent } from "@radix-ui/react-tooltip";
import { useState } from "react";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/loading-spinner";
import { CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";

export const Billing = ({ userId }: { userId: string }) => {
  const createPortalSession = useAction(api.stripe.createPortal);
  const [portalLoading, setPortalLoading] = useState(false);

  const userData = useQuery(api.users.getUserById, {
    clerkId: userId,
  });

  const isNotStripeCustomer =
    userData?.stripeCustomerId === null ||
    userData?.stripeCustomerId === undefined ||
    !userData?.stripeCustomerId;

  const handleCreatePortalSession = async () => {
    setPortalLoading(true);
    try {
      const portalSessionUrl = await createPortalSession();
      window.location.href = portalSessionUrl;
    } catch (error) {
      console.error(error);
      toast.error(`Error creating portal session ${error}`);
    } finally {
      setPortalLoading(false);
    }
  };

  if (isNotStripeCustomer) {
    return (
      <TooltipProvider delayDuration={400}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className={cn(
                "relative flex w-full cursor-default items-center justify-start space-x-3 text-muted-foreground md:justify-center lg:justify-start",
                "opacity-50",
              )}
            >
              <CreditCard className="h-5 w-5" />
              <span className="block md:hidden lg:block">Billing</span>
            </div>
          </TooltipTrigger>
          <TooltipContent
            side="right"
            className="rounded border border-amber-500/50 bg-amber-500/10 p-4 backdrop-blur-sm"
          >
            {`You must be a customer to manage your subscriptions.`}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <div
      className={cn(
        "relative flex w-full cursor-pointer items-center justify-start space-x-3 text-muted-foreground hover:text-foreground md:justify-center lg:justify-start",
        portalLoading && "opacity-50",
      )}
      onClick={portalLoading ? () => null : () => handleCreatePortalSession()}
    >
      {portalLoading ? (
        <LoadingSpinner className="h-5 w-5 text-inherit" />
      ) : (
        <CreditCard className="h-5 w-5" />
      )}
      <span className="block md:hidden lg:block">Billing</span>
    </div>
  );
};
