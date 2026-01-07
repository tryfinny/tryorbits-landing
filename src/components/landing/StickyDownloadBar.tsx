import { motion, useScroll, useTransform } from 'framer-motion';
import { Apple } from 'lucide-react';

export function StickyDownloadBar() {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <motion.div
      style={{ opacity }}
      className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background/80 backdrop-blur-lg border-t border-border md:hidden"
    >
      <div className="flex gap-3">
        <motion.a
          href="#"
          whileTap={{ scale: 0.98 }}
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-foreground text-background rounded-2xl font-medium"
        >
          <Apple className="w-5 h-5" />
          <span>App Store</span>
        </motion.a>
        <motion.a
          href="#"
          whileTap={{ scale: 0.98 }}
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-foreground text-background rounded-2xl font-medium"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z" />
          </svg>
          <span>Play Store</span>
        </motion.a>
      </div>
    </motion.div>
  );
}
