import { useEffect, useRef, useMemo } from 'react';
import { Sparkles } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useDeviceType } from '@/hooks/use-device-type';
import { DualStoreButtons } from '@/components/landing/AppStoreButtons';
import {
  trackInstallPageVisit,
  trackQrCodeClick,
  trackAppStoreClick,
  getOneLinkUrl,
} from '@/lib/analytics';

const GA_MEASUREMENT_ID = 'G-998792GX0C';

const Install = () => {
  const deviceType = useDeviceType();
  const hasTracked = useRef(false);

  const isDesktop = deviceType === 'other';

  // Build OneLink URL with UTM params (captures any params from landing page)
  const oneLinkUrl = useMemo(
    () => getOneLinkUrl({ af_sub4: 'install_page_redirect' }),
    []
  );

  // OneLink URLs for QR code click areas
  const iosOneLinkUrl = useMemo(
    () => getOneLinkUrl({ af_sub4: 'install_page', af_sub5: 'ios_qr' }),
    []
  );

  const androidOneLinkUrl = useMemo(
    () => getOneLinkUrl({ af_sub4: 'install_page', af_sub5: 'android_qr' }),
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

    // Track with Amplitude
    trackInstallPageVisit(deviceType, willRedirect, redirectDestination);

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
      <div className='min-h-screen bg-background flex items-center justify-center px-6'>
        <div className='text-center max-w-md space-y-4'>
          <h1 className='text-2xl font-serif font-normal'>Redirecting...</h1>
          <p className='text-muted-foreground'>
            We&apos;re sending you to the right place for your device.
          </p>
          <a
            href={oneLinkUrl}
            className='text-primary underline hover:text-primary/90'
          >
            Continue
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
          <div className='mt-10 grid gap-6 sm:gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)_minmax(0,1fr)] lg:items-center'>
            <a
              href={iosOneLinkUrl}
              className='group glass border border-primary/10 rounded-2xl px-4 py-5 sm:px-5 sm:py-6 card-shadow-hover transition-transform duration-300 hover:-translate-y-1'
              aria-label='Download Orbits on the App Store'
              onClick={() => {
                trackQrCodeClick('app_store');
                trackAppStoreClick('app_store', 'install_page_qr');
              }}
            >
              <p className='text-sm font-medium text-muted-foreground'>iOS</p>
              <p className='mt-1 text-lg font-medium text-foreground'>
                App Store
              </p>
              <div className='mt-4 flex items-center justify-center'>
                <div className='bg-white p-3 rounded-xl'>
                  <QRCodeSVG
                    value={iosOneLinkUrl}
                    size={180}
                    level='M'
                    marginSize={0}
                  />
                </div>
              </div>
            </a>

            <div className='flex flex-col items-center justify-center gap-4 text-lg sm:text-xl text-muted-foreground'>
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

            <a
              href={androidOneLinkUrl}
              className='group glass border border-primary/10 rounded-2xl px-4 py-5 sm:px-5 sm:py-6 card-shadow-hover transition-transform duration-300 hover:-translate-y-1'
              aria-label='Download Orbits on Google Play'
              onClick={() => {
                trackQrCodeClick('play_store');
                trackAppStoreClick('play_store', 'install_page_qr');
              }}
            >
              <p className='text-sm font-medium text-muted-foreground'>
                Android
              </p>
              <p className='mt-1 text-lg font-medium text-foreground'>
                Google Play
              </p>
              <div className='mt-4 flex items-center justify-center'>
                <div className='bg-white p-3 rounded-xl'>
                  <QRCodeSVG
                    value={androidOneLinkUrl}
                    size={180}
                    level='M'
                    marginSize={0}
                  />
                </div>
              </div>
            </a>
          </div>
          <div className='mt-8'>
            <p className='text-sm text-muted-foreground mb-4'>
              Prefer clicking? Download directly:
            </p>
            <div className='flex justify-center'>
              <DualStoreButtons />
            </div>
            <p className='mt-5 text-xs text-muted-foreground'>
              Join 2,400+ early adopters building calmer homes.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Install;
