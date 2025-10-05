import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MarketCard } from "@/components/MarketCard";
import { Skeleton } from "@/components/ui/skeleton";

interface Market {
  id: string;
  title: string;
  description: string;
  category: string;
  outcomes: string[];
  end_date: string;
  total_volume: number;
  total_liquidity: number;
  image_url: string | null;
  status: string;
}

interface MarketGridProps {
  selectedCategory: string;
}

export const MarketGrid = ({ selectedCategory }: MarketGridProps) => {
  const { data: markets, isLoading } = useQuery({
    queryKey: ["markets", selectedCategory],
    queryFn: async () => {
      let query = supabase
        .from("markets")
        .select("*")
        .eq("status", "active")
        .order("total_volume", { ascending: false });

      if (selectedCategory !== "All") {
        query = query.eq("category", selectedCategory as any);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Market[];
    },
  });

  // Set up realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel("markets-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "markets",
        },
        () => {
          // Refetch when markets change
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-80 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">
          {selectedCategory === "All" ? "All Markets" : selectedCategory}
        </h2>
        <p className="text-muted-foreground">{markets?.length || 0} markets</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {markets?.map((market) => (
          <MarketCard key={market.id} market={market} />
        ))}
      </div>

      {markets?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No markets found in this category</p>
        </div>
      )}
    </div>
  );
};
