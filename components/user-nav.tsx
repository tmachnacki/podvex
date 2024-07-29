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
import {
  ChevronLeft,
  CircleUserRound,
  Settings,
  LogOut,
  CreditCard,
  ChevronRight,
} from "lucide-react";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { ThemeSwitcher } from "./theme-switcher";

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
      <div className="flex w-full flex-col justify-center gap-2 py-12 max-lg:px-4 lg:justify-start lg:px-8">
        <Skeleton className="h-6 w-40 rounded-md" />
        <Skeleton className="h-6 w-40 rounded-md" />
        <Skeleton className="h-6 w-40 rounded-md" />
        <Skeleton className="h-6 w-40 rounded-md" />
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col justify-center gap-4 px-4 py-12 lg:justify-start lg:px-8">
      <div className="relative flex w-full items-center rounded px-4 py-3 hover:bg-background">
        <div className="relative flex cursor-pointer items-center space-x-3">
          <Settings className="h-5 w-5" />
          <span className="">Manage Account</span>
        </div>

        <div className="absolute left-2 opacity-0">
          <UserButton showName userProfileMode="modal" />
        </div>
      </div>

      <div className="flex w-full items-center space-x-2 text-sm">
        <ThemeSwitcher />
        {/* <span>{"Change Theme"}</span> */}
      </div>
    </div>

    // <DropdownMenu>
    //   <DropdownMenuTrigger asChild>
    //     <Button
    //       variant={"ghost"}
    //       className={cn(
    //         "group relative flex w-fit items-center justify-start bg-transparent px-0 py-0 text-base hover:bg-transparent",
    //         triggerClassName,
    //       )}
    //     >
    //       <div className="relative inline-flex cursor-pointer items-center justify-start gap-2 transition">
    //         <Avatar className="h-8 w-8">
    //           <AvatarImage src={user?.imageUrl!} alt={"user avatar"} />
    //           <AvatarFallback>
    //             <Skeleton className="h-8 w-8 rounded-full" />
    //           </AvatarFallback>
    //         </Avatar>

    //         <span>
    //           {user?.firstName} {user?.lastName}
    //         </span>
    //       </div>

    //       <ChevronRight className="absolute right-4 top-1/2 h-4 w-4 -translate-y-[50%] opacity-0 transition-opacity group-hover:opacity-100" />
    //     </Button>
    //   </DropdownMenuTrigger>
    //   <DropdownMenuContent side="right" align="end" className="">
    //     <DropdownMenuLabel>
    //       <UserButton showName userProfileMode="modal" />
    //     </DropdownMenuLabel>
    //     <DropdownMenuSeparator />
    //     <DropdownMenuItem onClick={() => router.push(`/profile/${user?.id}`)}>
    //       <CircleUserRound className="mr-2 h-4 w-4" />
    //       Profile
    //     </DropdownMenuItem>
    //     <DropdownMenuItem

    //     >
    //       <div className="relative flex items-center">
    //         <Settings className="mr-2 h-4 w-4" />
    //         Manage Account
    //       </div>

    //       <div className="absolute left-0 z-50 opacity-50">
    //       </div>
    //     </DropdownMenuItem>
    //     <DropdownMenuItem>
    //       <CreditCard className="mr-2 h-4 w-4" />
    //       Billing
    //     </DropdownMenuItem>
    //     <DropdownMenuSeparator />
    //     <DropdownMenuItem onClick={() => signOut(() => router.push("/"))}>
    //       <LogOut className="mr-2 h-4 w-4" />
    //       Log out
    //     </DropdownMenuItem>
    //   </DropdownMenuContent>
    // </DropdownMenu>
  );
};
