"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CameraCategory, categories } from "@/data/cameras";
import { cn } from "@/lib/utils";

export function FilterBar() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeCategory, setActiveCategory] = useState<CameraCategory>("All");

  useEffect(() => {
    const cat = searchParams.get("category") as CameraCategory | null;
    if (cat && categories.includes(cat)) setActiveCategory(cat);
  }, [searchParams]);

  const handleChange = (category: CameraCategory) => {
    setActiveCategory(category);
    const params = new URLSearchParams(searchParams.toString());
    if (category === "All") params.delete("category");
    else params.set("category", category);
    router.push(pathname + (params.toString() ? `?${params}` : ""), { scroll: false });
  };

  if (pathname !== "/" && pathname !== "/cams") return null;

  return (
    <div className="glass sticky top-16 z-40 border-b border-border">
      <div className="container py-3">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleChange(category)}
              className={cn(
                "whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-all",
                activeCategory === category
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                  : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80"
              )}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
