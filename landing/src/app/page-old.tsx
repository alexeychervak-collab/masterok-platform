'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import Hero from '@/components/sections/Hero';
import { Trust } from '@/components/sections/Trust';
import { HowItWorks } from '@/components/sections/HowItWorks';
import CategoriesEnhanced from '@/components/sections/CategoriesEnhanced';
import { FeaturedSpecialists } from '@/components/sections/FeaturedSpecialists';
import { Stats } from '@/components/sections/Stats';
import { Testimonials } from '@/components/sections/Testimonials';
import InteractiveFeatures from '@/components/sections/InteractiveFeatures';
import { AppDownload } from '@/components/sections/AppDownload';
import { CTA } from '@/components/sections/CTA';

// New improved components
import NavigationTabs from '@/components/ui/navigation-tabs';
import ServiceCalculator from '@/components/ui/service-calculator';
import FrequentlySearched from '@/components/ui/frequently-searched';
import AIAssistant from '@/components/ui/ai-assistant';

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className={`min-h-screen transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <Header />
      <NavigationTabs />
      
      <main>
        <Hero />
        <Trust />
        <HowItWorks />
        <CategoriesEnhanced />
        <Stats />
        
        {/* Calculator Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ServiceCalculator />
          </div>
        </section>

        <FeaturedSpecialists />
        <InteractiveFeatures />
        
        {/* Frequently Searched Section */}
        <FrequentlySearched />
        
        <Testimonials />
        <AppDownload />
        <CTA />
      </main>

      <Footer />
      
      {/* AI Assistant */}
      <AIAssistant />
    </div>
  );
}
