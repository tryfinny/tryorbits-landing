import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { HeroSection } from '@/components/landing/HeroSection';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { AiCalloutSection } from '@/components/landing/AiCalloutSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { SocialProofSection } from '@/components/landing/SocialProofSection';
import { FAQSection } from '@/components/landing/FAQSection';
import { CTASection } from '@/components/landing/CTASection';
import { Footer } from '@/components/landing/Footer';
import { LazySection } from '@/components/landing/LazySection';

const queryClient = new QueryClient();

function SoftDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`w-full flex justify-center py-6 ${className}`} aria-hidden>
      <div className="w-24 h-[2px] rounded-full bg-gradient-to-r from-transparent via-border to-transparent" />
    </div>
  );
}

const Index = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
    <main className="min-h-screen bg-background overflow-x-hidden">
      {/* Hero always renders immediately - it's above the fold */}
      <HeroSection />
      
      {/* Below-fold sections lazy load when scrolled into view */}
      <LazySection minHeight="500px" rootMargin="0px 0px 300px 0px">
        <HowItWorksSection />
      </LazySection>

      <LazySection minHeight="200px" rootMargin="0px 0px 300px 0px">
        <AiCalloutSection />
      </LazySection>

      <SoftDivider />
      <LazySection minHeight="600px" rootMargin="0px 0px 300px 0px">
        <FeaturesSection />
      </LazySection>
      
      <LazySection minHeight="500px" rootMargin="0px 0px 300px 0px">
        <SocialProofSection />
      </LazySection>

      <SoftDivider />
      <LazySection minHeight="400px" rootMargin="0px 0px 300px 0px">
        <FAQSection />
      </LazySection>
      
      <LazySection minHeight="400px" rootMargin="0px 0px 300px 0px">
        <CTASection />
      </LazySection>
      
      <Footer />
    </main>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default Index;
