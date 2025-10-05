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
    <div className="hidden lg:block w-64 flex-shrink-0">
      <div className="glass rounded-xl p-4 sticky top-20">
        <h3 className="font-semibold mb-3 text-sm text-muted-foreground">CATEGORIES</h3>
        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="space-y-1">
            {categories.map((category) => {
              const Icon = category.icon;
              const isSelected = selectedCategory === category.id;
              
              return (
                <Button
                  key={category.id}
                  variant={isSelected ? "secondary" : "ghost"}
                  className={`w-full justify-start gap-3 ${
                    isSelected ? "bg-primary/10 text-primary hover:bg-primary/20" : ""
                  }`}
                  onClick={() => onCategoryChange(category.id)}
                >
                  <Icon className="w-4 h-4" />
                  <span>{category.label}</span>
                </Button>
              );
            })}
          </div>

          <div className="mt-6 pt-6 border-t border-border">
            <h3 className="font-semibold mb-3 text-sm text-muted-foreground">TRENDING</h3>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-3 rounded-lg bg-card/50 border border-border hover:border-primary/50 transition-colors cursor-pointer">
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="secondary" className="bg-success/20 text-success">
                      <Flame className="w-3 h-3 mr-1" />
                      HOT
                    </Badge>
                    <span className="text-xs text-muted-foreground">24h</span>
                  </div>
                  <p className="text-sm font-medium line-clamp-2">
                    Bitcoin hits $100K?
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-lg font-bold text-success">72%</span>
                    <span className="text-xs text-success">+5%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
