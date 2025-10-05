import { TrendingUp, Users, DollarSign, Activity } from "lucide-react";

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
  return (
    <div className="bg-gradient-to-b from-gray-50 to-white border-b border-gray-200">
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-3">
            Trade on the Outcome
          </h2>
          <p className="text-lg text-gray-500">
            Decentralized prediction markets powered by blockchain
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          <StatCard
            icon={<TrendingUp className="w-5 h-5" />}
            label="Total Volume"
            value="$24.5M"
          />
          <StatCard
            icon={<DollarSign className="w-5 h-5" />}
            label="Total Liquidity"
            value="$8.2M"
          />
          <StatCard
            icon={<Users className="w-5 h-5" />}
            label="Active Traders"
            value="15.3K"
          />
          <StatCard
            icon={<Activity className="w-5 h-5" />}
            label="Active Markets"
            value="243"
          />
        </div>
      </div>
    </div>
  );
};
