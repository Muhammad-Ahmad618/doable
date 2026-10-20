import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function SearchInput() {
  return (
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search..."
        className="w-full rounded-lg bg-zinc-100/50 dark:bg-zinc-900/50 border-transparent focus-visible:bg-transparent pl-9 shadow-none transition-colors"
      />
    </div>
  );
}
