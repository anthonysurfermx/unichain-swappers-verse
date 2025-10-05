import { TrendingUp, Users, DollarSign, Activity } from "lucide-react";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const StatCard = ({ icon, label, value }: StatCardProps) => (
  <div className="text-center">
    <div className="flex justify-center mb-1 text-muted-foreground">{icon}</div>
    <div className="text-2xl font-bold mb-0.5">{value}</div>
    <div className="text-xs text-muted-foreground">{label}</div>
  </div>
);

export const HeroSection = () => {
  return (
    <div className="bg-card border-b border-border">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
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
