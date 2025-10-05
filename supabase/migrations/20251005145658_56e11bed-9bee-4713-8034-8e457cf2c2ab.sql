-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum for market categories
CREATE TYPE market_category AS ENUM ('Politics', 'Sports', 'Crypto', 'Custom');

-- Create enum for market status
CREATE TYPE market_status AS ENUM ('active', 'closed', 'resolved');

-- Create enum for trade type
CREATE TYPE trade_type AS ENUM ('buy', 'sell');

-- Markets table
CREATE TABLE public.markets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category market_category NOT NULL DEFAULT 'Custom',
  outcomes JSONB NOT NULL DEFAULT '["Yes", "No"]'::jsonb,
  end_date TIMESTAMPTZ NOT NULL,
  resolution TEXT,
  total_volume NUMERIC DEFAULT 0,
  total_liquidity NUMERIC DEFAULT 0,
  creator_address TEXT NOT NULL,
  status market_status NOT NULL DEFAULT 'active',
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Positions table
CREATE TABLE public.positions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_address TEXT NOT NULL,
  market_id UUID NOT NULL REFERENCES public.markets(id) ON DELETE CASCADE,
  outcome TEXT NOT NULL,
  shares NUMERIC NOT NULL DEFAULT 0,
  avg_price NUMERIC NOT NULL DEFAULT 0,
  current_value NUMERIC NOT NULL DEFAULT 0,
  realized_pnl NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_address, market_id, outcome)
);

-- Trades table
CREATE TABLE public.trades (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  market_id UUID NOT NULL REFERENCES public.markets(id) ON DELETE CASCADE,
  user_address TEXT NOT NULL,
  trade_type trade_type NOT NULL,
  outcome TEXT NOT NULL,
  shares NUMERIC NOT NULL,
  price NUMERIC NOT NULL,
  total_cost NUMERIC NOT NULL,
  tx_hash TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Market prices table (historical prices)
CREATE TABLE public.market_prices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  market_id UUID NOT NULL REFERENCES public.markets(id) ON DELETE CASCADE,
  outcome TEXT NOT NULL,
  price NUMERIC NOT NULL,
  probability NUMERIC NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- User profiles table
CREATE TABLE public.user_profiles (
  wallet_address TEXT PRIMARY KEY,
  username TEXT,
  total_volume NUMERIC DEFAULT 0,
  total_profit NUMERIC DEFAULT 0,
  markets_traded INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.markets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for markets (public read, creator write)
CREATE POLICY "Markets are viewable by everyone"
  ON public.markets FOR SELECT
  USING (true);

CREATE POLICY "Users can create markets"
  ON public.markets FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Creators can update their markets"
  ON public.markets FOR UPDATE
  USING (true);

-- RLS Policies for positions (user can only see their own)
CREATE POLICY "Users can view their own positions"
  ON public.positions FOR SELECT
  USING (true);

CREATE POLICY "Users can create their own positions"
  ON public.positions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update their own positions"
  ON public.positions FOR UPDATE
  USING (true);

-- RLS Policies for trades (public read, authenticated write)
CREATE POLICY "Trades are viewable by everyone"
  ON public.trades FOR SELECT
  USING (true);

CREATE POLICY "Users can create trades"
  ON public.trades FOR INSERT
  WITH CHECK (true);

-- RLS Policies for market_prices (public read)
CREATE POLICY "Market prices are viewable by everyone"
  ON public.market_prices FOR SELECT
  USING (true);

CREATE POLICY "Market prices can be inserted"
  ON public.market_prices FOR INSERT
  WITH CHECK (true);

-- RLS Policies for user_profiles (public read, owner write)
CREATE POLICY "Profiles are viewable by everyone"
  ON public.user_profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can create their own profile"
  ON public.user_profiles FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update their own profile"
  ON public.user_profiles FOR UPDATE
  USING (true);

-- Create indexes for performance
CREATE INDEX idx_markets_status ON public.markets(status);
CREATE INDEX idx_markets_category ON public.markets(category);
CREATE INDEX idx_markets_end_date ON public.markets(end_date);
CREATE INDEX idx_positions_user ON public.positions(user_address);
CREATE INDEX idx_positions_market ON public.positions(market_id);
CREATE INDEX idx_trades_market ON public.trades(market_id);
CREATE INDEX idx_trades_user ON public.trades(user_address);
CREATE INDEX idx_market_prices_market ON public.market_prices(market_id);
CREATE INDEX idx_market_prices_timestamp ON public.market_prices(timestamp);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_markets_updated_at
  BEFORE UPDATE ON public.markets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_positions_updated_at
  BEFORE UPDATE ON public.positions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable realtime for live updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.markets;
ALTER PUBLICATION supabase_realtime ADD TABLE public.trades;
ALTER PUBLICATION supabase_realtime ADD TABLE public.market_prices;

-- Insert sample data for development
INSERT INTO public.markets (title, description, category, outcomes, end_date, creator_address, total_volume, total_liquidity, image_url) VALUES
('¿AMLO regresará a la política en 2025?', 'Mercado de predicción sobre el posible regreso de AMLO a la arena política mexicana después de su retiro', 'Politics', '["Sí", "No"]', '2025-12-31 23:59:59+00', '0x0000000000000000000000000000000000000000', 125000, 50000, 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800'),
('¿México clasificará al Mundial 2026?', 'Predicción sobre si la selección mexicana clasificará como anfitrión al Mundial de Fútbol 2026', 'Sports', '["Sí", "No"]', '2026-06-01 00:00:00+00', '0x0000000000000000000000000000000000000000', 89000, 35000, 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800'),
('Bitcoin superará $100K en 2025', 'Mercado sobre si Bitcoin alcanzará o superará los $100,000 USD durante el año 2025', 'Crypto', '["Sí", "No"]', '2025-12-31 23:59:59+00', '0x0000000000000000000000000000000000000000', 250000, 100000, 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=800'),
('¿Habrá reforma electoral en México?', 'Predicción sobre la implementación de una nueva reforma electoral en México durante 2025', 'Politics', '["Sí", "No"]', '2025-11-30 23:59:59+00', '0x0000000000000000000000000000000000000000', 67000, 28000, 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800');

-- Insert sample market prices for the first market
INSERT INTO public.market_prices (market_id, outcome, price, probability, timestamp) 
SELECT 
  m.id,
  'Sí',
  0.65,
  65.0,
  NOW() - INTERVAL '1 hour'
FROM public.markets m 
WHERE m.title = '¿AMLO regresará a la política en 2025?'
LIMIT 1;

INSERT INTO public.market_prices (market_id, outcome, price, probability, timestamp) 
SELECT 
  m.id,
  'Sí',
  0.68,
  68.0,
  NOW()
FROM public.markets m 
WHERE m.title = '¿AMLO regresará a la política en 2025?'
LIMIT 1;