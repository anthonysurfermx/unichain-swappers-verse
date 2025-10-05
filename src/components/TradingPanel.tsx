import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wallet, TrendingUp, TrendingDown } from "lucide-react";
import { toast } from "sonner";
import { useAccount } from "wagmi";
import { useMarketData } from "@/hooks/useMarketData";
import { useTradingActions } from "@/hooks/useTradingActions";

interface TradingPanelProps {
  market?: any;
}

export const TradingPanel = ({ market }: TradingPanelProps) => {
  const [amount, setAmount] = useState("");
  const [shares, setShares] = useState("10");
  const [selectedOutcome, setSelectedOutcome] = useState<'yes' | 'no'>('yes');

  const { isConnected } = useAccount();
  const { yesProbability, userPosition } = useMarketData();
  const { buyShares, sellShares, isPending } = useTradingActions();

  const outcomes = ["Yes", "No"];

  // Calculate probability percentages
  const yesPercent = (yesProbability / 100).toFixed(1);
  const noPercent = ((10000 - yesProbability) / 100).toFixed(1);

  const handleTrade = async (type: "buy" | "sell") => {
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!shares || parseFloat(shares) <= 0) {
      toast.error("Please enter valid number of shares");
      return;
    }

    const isYes = selectedOutcome === 'yes';

    if (type === "buy") {
      await buyShares(isYes, parseInt(shares));
    } else {
      await sellShares(isYes, parseInt(shares));
    }
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
              <Button
                variant={selectedOutcome === 'yes' ? "default" : "outline"}
                className={`h-12 font-semibold ${selectedOutcome === 'yes' ? "bg-emerald-500 hover:bg-emerald-600" : "hover:border-emerald-500"}`}
                onClick={() => setSelectedOutcome('yes')}
              >
                Yes ({yesPercent}%)
              </Button>
              <Button
                variant={selectedOutcome === 'no' ? "default" : "outline"}
                className={`h-12 font-semibold ${selectedOutcome === 'no' ? "bg-red-500 hover:bg-red-600" : "hover:border-red-500"}`}
                onClick={() => setSelectedOutcome('no')}
              >
                No ({noPercent}%)
              </Button>
            </div>
          </div>

          <div>
            <Label htmlFor="shares" className="mb-2 block text-sm font-medium text-gray-700">
              Number of Shares
            </Label>
            <Input
              id="shares"
              type="number"
              placeholder="10"
              value={shares}
              onChange={(e) => setShares(e.target.value)}
              className="h-12 text-base border-gray-300 focus:ring-2 focus:ring-uniswap-pink rounded-xl"
            />
            <div className="flex gap-2 mt-3">
              {[10, 50, 100].map((num) => (
                <Button
                  key={num}
                  variant="outline"
                  size="sm"
                  onClick={() => setShares(num.toString())}
                  className="flex-1 h-9 rounded-lg"
                >
                  {num}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-3 p-4 rounded-xl bg-gray-50 border border-gray-200">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Current Probability:</span>
              <span className="font-mono font-semibold text-gray-900">{selectedOutcome === 'yes' ? yesPercent : noPercent}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Your Position:</span>
              <span className="font-mono font-semibold text-gray-900">
                {userPosition
                  ? `${selectedOutcome === 'yes' ? userPosition.yesShares.toString() : userPosition.noShares.toString()} shares`
                  : '0 shares'
                }
              </span>
            </div>
          </div>

          <Button
            variant="pill"
            className="w-full gap-2 h-14 text-base bg-uniswap-pink hover:bg-uniswap-pink/90"
            onClick={() => handleTrade("buy")}
            disabled={isPending || !isConnected}
          >
            <Wallet className="w-5 h-5" />
            {isPending ? 'Processing...' : isConnected ? 'Buy Shares' : 'Connect Wallet'}
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
              <Button
                variant={selectedOutcome === 'yes' ? "destructive" : "outline"}
                className={`h-12 font-semibold ${selectedOutcome === 'yes' ? "" : "hover:border-red-500"}`}
                onClick={() => setSelectedOutcome('yes')}
              >
                Yes ({yesPercent}%)
              </Button>
              <Button
                variant={selectedOutcome === 'no' ? "destructive" : "outline"}
                className={`h-12 font-semibold ${selectedOutcome === 'no' ? "" : "hover:border-red-500"}`}
                onClick={() => setSelectedOutcome('no')}
              >
                No ({noPercent}%)
              </Button>
            </div>
          </div>

          <div>
            <Label htmlFor="shares-sell" className="mb-2 block text-sm font-medium text-gray-700">
              Number of Shares
            </Label>
            <Input
              id="shares-sell"
              type="number"
              placeholder="10"
              value={shares}
              onChange={(e) => setShares(e.target.value)}
              className="h-12 text-base border-gray-300 focus:ring-2 focus:ring-uniswap-pink rounded-xl"
            />
            <p className="text-xs text-gray-500 mt-2 font-medium">
              Your position: {userPosition
                ? `${selectedOutcome === 'yes' ? userPosition.yesShares.toString() : userPosition.noShares.toString()} shares`
                : '0 shares'
              }
            </p>
          </div>

          <Button
            variant="destructive"
            className="w-full gap-2 h-14 text-base rounded-xl"
            onClick={() => handleTrade("sell")}
            disabled={isPending || !isConnected}
          >
            <TrendingDown className="w-5 h-5" />
            {isPending ? 'Processing...' : isConnected ? 'Sell Shares' : 'Connect Wallet'}
          </Button>
        </TabsContent>
      </Tabs>
    </Card>
  );
};
