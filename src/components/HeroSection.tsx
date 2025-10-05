import { TrendingUp, Users, DollarSign } from "lucide-react";

export const HeroSection = () => {
  return (
    <div className="relative overflow-hidden border-b border-border">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-purple-500/10 to-primary/10 blur-3xl" />
      
      <div className="relative container mx-auto px-4 py-12">
        <div className="text-center space-y-4 mb-8">
          <h1 className="text-4xl md:text-5xl font-bold">
            Mercado de Predicción en <span className="gradient-text">Unichain</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Apuesta en eventos del futuro. Política, deportes, crypto y más.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="glass rounded-xl p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
              <DollarSign className="w-6 h-6 text-primary" />
            </div>
            <div className="text-2xl font-bold">$2.4M</div>
            <div className="text-sm text-muted-foreground">Total Volume</div>
          </div>

          <div className="glass rounded-xl p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-6 h-6 text-success" />
            </div>
            <div className="text-2xl font-bold">124</div>
            <div className="text-sm text-muted-foreground">Active Markets</div>
          </div>

          <div className="glass rounded-xl p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 text-purple-400" />
            </div>
            <div className="text-2xl font-bold">12.5K</div>
            <div className="text-sm text-muted-foreground">Total Users</div>
          </div>
        </div>
      </div>
    </div>
  );
};
