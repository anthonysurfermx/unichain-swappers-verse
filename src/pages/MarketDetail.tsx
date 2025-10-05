import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { MarketChart } from "@/components/MarketChart";
import { TradingPanel } from "@/components/TradingPanel";
import { MarketStats } from "@/components/MarketStats";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Calendar, TrendingUp } from "lucide-react";

const MarketDetail = () => {
  const { id } = useParams();

  const { data: market, isLoading } = useQuery({
    queryKey: ["market", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("markets")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (!market) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold">Market not found</h1>
        </div>
      </div>
    );
  }

  const endDate = new Date(market.end_date);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 space-y-6">
            <div className="glass rounded-xl p-6">
              <div className="flex flex-wrap gap-3 mb-4">
                <Badge variant="secondary">{market.category}</Badge>
                <Badge variant="outline" className="gap-1">
                  <Calendar className="w-3 h-3" />
                  Ends {endDate.toLocaleDateString()}
                </Badge>
                <Badge className="gap-1 bg-success/20 text-success">
                  <TrendingUp className="w-3 h-3" />
                  Active
                </Badge>
              </div>

              <h1 className="text-3xl font-bold mb-3">{market.title}</h1>
              <p className="text-muted-foreground">{market.description}</p>
            </div>

            <MarketStats market={market} />
            <MarketChart marketId={market.id} />
          </div>

          <div className="lg:w-96">
            <TradingPanel market={market} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketDetail;
