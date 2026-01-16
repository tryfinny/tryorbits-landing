import { lazy, Suspense } from 'react';
import { HeroSection } from '@/components/landing/HeroSection';
import { Footer } from '@/components/landing/Footer';
import { LazySection } from '@/components/landing/LazySection';

// Lazy load below-fold components for code splitting
const FeaturesSection = lazy(() => import('@/components/landing/FeaturesSection').then(m => ({ default: m.FeaturesSection })));
const SocialProofSection = lazy(() => import('@/components/landing/SocialProofSection').then(m => ({ default: m.SocialProofSection })));
const CTASection = lazy(() => import('@/components/landing/CTASection').then(m => ({ default: m.CTASection })));
const StickyDownloadBar = lazy(() => import('@/components/landing/StickyDownloadBar').then(m => ({ default: m.StickyDownloadBar })));

const Index = () => {
  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      {/* Hero always renders immediately - it's above the fold */}
      <HeroSection />
      
      {/* Below-fold sections lazy load when scrolled into view */}
      <LazySection minHeight="600px" rootMargin="0px 0px 300px 0px">
        <Suspense fallback={null}>
          <FeaturesSection />
        </Suspense>
      </LazySection>
      
      <LazySection minHeight="500px" rootMargin="0px 0px 300px 0px">
        <Suspense fallback={null}>
          <SocialProofSection />
        </Suspense>
      </LazySection>
      
      <LazySection minHeight="400px" rootMargin="0px 0px 300px 0px">
        <Suspense fallback={null}>
          <CTASection />
        </Suspense>
      </LazySection>
      
      <Footer />
      <Suspense fallback={null}>
        <StickyDownloadBar />
      </Suspense>
    </main>
  );
};

export default Index;
