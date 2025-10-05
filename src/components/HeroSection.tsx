import { TrendingUp, DollarSign, BarChart3 } from "lucide-react";
import { useMarketData } from "@/hooks/useMarketData";
import { formatEther } from "viem";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const StatCard = ({ icon, label, value }: StatCardProps) => (
  <div className="bg-white rounded-xl border border-gray-200 p-6 text-center shadow-sm hover:shadow-md transition-all">
    <div className="flex justify-center mb-2 text-uniswap-accessible-pink">{icon}</div>
    <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
    <div className="text-xs uppercase tracking-wide text-gray-500 font-medium">{label}</div>
  </div>
);

export const HeroSection = () => {
  const { yesPool, noPool, yesProbability } = useMarketData();

  const totalLiquidity = yesPool + noPool;
  const liquidityInEth = totalLiquidity > 0n ? formatEther(totalLiquidity) : "0";
  const yesProb = yesProbability / 100;
  const noProb = 100 - yesProb;

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white border-b border-gray-200">
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-3">
            On-Chain Prediction Market
          </h2>
          <p className="text-lg text-gray-500">
            Fully decentralized on Unichain Mainnet
          </p>
        </div>
        <div className="grid grid-cols-3 gap-6 max-w-3xl mx-auto">
          <StatCard
            icon={<DollarSign className="w-5 h-5" />}
            label="Liquidity"
            value={`${Number(liquidityInEth).toFixed(4)} ETH`}
          />
          <StatCard
            icon={<TrendingUp className="w-5 h-5" />}
            label="YES"
            value={`${yesProb.toFixed(1)}%`}
          />
          <StatCard
            icon={<BarChart3 className="w-5 h-5" />}
            label="NO"
            value={`${noProb.toFixed(1)}%`}
          />
        </div>
      </div>
    </div>
  );
};
