import { DollarSign, TrendingUp, TrendingDown, Droplet } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useMarketData } from "@/hooks/useMarketData";

interface MarketStatsProps {
  market: {
    total_volume: number;
    total_liquidity: number;
  };
}

export const MarketStats = ({ market }: MarketStatsProps) => {
  const { yesProbability } = useMarketData();

  const formatEth = (value: number) => {
    return `${value.toFixed(4)} ETH`;
  };

  const yesProb = (yesProbability / 100).toFixed(1);
  const noProb = ((10000 - yesProbability) / 100).toFixed(1);

  const stats = [
    {
      label: "Total Liquidity",
      value: formatEth(market.total_liquidity),
      icon: Droplet,
      color: "text-blue-400",
    },
    {
      label: "Total Volume",
      value: formatEth(market.total_volume),
      icon: DollarSign,
      color: "text-primary",
    },
    {
      label: "YES Probability",
      value: `${yesProb}%`,
      icon: TrendingUp,
      color: "text-success",
    },
    {
      label: "NO Probability",
      value: `${noProb}%`,
      icon: TrendingDown,
      color: "text-destructive",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.label} className="glass border-border p-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg ${stat.color} bg-opacity-20 flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <p className="text-lg font-bold">{stat.value}</p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
