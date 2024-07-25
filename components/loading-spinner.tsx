import { cn } from "@/lib/utils";
import { Loader } from "lucide-react";

export const LoadingSpinner = ({ className }: { className?: string }) => (
  <Loader className={cn("h-4 w-4 animate-spin text-primary", className)} />
);
