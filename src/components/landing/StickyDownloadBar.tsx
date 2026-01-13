import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Apple, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export function StickyDownloadBar() {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.1], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 0.1], [100, 0]);
  const [isDismissed, setIsDismissed] = useState(false);
  const [tapStates, setTapStates] = useState({ ios: false, android: false });

  // Reset dismissed state when user scrolls back to top
  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (value) => {
      if (value < 0.05 && isDismissed) {
        setIsDismissed(false);
      }
    });
    return unsubscribe;
  }, [scrollYProgress, isDismissed]);

  const handleTapStart = (button: 'ios' | 'android') => {
    setTapStates(prev => ({ ...prev, [button]: true }));
  };

  const handleTapEnd = (button: 'ios' | 'android') => {
    setTapStates(prev => ({ ...prev, [button]: false }));
  };

  return (
    <AnimatePresence>
      {!isDismissed && (
        <motion.div
          style={{ opacity, y }}
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background/90 backdrop-blur-xl border-t border-border md:hidden safe-area-inset-bottom"
        >
          {/* Dismiss button */}
          <motion.button
            onClick={() => setIsDismissed(true)}
            whileTap={{ scale: 0.9 }}
            className="absolute -top-10 right-4 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm border border-border flex items-center justify-center touch-manipulation"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </motion.button>
          
          <div className="flex gap-3">
            {/* iOS Button with enhanced tap feedback */}
            <motion.a
              href="#"
              onTouchStart={() => handleTapStart('ios')}
              onTouchEnd={() => handleTapEnd('ios')}
              onTouchCancel={() => handleTapEnd('ios')}
              whileTap={{ scale: 0.96 }}
              className="flex-1 relative inline-flex items-center justify-center gap-2 px-4 py-4 bg-foreground text-background rounded-2xl font-medium overflow-hidden touch-manipulation min-h-[56px]"
            >
              {/* Tap ripple effect */}
              <motion.div
                className="absolute inset-0 bg-white/20"
                initial={{ opacity: 0 }}
                animate={{ opacity: tapStates.ios ? 1 : 0 }}
                transition={{ duration: 0.1 }}
              />
              
              {/* Continuous subtle glow */}
              <motion.div
                className="absolute inset-0"
                style={{
                  background: 'radial-gradient(circle at 50% 100%, hsl(var(--primary) / 0.2), transparent 60%)',
                }}
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              
              <motion.div
                whileTap={{ scale: 0.85, rotate: -10 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
              >
                <Apple className="w-5 h-5 relative z-10" />
              </motion.div>
              <span className="relative z-10 font-semibold">App Store</span>
            </motion.a>
            
            {/* Android Button with enhanced tap feedback */}
            <motion.a
              href="#"
              onTouchStart={() => handleTapStart('android')}
              onTouchEnd={() => handleTapEnd('android')}
              onTouchCancel={() => handleTapEnd('android')}
              whileTap={{ scale: 0.96 }}
              className="flex-1 relative inline-flex items-center justify-center gap-2 px-4 py-4 bg-foreground text-background rounded-2xl font-medium overflow-hidden touch-manipulation min-h-[56px]"
            >
              {/* Tap ripple effect */}
              <motion.div
                className="absolute inset-0 bg-white/20"
                initial={{ opacity: 0 }}
                animate={{ opacity: tapStates.android ? 1 : 0 }}
                transition={{ duration: 0.1 }}
              />
              
              {/* Continuous subtle glow */}
              <motion.div
                className="absolute inset-0"
                style={{
                  background: 'radial-gradient(circle at 50% 100%, hsl(var(--sage) / 0.2), transparent 60%)',
                }}
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              />
              
              <motion.div
                whileTap={{ scale: 0.85, rotate: 10 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
              >
                <svg className="w-5 h-5 relative z-10" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z" />
                </svg>
              </motion.div>
              <span className="relative z-10 font-semibold">Play Store</span>
            </motion.a>
          </div>
          
          {/* Swipe up indicator */}
          <motion.div
            className="flex justify-center mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <motion.div
              className="w-10 h-1 rounded-full bg-muted-foreground/30"
              animate={{ scaleX: [1, 0.8, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
