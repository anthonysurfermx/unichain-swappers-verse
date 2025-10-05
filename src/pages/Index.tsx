import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { MarketSidebar } from "@/components/MarketSidebar";
import { MarketGrid } from "@/components/MarketGrid";
import { HeroSection } from "@/components/HeroSection";

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      
      <div className="container mx-auto px-6 py-10">
        <div className="flex gap-8">
          <MarketSidebar 
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
          <MarketGrid selectedCategory={selectedCategory} />
        </div>
      </div>
    </div>
  );
};

export default Index;
