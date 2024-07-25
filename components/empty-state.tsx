import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Shuffle } from "lucide-react";

export interface EmptyStateProps {
  title: string;
  search?: boolean;
  buttonText?: string;
  buttonLink?: string;
}

export const EmptyState = ({
  title,
  search,
  buttonLink,
  buttonText,
}: EmptyStateProps) => {
  return (
    <section className="flex size-full flex-col items-center justify-center gap-3">
      <div className="relative flex w-full max-w-xs flex-col items-center justify-center space-y-4">
        <Shuffle className="text-muted" />
        <h1 className="text-center">{title}</h1>
        {search && (
          <p className="text-center text-sm text-muted-foreground">
            Try adjusting your search to find what you are looking for
          </p>
        )}
        {buttonLink && (
          <Button className="" asChild variant={"primary_opaque"}>
            <Link href={buttonLink} className="flex gap-2">
              {buttonText}
            </Link>
          </Button>
        )}
      </div>
    </section>
  );
};
