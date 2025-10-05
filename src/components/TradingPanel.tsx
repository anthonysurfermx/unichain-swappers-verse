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
    <Card className="glass border-border p-6 sticky top-20">
      <Tabs defaultValue="buy" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="buy" className="gap-2">
            <TrendingUp className="w-4 h-4" />
            Buy
          </TabsTrigger>
          <TabsTrigger value="sell" className="gap-2">
            <TrendingDown className="w-4 h-4" />
            Sell
          </TabsTrigger>
        </TabsList>

        <TabsContent value="buy" className="space-y-6">
          <div>
            <Label className="mb-3 block">Select Outcome</Label>
            <div className="grid grid-cols-2 gap-2">
              {outcomes.map((outcome, idx) => (
                <Button
                  key={idx}
                  variant={selectedOutcome === idx ? "default" : "outline"}
                  className={selectedOutcome === idx ? "bg-success hover:bg-success/90" : ""}
                  onClick={() => setSelectedOutcome(idx)}
                >
                  {outcome}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="amount" className="mb-2 block">
              Amount (USDC)
            </Label>
            <Input
              id="amount"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-card/50"
            />
            <div className="flex gap-2 mt-2">
              {[25, 50, 75, 100].map((percent) => (
                <Button
                  key={percent}
                  variant="outline"
                  size="sm"
                  onClick={() => setAmount((1000 * (percent / 100)).toString())}
                  className="flex-1"
                >
                  {percent === 100 ? "MAX" : `${percent}%`}
                </Button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2">Available: $1,000.00</p>
          </div>

          <div className="space-y-3 p-4 rounded-lg bg-card/50 border border-border">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Avg. Price:</span>
              <span className="font-medium">${avgPrice}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Est. Shares:</span>
              <span className="font-medium">{shares}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Potential Return:</span>
              <span className="font-medium text-success">+{((parseFloat(maxProfit) / parseFloat(amount || "1")) * 100).toFixed(0)}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Max Profit:</span>
              <span className="font-medium text-success">${maxProfit}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Fees:</span>
              <span className="font-medium">${amount ? (parseFloat(amount) * 0.01).toFixed(2) : "0.00"}</span>
            </div>
          </div>

          <Button
            className="w-full gap-2 glow-primary h-12 text-base font-semibold"
            onClick={() => handleTrade("buy")}
            disabled={!isConnected}
          >
            <Wallet className="w-5 h-5" />
            {isConnected ? "Place Buy Order" : "Connect Wallet to Trade"}
          </Button>

          {!isConnected && (
            <p className="text-xs text-center text-muted-foreground">
              Connect your wallet to trade
            </p>
          )}
        </TabsContent>

        <TabsContent value="sell" className="space-y-6">
          <div>
            <Label className="mb-3 block">Select Outcome</Label>
            <div className="grid grid-cols-2 gap-2">
              {outcomes.map((outcome, idx) => (
                <Button
                  key={idx}
                  variant={selectedOutcome === idx ? "default" : "outline"}
                  className={selectedOutcome === idx ? "bg-destructive hover:bg-destructive/90" : ""}
                  onClick={() => setSelectedOutcome(idx)}
                >
                  {outcome}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="amount-sell" className="mb-2 block">
              Amount (USDC)
            </Label>
            <Input
              id="amount-sell"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-card/50"
            />
            <p className="text-xs text-muted-foreground mt-2">Your position: 0 shares</p>
          </div>

          <Button
            className="w-full gap-2 bg-destructive hover:bg-destructive/90 h-12 text-base font-semibold"
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
