import { useParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { MarketChart } from "@/components/MarketChart";
import { TradingPanel } from "@/components/TradingPanel";
import { MarketStats } from "@/components/MarketStats";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Calendar, TrendingUp } from "lucide-react";
import { useMarketData } from "@/hooks/useMarketData";

const MarketDetail = () => {
  const { id } = useParams();
  const { question, endTime, resolved, yesProbability, yesPool, noPool } = useMarketData();

  const isLoading = !question;

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

  // Use the correct end date: October 31, 2025
  const correctEndDate = new Date('2025-10-31T23:59:59Z');
  const yesPercent = (yesProbability / 100).toFixed(1);

  // Create market object for child components
  const market = {
    id: '1',
    title: question || 'Loading...',
    description: 'Predicción sobre si el grupo de Telegram de Uniswap Swappers MX alcanzará 1,000 miembros antes del 31 de Octubre de 2025.',
    category: 'Crypto',
    end_date: correctEndDate.toISOString(),
    total_volume: Number(yesPool + noPool) / 1e18,
    total_liquidity: Number(yesPool + noPool) / 1e18,
    status: resolved ? 'resolved' : 'active',
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 space-y-6">
            <div className="glass rounded-xl p-6">
              <div className="flex flex-wrap gap-3 mb-4">
                <Badge variant="secondary">Crypto</Badge>
                <Badge variant="outline" className="gap-1">
                  <Calendar className="w-3 h-3" />
                  Ends {correctEndDate.toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}
                </Badge>
                <Badge className={`gap-1 ${resolved ? 'bg-muted' : 'bg-success/20 text-success'}`}>
                  <TrendingUp className="w-3 h-3" />
                  {resolved ? 'Resolved' : 'Active'}
                </Badge>
              </div>

              <h1 className="text-3xl font-bold mb-3">{question || 'Loading market...'}</h1>
              <p className="text-muted-foreground">{market.description}</p>

              <div className="mt-6 flex gap-4">
                <div className="flex-1 p-4 rounded-lg bg-success/10 border border-success/20">
                  <div className="text-sm text-muted-foreground mb-1">YES</div>
                  <div className="text-2xl font-bold text-success">{yesPercent}%</div>
                </div>
                <div className="flex-1 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                  <div className="text-sm text-muted-foreground mb-1">NO</div>
                  <div className="text-2xl font-bold text-destructive">{(100 - parseFloat(yesPercent)).toFixed(1)}%</div>
                </div>
              </div>
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
