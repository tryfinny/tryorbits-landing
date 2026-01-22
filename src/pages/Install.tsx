import { useEffect } from "react";
import { useDeviceType } from "@/hooks/use-device-type";

const APP_STORE_URL = "https://apps.apple.com/us/app/orbits-ai-family-assistant/id6751995632";
const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.orbits";

const Install = () => {
  const deviceType = useDeviceType();

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const targetUrl =
      deviceType === "android" ? PLAY_STORE_URL : deviceType === "ios" ? APP_STORE_URL : "/";

    window.location.replace(targetUrl);
  }, [deviceType]);

  const fallbackUrl =
    deviceType === "android" ? PLAY_STORE_URL : deviceType === "ios" ? APP_STORE_URL : "/";

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="text-center max-w-md space-y-4">
        <h1 className="text-2xl font-semibold">Redirecting...</h1>
        <p className="text-muted-foreground">
          We&apos;re sending you to the right place for your device.
        </p>
        <a href={fallbackUrl} className="text-primary underline hover:text-primary/90">
          Continue
        </a>
      </div>
    </div>
  );
};

export default Install;
