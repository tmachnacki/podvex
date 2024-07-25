import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
    <section className="flex-center size-full flex-col gap-3">
      <div className="flex-center w-full max-w-[254px] flex-col gap-3">
        <h1 className="text-16 text-white-1 text-center font-medium">
          {title}
        </h1>
        {search && (
          <p className="text-16 text-white-2 text-center font-medium">
            Try adjusting your search to find what you are looking for
          </p>
        )}
        {buttonLink && (
          <Button className="" asChild variant={"default"}>
            <Link href={buttonLink} className="flex gap-2">
              {buttonText}
            </Link>
          </Button>
        )}
      </div>
    </section>
  );
};
