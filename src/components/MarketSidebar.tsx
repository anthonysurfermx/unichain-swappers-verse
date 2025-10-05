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
      <div className="sticky top-24 bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
        <h3 className="font-semibold mb-4 text-xs text-gray-500 uppercase tracking-wide px-2">Categories</h3>
        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="space-y-1">
            {categories.map((category) => {
              const Icon = category.icon;
              const isSelected = selectedCategory === category.id;
              
              return (
                <Button
                  key={category.id}
                  variant={isSelected ? "default" : "ghost"}
                  className={`w-full justify-start gap-3 h-11 text-sm font-medium rounded-lg ${
                    isSelected 
                      ? "bg-uniswap-pink/10 text-uniswap-accessible-pink hover:bg-uniswap-pink/15 border border-uniswap-pink/20" 
                      : "hover:bg-gray-100 text-gray-700"
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
