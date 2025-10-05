import { TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { ConnectButton } from '@rainbow-me/rainbowkit';

export const Navbar = () => {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-[72px]">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-uniswap-pink to-uniswap-accessible-pink rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-uniswap-pink to-uniswap-accessible-pink bg-clip-text text-transparent">
              Swappers
            </span>
          </Link>

          <div className="flex-1 max-w-md mx-12">
            <h1 className="text-lg font-semibold text-gray-900 text-center">Prediction Markets</h1>
          </div>

          <div className="flex items-center gap-3">
            <ConnectButton />
          </div>
        </div>
      </div>
    </nav>
  );
};
