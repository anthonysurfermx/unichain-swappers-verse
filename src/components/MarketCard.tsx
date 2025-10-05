import { TrendingUp, TrendingDown, Clock, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";

interface MarketCardProps {
  market: {
    id: string;
    title: string;
    description: string;
    category: string;
    outcomes: string[];
    end_date: string;
    total_volume: number;
    image_url: string | null;
  };
}

export const MarketCard = ({ market }: MarketCardProps) => {
  // Calculate mock probability (in real app, this would come from market_prices)
  const probability = Math.floor(Math.random() * 40) + 30;
  const change24h = (Math.random() * 10 - 5).toFixed(1);
  const isPositive = parseFloat(change24h) >= 0;

  const formatVolume = (volume: number) => {
    if (volume >= 1000000) return `$${(volume / 1000000).toFixed(1)}M`;
    if (volume >= 1000) return `$${(volume / 1000).toFixed(0)}K`;
    return `$${volume}`;
  };

  const daysUntilEnd = Math.ceil(
    (new Date(market.end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  return (
    <Link to={`/market/${market.id}`}>
      <Card className="glass border-border hover:border-primary/50 transition-all duration-300 overflow-hidden group cursor-pointer h-full">
        {market.image_url && (
          <div className="relative h-40 overflow-hidden">
            <img
              src={market.image_url}
              alt={market.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
            <Badge className="absolute top-3 left-3 bg-card/80 backdrop-blur">
              {market.category}
            </Badge>
          </div>
        )}

        <div className="p-5 space-y-4">
          <div>
            <h3 className="font-bold text-lg line-clamp-2 group-hover:text-primary transition-colors">
              {market.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {market.description}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-3xl font-bold text-success">{probability}%</span>
                <div className={`flex items-center gap-1 ${isPositive ? "text-success" : "text-destructive"}`}>
                  {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  <span className="text-sm font-medium">{change24h}%</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">YES probability</p>
            </div>

            <div className="text-right">
              <div className="flex items-center gap-1 justify-end mb-1">
                <DollarSign className="w-4 h-4 text-muted-foreground" />
                <span className="font-semibold">{formatVolume(market.total_volume)}</span>
              </div>
              <p className="text-xs text-muted-foreground">Volume</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground pt-3 border-t border-border">
            <Clock className="w-4 h-4" />
            <span>Ends in {daysUntilEnd} days</span>
          </div>
        </div>
      </Card>
    </Link>
  );
};
