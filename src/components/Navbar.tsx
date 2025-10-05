import { Search, Wallet, User, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAccount, useConnect, useDisconnect } from 'wagmi';

export const Navbar = () => {
  const { address, isConnected } = useAccount();
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();

  const handleConnect = () => {
    const injectedConnector = connectors.find(c => c.id === 'injected');
    if (injectedConnector) {
      connect({ connector: injectedConnector });
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };
  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <Link to="/" className="flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-primary" />
            <span className="text-lg font-bold text-foreground">Swappers MX</span>
          </Link>

          <div className="flex-1 max-w-xl mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search markets..."
                className="w-full pl-10 pr-4 py-1.5 text-sm rounded-md bg-secondary border border-border focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isConnected && address ? (
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs h-8"
                onClick={() => disconnect()}
              >
                <Wallet className="w-3.5 h-3.5 mr-1.5" />
                {formatAddress(address)}
              </Button>
            ) : (
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs h-8"
                onClick={handleConnect}
              >
                <Wallet className="w-3.5 h-3.5 mr-1.5" />
                Connect
              </Button>
            )}

            <Button variant="ghost" size="icon" className="h-8 w-8">
              <User className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
