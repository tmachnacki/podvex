"use client";

import * as React from "react";
import { ChevronRight, Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ThemeSwitcher() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="group relative flex w-full items-center justify-start space-x-3 text-muted-foreground hover:text-foreground data-[state=open]:text-foreground md:justify-center lg:justify-start [&_svg]:data-[state=open]:opacity-100">
        <div className="relative flex items-center justify-center">
          <Sun className="inline-block h-5 w-5 rotate-0 dark:hidden" />
          <Moon className="hidden h-5 w-5 rotate-0 dark:inline-block" />
        </div>
        <span className="sr-only">Toggle theme</span>

        <span className="inline-block md:hidden lg:inline-block">
          Change Theme
        </span>
        <ChevronRight className="absolute right-0 top-1/2 inline-block h-4 w-4 -translate-y-[50%] opacity-0 group-hover:opacity-100 md:hidden lg:inline-block" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="right">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <Sun className="mr-2 h-4 w-4" />
          {`Psychos`}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <Moon className="mr-2 h-4 w-4" />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          <Monitor className="mr-2 h-4 w-4" />
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
