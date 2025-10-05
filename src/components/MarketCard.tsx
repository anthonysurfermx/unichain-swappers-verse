import { Clock, TrendingUp, TrendingDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  const probability = Math.floor(Math.random() * 40) + 30;
  const change24h = (Math.random() * 10 - 5).toFixed(1);
  const isPositive = parseFloat(change24h) >= 0;

  const formatVolume = (volume: number) => {
    if (volume >= 1000000) return `$${(volume / 1000000).toFixed(1)}m`;
    if (volume >= 1000) return `$${(volume / 1000).toFixed(0)}k`;
    return `$${volume}`;
  };

  const daysUntilEnd = Math.ceil(
    (new Date(market.end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  return (
    <Link to={`/market/${market.id}`}>
      <Card className="border border-gray-200 hover:shadow-lg transition-all duration-200 overflow-hidden group cursor-pointer bg-white rounded-xl hover:border-uniswap-pink/30">
        <div className="p-5">
          <div className="flex items-start gap-4">
            {market.image_url && (
              <img
                src={market.image_url}
                alt={market.title}
                className="w-14 h-14 rounded-xl object-cover flex-shrink-0 border border-gray-200"
              />
            )}
            
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base text-gray-900 mb-2 line-clamp-2 group-hover:text-uniswap-accessible-pink transition-colors">
                {market.title}
              </h3>
              
              <div className="flex items-center gap-3 mb-3">
                <Badge variant="secondary" className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-md font-medium">
                  {market.category}
                </Badge>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="w-3.5 h-3.5" />
                  <span className="font-medium">{daysUntilEnd}d</span>
                </div>
                <span className="text-xs text-gray-500 font-medium">{formatVolume(market.total_volume)} Vol.</span>
              </div>
              
              <div className="flex items-center gap-2">
                {market.outcomes.slice(0, 2).map((outcome, index) => {
                  const outcomeProb = index === 0 ? probability : 100 - probability;
                  const isYes = outcome.toLowerCase() === 'yes' || outcome.toLowerCase() === 'sí';
                  const isNo = outcome.toLowerCase() === 'no';
                  
                  return (
                    <Button
                      key={outcome}
                      size="sm"
                      variant={isYes ? "success" : isNo ? "destructive" : "secondary"}
                      className="flex-1 h-9 text-xs font-semibold rounded-lg opacity-90 hover:opacity-100"
                      onClick={(e) => e.preventDefault()}
                    >
                      <span className="mr-1">{outcome}</span>
                      <span className="font-mono">{outcomeProb}%</span>
                    </Button>
                  );
                })}
              </div>
            </div>
            
            <div className="flex flex-col items-end justify-start">
              <div className="text-3xl font-bold text-uniswap-accessible-pink mb-1 font-mono">
                {probability}%
              </div>
              <div className={`flex items-center gap-1 text-xs font-medium ${isPositive ? "text-success" : "text-destructive"}`}>
                {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                <span className="font-mono">{isPositive ? '+' : ''}{change24h}%</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};
