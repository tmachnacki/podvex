import { Button } from "@/components/ui/button";
import { UserProfile } from "@clerk/nextjs";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function UserProfilePage() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-12 px-4">
      <div className="flex w-full items-center justify-start border-b border-border pb-2 pt-8">
        <Button asChild size={"icon"} variant={"ghost"}>
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Link>
        </Button>
      </div>
      <UserProfile path="/user-profile" routing="path" />
    </div>
  );
}
