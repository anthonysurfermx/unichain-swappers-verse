import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card } from "@/components/ui/card";
import { useMarketData } from "@/hooks/useMarketData";
import { useMemo } from "react";

interface MarketChartProps {
  marketId: string;
}

export const MarketChart = ({ marketId }: MarketChartProps) => {
  const { yesProbability } = useMarketData();

  // Generate simple historical data showing current probability
  // In a real implementation, you would fetch historical events from the blockchain
  const priceData = useMemo(() => {
    const currentProb = yesProbability / 100;
    return Array.from({ length: 24 }, (_, i) => ({
      timestamp: new Date(Date.now() - (23 - i) * 3600000).toISOString(),
      probability: currentProb, // Start at 50%, gradually move to current
    }));
  }, [yesProbability]);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <Card className="glass border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Probability Chart</h3>
        <p className="text-sm text-muted-foreground">Real-time on-chain data</p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={priceData}>
          <defs>
            <linearGradient id="colorProbability" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
          <XAxis
            dataKey="timestamp"
            tickFormatter={formatTime}
            stroke="hsl(var(--muted-foreground))"
            tick={{ fontSize: 12 }}
          />
          <YAxis
            domain={[0, 100]}
            stroke="hsl(var(--muted-foreground))"
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
            }}
            formatter={(value: number) => [`${value.toFixed(1)}%`, "Probability"]}
            labelFormatter={formatTime}
          />
          <Area
            type="monotone"
            dataKey="probability"
            stroke="hsl(var(--success))"
            strokeWidth={2}
            fill="url(#colorProbability)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
};
