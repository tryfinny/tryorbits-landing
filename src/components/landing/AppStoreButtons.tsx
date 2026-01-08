import { motion } from 'framer-motion';
import { Apple } from 'lucide-react';

export function AppStoreButtons() {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
      {/* App Store Button */}
      <motion.a
        href="#"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        transition={{ duration: 0.15 }}
        className="inline-flex items-center gap-3 px-6 py-3 bg-foreground text-background rounded-2xl transition-shadow duration-150 hover:shadow-lg group"
      >
        <Apple className="w-7 h-7" />
        <div className="text-left">
          <p className="text-xs opacity-80">Download on the</p>
          <p className="text-base font-semibold -mt-0.5">App Store</p>
        </div>
      </motion.a>

      {/* Google Play Button */}
      <motion.a
        href="#"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        transition={{ duration: 0.15 }}
        className="inline-flex items-center gap-3 px-6 py-3 bg-foreground text-background rounded-2xl transition-shadow duration-150 hover:shadow-lg group"
      >
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z" />
        </svg>
        <div className="text-left">
          <p className="text-xs opacity-80">Get it on</p>
          <p className="text-base font-semibold -mt-0.5">Google Play</p>
        </div>
      </motion.a>
    </div>
  );
}
