import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { MarketCard } from "@/components/MarketCard";
import { useMarketData } from "@/hooks/useMarketData";

const Index = () => {
  const { question, endTime, yesProbability, yesPool, noPool } = useMarketData();

  // Create market object for display
  const market = {
    id: '1',
    title: question || 'El grupo de Telegram de Uniswap llegará a 1,000 miembros antes del 31 de Octubre 2025?',
    description: 'Predicción sobre si el grupo de Telegram de Uniswap Swappers MX alcanzará 1,000 miembros antes del 31 de Octubre de 2025.',
    category: 'Crypto',
    outcomes: ['Yes', 'No'],
    end_date: new Date(endTime * 1000).toISOString(),
    total_volume: Number(yesPool + noPool) / 1e18,
    total_liquidity: Number(yesPool + noPool) / 1e18,
    image_url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800',
    status: 'active',
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />

      <div className="container mx-auto px-6 py-10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Active Market</h2>
          <MarketCard market={market} />

          <div className="mt-12 p-6 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">How it works</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <p>1. <strong className="text-gray-900">Connect your wallet</strong> to Unichain Mainnet (Chain ID 130)</p>
              <p>2. <strong className="text-gray-900">Buy YES or NO shares</strong> with real ETH based on your prediction</p>
              <p>3. <strong className="text-gray-900">Trade anytime</strong> before the market closes on Oct 31, 2025</p>
              <p>4. <strong className="text-gray-900">Claim winnings</strong> if your prediction is correct after resolution</p>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-xl bg-yellow-50 border border-yellow-200">
            <p className="text-sm text-center font-semibold text-yellow-800">
              ⚠️ Built on <strong>Unichain Mainnet</strong> | Uses REAL ETH | Not audited - Use at your own risk
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
