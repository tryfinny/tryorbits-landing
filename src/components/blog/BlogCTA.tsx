import { AppStoreButtons } from '@/components/landing/AppStoreButtons';

export function BlogCTA() {
  return (
    <div className="mt-16 pt-10 border-t border-border">
      <div className="rounded-2xl border border-border/40 bg-secondary/30 px-8 py-10 text-center">
        <p className="text-xs uppercase tracking-widest text-primary font-medium mb-3">
          Try Orbits free
        </p>
        <h2 className="text-2xl lg:text-3xl font-serif font-medium tracking-tight mb-3">
          Your household, finally under control
        </h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          One app for your family calendar, grocery lists, home maintenance, and more.
        </p>
        <div className="flex justify-center">
          <AppStoreButtons location="blog_cta" />
        </div>
      </div>
    </div>
  );
}
