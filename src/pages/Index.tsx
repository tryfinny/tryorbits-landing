import { HeroSection } from '@/components/landing/HeroSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { SocialProofSection } from '@/components/landing/SocialProofSection';
import { CTASection } from '@/components/landing/CTASection';
import { StickyDownloadBar } from '@/components/landing/StickyDownloadBar';
import { Footer } from '@/components/landing/Footer';

const Index = () => {
  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      <HeroSection />
      <FeaturesSection />
      <SocialProofSection />
      <CTASection />
      <Footer />
      {/* <StickyDownloadBar /> */}
    </main>
  );
};

export default Index;
