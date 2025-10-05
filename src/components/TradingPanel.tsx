import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wallet, TrendingUp, TrendingDown } from "lucide-react";
import { toast } from "sonner";
import { useAccount } from 'wagmi';
import { tradeSchema } from '@/lib/validation';

interface TradingPanelProps {
  market: any;
}

export const TradingPanel = ({ market }: TradingPanelProps) => {
  const [amount, setAmount] = useState("");
  const [selectedOutcome, setSelectedOutcome] = useState(0);
  const { address, isConnected } = useAccount();

  const outcomes = Array.isArray(market.outcomes) ? market.outcomes : ["Yes", "No"];
  const avgPrice = 0.65;
  const shares = amount ? (parseFloat(amount) / avgPrice).toFixed(2) : "0";
  const potentialReturn = amount ? (parseFloat(amount) / avgPrice).toFixed(2) : "0";
  const maxProfit = amount ? (parseFloat(potentialReturn) - parseFloat(amount)).toFixed(2) : "0";

  const handleTrade = (type: "buy" | "sell") => {
    if (!isConnected || !address) {
      toast.error("Wallet not connected", {
        description: "Please connect your wallet to trade"
      });
      return;
    }

    const amountNum = parseFloat(amount);
    
    // Validate trade input
    const validation = tradeSchema.safeParse({
      amount: amountNum,
      outcome: outcomes[selectedOutcome],
      marketId: market?.id || 'temp-id'
    });

    if (!validation.success) {
      toast.error("Invalid trade", {
        description: validation.error.errors[0].message
      });
      return;
    }

    toast.success(`${type === "buy" ? "Buy" : "Sell"} order placed!`, {
      description: `${shares} shares of "${outcomes[selectedOutcome]}" for $${amount}`,
    });
  };

  return (
    <Card className="bg-white border border-gray-200 rounded-xl shadow-lg p-8 sticky top-24">
      <Tabs defaultValue="buy" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-100 p-1 rounded-xl h-12">
          <TabsTrigger 
            value="buy" 
            className="gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900 rounded-lg font-semibold transition-all"
          >
            <TrendingUp className="w-4 h-4" />
            BUY
          </TabsTrigger>
          <TabsTrigger 
            value="sell" 
            className="gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900 rounded-lg font-semibold transition-all"
          >
            <TrendingDown className="w-4 h-4" />
            SELL
          </TabsTrigger>
        </TabsList>

        <TabsContent value="buy" className="space-y-6">
          <div>
            <Label className="mb-3 block text-sm font-medium text-gray-700">Select Outcome</Label>
            <div className="grid grid-cols-2 gap-3">
              {outcomes.map((outcome, idx) => (
                <Button
                  key={idx}
                  variant={selectedOutcome === idx ? "success" : "outline"}
                  className={`h-12 font-semibold ${selectedOutcome === idx ? "" : "hover:border-success"}`}
                  onClick={() => setSelectedOutcome(idx)}
                >
                  {outcome}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="amount" className="mb-2 block text-sm font-medium text-gray-700">
              Amount (USDC)
            </Label>
            <Input
              id="amount"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="h-12 text-base border-gray-300 focus:ring-2 focus:ring-uniswap-pink rounded-xl"
            />
            <div className="flex gap-2 mt-3">
              {[25, 50, 75, 100].map((percent) => (
                <Button
                  key={percent}
                  variant="outline"
                  size="sm"
                  onClick={() => setAmount((1000 * (percent / 100)).toString())}
                  className="flex-1 h-9 rounded-lg"
                >
                  {percent === 100 ? "MAX" : `${percent}%`}
                </Button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2 font-medium">Available: $1,000.00</p>
          </div>

          <div className="space-y-3 p-4 rounded-xl bg-gray-50 border border-gray-200">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Avg. Price:</span>
              <span className="font-mono font-semibold text-gray-900">${avgPrice}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Est. Shares:</span>
              <span className="font-mono font-semibold text-gray-900">{shares}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Potential Return:</span>
              <span className="font-mono font-semibold text-success">+{((parseFloat(maxProfit) / parseFloat(amount || "1")) * 100).toFixed(0)}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Max Profit:</span>
              <span className="font-mono font-semibold text-success">${maxProfit}</span>
            </div>
            <div className="flex justify-between text-sm border-t border-gray-200 pt-3">
              <span className="text-gray-500">Fees (1%):</span>
              <span className="font-mono font-semibold text-gray-900">${amount ? (parseFloat(amount) * 0.01).toFixed(2) : "0.00"}</span>
            </div>
          </div>

          <Button
            variant="pill"
            className="w-full gap-2 h-14 text-base"
            onClick={() => handleTrade("buy")}
            disabled={!isConnected}
          >
            <Wallet className="w-5 h-5" />
            {isConnected ? "Place Buy Order" : "Connect Wallet to Trade"}
          </Button>

          {!isConnected && (
            <p className="text-xs text-center text-gray-500">
              Connect your wallet to start trading
            </p>
          )}
        </TabsContent>

        <TabsContent value="sell" className="space-y-6">
          <div>
            <Label className="mb-3 block text-sm font-medium text-gray-700">Select Outcome</Label>
            <div className="grid grid-cols-2 gap-3">
              {outcomes.map((outcome, idx) => (
                <Button
                  key={idx}
                  variant={selectedOutcome === idx ? "destructive" : "outline"}
                  className={`h-12 font-semibold ${selectedOutcome === idx ? "" : "hover:border-destructive"}`}
                  onClick={() => setSelectedOutcome(idx)}
                >
                  {outcome}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="amount-sell" className="mb-2 block text-sm font-medium text-gray-700">
              Amount (USDC)
            </Label>
            <Input
              id="amount-sell"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="h-12 text-base border-gray-300 focus:ring-2 focus:ring-uniswap-pink rounded-xl"
            />
            <p className="text-xs text-gray-500 mt-2 font-medium">Your position: 0 shares</p>
          </div>

          <Button
            variant="destructive"
            className="w-full gap-2 h-14 text-base rounded-xl"
            onClick={() => handleTrade("sell")}
            disabled={!isConnected}
          >
            <TrendingDown className="w-5 h-5" />
            {isConnected ? "Place Sell Order" : "Connect Wallet to Trade"}
          </Button>
        </TabsContent>
      </Tabs>
    </Card>
  );
};
