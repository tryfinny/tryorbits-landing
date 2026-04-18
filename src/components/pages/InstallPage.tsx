import { useEffect, useRef, useMemo } from 'react';
import { Sparkles } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useDeviceType } from '@/hooks/use-device-type';
import { AppStoreButtons } from '@/components/landing/AppStoreButtons';
import {
  trackInstallPageVisit,
  trackQrCodeClick,
  getOneLinkUrl,
  getUtmParams,
  setAttributionCookie,
} from '@/lib/analytics';

const GA_MEASUREMENT_ID = 'G-998792GX0C';

const Install = () => {
  const deviceType = useDeviceType();
  const hasTracked = useRef(false);

  const isDesktop = deviceType === 'other';

  // Single OneLink URL - AppsFlyer auto-detects device and redirects to correct store
  const oneLinkUrl = useMemo(
    () => getOneLinkUrl({ af_sub4: 'install_page' }),
    []
  );

  useEffect(() => {
    if (typeof window === 'undefined' || hasTracked.current) {
      return;
    }

    // Track the install page visit event
    const willRedirect =
      !isDesktop && (deviceType === 'android' || deviceType === 'ios');
    const redirectDestination = willRedirect
      ? deviceType === 'android'
        ? 'play_store'
        : 'app_store'
      : null;

    hasTracked.current = true;

    // Get UTM params and store attribution cookie
    const utmParams = getUtmParams();
    setAttributionCookie(utmParams);

    // Track with Amplitude (now includes UTM params)
    trackInstallPageVisit(deviceType, willRedirect, redirectDestination, utmParams);

    // Use beacon transport to ensure event is sent even on redirect (GA)
    gtag('event', 'install_page_visit', {
      event_category: 'navigation',
      event_label: deviceType,
      device_type: deviceType,
      will_redirect: willRedirect,
      redirect_destination: redirectDestination ?? 'none',
      send_to: GA_MEASUREMENT_ID,
      transport_type: 'beacon',
      event_callback: () => {
        // Redirect after event is tracked (for mobile devices) - use OneLink for attribution
        if (willRedirect) {
          window.location.replace(oneLinkUrl);
        }
      },
    });

    // Fallback redirect in case callback doesn't fire within 1 second
    if (willRedirect) {
      const fallbackTimer = setTimeout(() => {
        window.location.replace(oneLinkUrl);
      }, 1000);

      return () => clearTimeout(fallbackTimer);
    }
  }, [deviceType, isDesktop, oneLinkUrl]);

  if (!isDesktop) {
    return (
      <div className='min-h-screen flex items-center justify-center px-6'
           style={{ backgroundColor: '#071b24' }}>
        <div className='text-center max-w-md space-y-6'>
          <div className='flex justify-center'>
            <div className='w-10 h-10 border-4 border-t-transparent rounded-full animate-spin'
                 style={{ borderColor: '#b4e0cb', borderTopColor: 'transparent' }} />
          </div>
          <h1 className='text-2xl font-sans font-medium text-white'>
            Taking you to the App Store...
          </h1>
          <a href={oneLinkUrl} className='text-sm underline hover:opacity-80'
             style={{ color: '#b4e0cb' }}>
            Tap here if nothing happens
          </a>
        </div>
      </div>
    );
  }

  return (
    <main className='relative min-h-screen bg-background overflow-hidden px-6 py-16 sm:py-20 flex items-center'>
      <div className='absolute inset-0 bg-gradient-to-b from-background via-background to-secondary/50' />
      <div className='absolute top-10 left-[5%] w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] orb-lavender opacity-30 sm:opacity-40 blur-3xl rounded-full' />
      <div className='absolute top-40 right-[10%] w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] orb-peach opacity-25 sm:opacity-30 blur-3xl rounded-full' />
      <div className='absolute bottom-20 left-[20%] w-[350px] sm:w-[600px] h-[350px] sm:h-[600px] orb-sky opacity-20 sm:opacity-25 blur-3xl rounded-full' />
      <div
        className='absolute inset-0 opacity-[0.015]'
        style={{
          backgroundImage: `
              linear-gradient(hsl(var(--primary)) 1px, transparent 1px),
              linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)
            `,
          backgroundSize: '50px 50px',
        }}
      />

      <div className='relative z-10 w-full max-w-5xl mx-auto'>
        <div className='glass border border-primary/10 rounded-3xl px-6 py-10 sm:px-10 sm:py-12 text-center card-shadow'>
          <div className='inline-flex items-center gap-2 px-4 py-2 glass rounded-full border border-primary/10 mb-6'>
            <Sparkles className='w-4 h-4 text-golden' />
            <span className='text-xs sm:text-sm font-medium text-foreground/80'>
              Free to download
            </span>
          </div>
          <h1 className='text-3xl sm:text-4xl lg:text-5xl font-serif font-medium tracking-[-0.01em]'>
            Download Orbits today.
          </h1>
          <p className='mt-2 text-muted-foreground text-sm sm:text-base'>
            Scan the QR code with your phone to download the app.
          </p>

          {/* Single QR Code */}
          <div className='mt-10 flex justify-center'>
            <a
              href={oneLinkUrl}
              className='group glass border border-primary/10 rounded-2xl px-6 py-6 sm:px-8 sm:py-8 card-shadow-hover transition-transform duration-300 hover:-translate-y-1'
              aria-label='Download Orbits'
              onClick={() => trackQrCodeClick('qr_code')}
            >
              <div className='flex items-center justify-center'>
                <div className='bg-white p-4 rounded-xl'>
                  <QRCodeSVG
                    value={oneLinkUrl}
                    size={200}
                    level='M'
                    marginSize={0}
                  />
                </div>
              </div>
              <div className='mt-4 flex items-center justify-center gap-4 text-muted-foreground'>
                {/* Apple App Store Icon */}
                <svg
                  className='w-20 h-20'
                  viewBox='0 0 800 800'
                  fill='currentColor'
                >
                  <path d='M396.6,183.8l16.2-28c10-17.5,32.3-23.4,49.8-13.4s23.4,32.3,13.4,49.8L319.9,462.4h112.9c36.6,0,57.1,43,41.2,72.8H143c-20.2,0-36.4-16.2-36.4-36.4c0-20.2,16.2-36.4,36.4-36.4h92.8l118.8-205.9l-37.1-64.4c-10-17.5-4.1-39.6,13.4-49.8c17.5-10,39.6-4.1,49.8,13.4L396.6,183.8L396.6,183.8z M256.2,572.7l-35,60.7c-10,17.5-32.3,23.4-49.8,13.4S148,614.5,158,597l26-45C213.4,542.9,237.3,549.9,256.2,572.7L256.2,572.7z M557.6,462.6h94.7c20.2,0,36.4,16.2,36.4,36.4c0,20.2-16.2,36.4-36.4,36.4h-52.6l35.5,61.6c10,17.5,4.1,39.6-13.4,49.8c-17.5,10-39.6,4.1-49.8-13.4c-59.8-103.7-104.7-181.3-134.5-233c-30.5-52.6-8.7-105.4,12.8-123.3C474.2,318.1,509.9,380,557.6,462.6L557.6,462.6z' />
                </svg>
                {/* Google Play Icon */}
                <svg
                  className='w-[4.5rem] h-[4.5rem]'
                  viewBox='0 0 24 24'
                  fill='currentColor'
                >
                  <path d='M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z' />
                </svg>
              </div>
            </a>
          </div>

          {/* Features */}
          <div className='mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-base sm:text-lg text-muted-foreground'>
            <span className='flex items-center gap-2'>
              <span className='h-2 w-2 rounded-full bg-lavender' />
              Grocery lists and reminders
            </span>
            <span className='flex items-center gap-2'>
              <span className='h-2 w-2 rounded-full bg-peach' />
              Family calendars in sync
            </span>
            <span className='flex items-center gap-2'>
              <span className='h-2 w-2 rounded-full bg-sky' />
              Save hours every week
            </span>
          </div>

          {/* CTA Button */}
          <div className='mt-8'>
            <p className='text-sm text-muted-foreground mb-4'>
              Or click to download directly:
            </p>
            <div className='flex justify-center'>
              <AppStoreButtons location='install_page' />
            </div>
          </div>

          <p className='mt-6 text-xs text-muted-foreground'>
            Join 2,400+ early adopters building calmer homes.
          </p>
        </div>
      </div>
    </main>
  );
};

export default Install;
