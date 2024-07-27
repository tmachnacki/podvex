"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserProfile, UserButton, useAuth, useUser } from "@clerk/nextjs";
import { ChevronLeft, CircleUserRound, Settings, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import { useRouter } from "next/navigation";

export const UserNav = ({
  triggerClassName,
}: {
  triggerClassName?: boolean;
}) => {
  const { signOut } = useAuth();
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="flex h-10 items-center gap-2">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-6 w-40 rounded-md" />
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={"ghost"}
          className="group relative flex w-fit items-center justify-start bg-transparent px-0 py-0 text-base hover:bg-transparent"
        >
          <div className="relative inline-flex cursor-pointer items-center justify-start gap-2 transition">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.imageUrl!} alt={"user avatar"} />
              <AvatarFallback>
                <Skeleton className="h-8 w-8 rounded-full" />
              </AvatarFallback>
            </Avatar>

            <span>
              {user?.firstName} {user?.lastName}
            </span>
          </div>

          <ChevronLeft className="absolute -left-6 top-1/2 h-4 w-4 -translate-y-[50%] opacity-0 transition-opacity group-hover:opacity-100" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="left" align="start">
        <DropdownMenuItem onClick={() => router.push(`/profile/${user?.id}`)}>
          <CircleUserRound className="mr-2 h-4 w-4" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.push(`/profile/manage-account`)}
        >
          <Settings className="mr-2 h-4 w-4" />
          Manage Account
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut(() => router.push("/"))}>
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
