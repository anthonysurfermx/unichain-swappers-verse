import { DollarSign, TrendingUp, Users, Droplet } from "lucide-react";
import { Card } from "@/components/ui/card";

interface MarketStatsProps {
  market: {
    total_volume: number;
    total_liquidity: number;
  };
}

export const MarketStats = ({ market }: MarketStatsProps) => {
  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(2)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value.toFixed(0)}`;
  };

  const stats = [
    {
      label: "Total Volume",
      value: formatCurrency(market.total_volume),
      icon: DollarSign,
      color: "text-primary",
    },
    {
      label: "Liquidity",
      value: formatCurrency(market.total_liquidity),
      icon: Droplet,
      color: "text-blue-400",
    },
    {
      label: "Total Traders",
      value: Math.floor(Math.random() * 1000) + 100,
      icon: Users,
      color: "text-purple-400",
    },
    {
      label: "24h Change",
      value: `+${(Math.random() * 10).toFixed(1)}%`,
      icon: TrendingUp,
      color: "text-success",
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
