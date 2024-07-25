"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { usePathname, useRouter } from "next/navigation";
import { useDebounce } from "@/lib/use-debounce";
import { Search as SearchIcon } from "lucide-react";

export const Search = () => {
  const [search, setSearch] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  const debouncedValue = useDebounce(search, 500);

  useEffect(() => {
    if (debouncedValue) {
      router.push(`/discover?search=${debouncedValue}`);
    } else if (!debouncedValue && pathname === "/discover")
      router.push("/discover");
  }, [router, pathname, debouncedValue]);

  return (
    <div className="relative mt-12 block">
      <Input
        className="px-12"
        placeholder="Search for podcasts"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onLoad={() => setSearch("")}
      />
      <SearchIcon className="absolute left-4 top-3 h-4 w-4" />
    </div>
  );
};
