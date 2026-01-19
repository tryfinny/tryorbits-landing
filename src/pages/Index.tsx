import { HeroSection } from '@/components/landing/HeroSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { SocialProofSection } from '@/components/landing/SocialProofSection';
import { CTASection } from '@/components/landing/CTASection';

import { Footer } from '@/components/landing/Footer';
import { LazySection } from '@/components/landing/LazySection';

const Index = () => {
  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      {/* Hero always renders immediately - it's above the fold */}
      <HeroSection />
      
      {/* Below-fold sections lazy load when scrolled into view */}
      <LazySection minHeight="600px" rootMargin="0px 0px 300px 0px">
        <FeaturesSection />
      </LazySection>
      
      <LazySection minHeight="500px" rootMargin="0px 0px 300px 0px">
        <SocialProofSection />
      </LazySection>
      
      <LazySection minHeight="400px" rootMargin="0px 0px 300px 0px">
        <CTASection />
      </LazySection>
      
      <Footer />
      
    </main>
  );
};

export default Index;
