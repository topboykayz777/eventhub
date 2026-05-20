"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="rounded-full w-12 h-12 border border-border bg-card/50 hover:bg-primary/10 transition-all group overflow-hidden"
    >
      <div className="relative w-full h-full flex items-center justify-center">
        <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-amber-500 group-hover:rotate-45" />
        <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-indigo-400 group-hover:-rotate-12" />
      </div>
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}