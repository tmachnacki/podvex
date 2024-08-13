"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth, useUser } from "@clerk/nextjs";
import { Settings, LogOut } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { ThemeSwitcher } from "@/components/theme-switcher";
import Link from "next/link";
import { Billing } from ".//billing-nav";
import { useRouter } from "next/navigation";

export const UserNav = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();

  return (
    <div className="relative w-full gap-6 px-4 py-12 text-sm lg:px-8">
      <div
        className={cn(
          "flex w-full flex-col justify-start gap-6 md:justify-center lg:justify-start",
        )}
      >
        <div className={cn("relative w-full")}>
          <ThemeSwitcher />
        </div>

        {isLoaded && isSignedIn && user ? (
          <>
            <Billing userId={user?.id} />

            <Link
              href={"/user-profile"}
              className={cn(
                "relative flex w-full items-center justify-start space-x-3 text-muted-foreground hover:text-foreground md:justify-center lg:justify-start",
              )}
            >
              <Settings className="h-5 w-5" />
              <span className="block md:hidden lg:block">Manage Account</span>
            </Link>

            <div
              className={cn(
                "relative flex w-full cursor-pointer items-center justify-start space-x-3 text-muted-foreground hover:text-foreground md:justify-center lg:justify-start",
              )}
              onClick={() =>
                signOut({
                  redirectUrl: process.env
                    .NEXT_PUBLIC_CLERK_SIGN_IN_URL as string,
                })
              }
            >
              <LogOut className="h-5 w-5 rotate-180" />
              <span className="block md:hidden lg:block">Log out</span>
            </div>

            <Link
              className={`flex w-full items-center justify-start space-x-3 hover:underline md:justify-center lg:justify-start`}
              href={`/profile/${user?.id}`}
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.imageUrl!} alt={"user avatar"} />
                <AvatarFallback>
                  <Skeleton className="h-8 w-8 rounded-full" />
                </AvatarFallback>
              </Avatar>

              <span className="block md:hidden lg:block">
                {user?.firstName} {user?.lastName}
              </span>
            </Link>
          </>
        ) : (
          <>
            <Skeleton className="h-[23px] w-40 rounded-md" />
            <Skeleton className="h-[23px] w-40 rounded-md" />
            <Skeleton className="h-[23px] w-40 rounded-md" />
            <Skeleton className="h-[23px] w-40 rounded-md" />
          </>
        )}
      </div>
    </div>
  );
};
