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
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-xl p-5 animate-pulse">
              <div className="flex gap-4">
                <Skeleton className="h-14 w-14 rounded-xl bg-gray-200" />
                <div className="flex-1 space-y-3">
                  <Skeleton className="h-5 w-3/4 bg-gray-200 rounded" />
                  <Skeleton className="h-4 w-1/2 bg-gray-200 rounded" />
                  <Skeleton className="h-9 w-full bg-gray-200 rounded-lg" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1">
      <div className="space-y-4">
        {markets?.map((market) => (
          <MarketCard key={market.id} market={market} />
        ))}
      </div>

      {markets?.length === 0 && (
        <div className="text-center py-16 bg-white border border-gray-200 rounded-xl">
          <p className="text-gray-500 text-lg">No markets found in this category</p>
          <p className="text-gray-400 text-sm mt-2">Try selecting a different category</p>
        </div>
      )}
    </div>
  );
};
