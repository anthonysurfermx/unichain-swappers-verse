import { TrendingUp, Flame, Sparkles, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface MarketSidebarProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const categories = [
  { id: "All", label: "All Markets", icon: TrendingUp },
  { id: "Politics", label: "Politics", icon: Flame },
  { id: "Sports", label: "Sports", icon: TrendingUp },
  { id: "Crypto", label: "Crypto", icon: Sparkles },
  { id: "Custom", label: "Custom", icon: Clock },
];

export const MarketSidebar = ({ selectedCategory, onCategoryChange }: MarketSidebarProps) => {
  return (
    <div className="hidden lg:block w-56 flex-shrink-0">
      <div className="sticky top-16">
        <h3 className="font-semibold mb-2 text-xs text-muted-foreground uppercase px-2">Categories</h3>
        <ScrollArea className="h-[calc(100vh-120px)]">
          <div className="space-y-0.5">
            {categories.map((category) => {
              const Icon = category.icon;
              const isSelected = selectedCategory === category.id;
              
              return (
                <Button
                  key={category.id}
                  variant="ghost"
                  className={`w-full justify-start gap-2 h-9 text-sm ${
                    isSelected ? "bg-primary/10 text-primary hover:bg-primary/15" : "hover:bg-secondary"
                  }`}
                  onClick={() => onCategoryChange(category.id)}
                >
                  <Icon className="w-4 h-4" />
                  <span>{category.label}</span>
                </Button>
              );
            })}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
