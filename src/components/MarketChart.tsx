import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface MarketChartProps {
  marketId: string;
}

const timeframes = ["1H", "24H", "7D", "30D", "ALL"];

export const MarketChart = ({ marketId }: MarketChartProps) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState("24H");

  const { data: priceData } = useQuery({
    queryKey: ["market-prices", marketId, selectedTimeframe],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("market_prices")
        .select("*")
        .eq("market_id", marketId)
        .order("timestamp", { ascending: true })
        .limit(100);

      if (error) throw error;

      // If no data, generate mock data
      if (!data || data.length === 0) {
        return Array.from({ length: 24 }, (_, i) => ({
          timestamp: new Date(Date.now() - (23 - i) * 3600000).toISOString(),
          probability: 50 + Math.random() * 30,
          price: 0.5 + Math.random() * 0.3,
        }));
      }

      return data.map((d) => ({
        timestamp: d.timestamp,
        probability: parseFloat(d.probability.toString()),
        price: parseFloat(d.price.toString()),
      }));
    },
  });

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <Card className="glass border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Probability Chart</h3>
        <div className="flex gap-1">
          {timeframes.map((tf) => (
            <Button
              key={tf}
              variant={selectedTimeframe === tf ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setSelectedTimeframe(tf)}
              className={selectedTimeframe === tf ? "bg-primary/10 text-primary" : ""}
            >
              {tf}
            </Button>
          ))}
        </div>
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
