import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
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
          exit={{ y: 100 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-[#F9F3E9]/95 backdrop-blur-xl border-t border-[#e5ddd0] md:hidden safe-area-inset-bottom"
        >
          {/* Dismiss button */}
          <motion.button
            onClick={() => setIsDismissed(true)}
            whileTap={{ scale: 0.9 }}
            className="absolute -top-10 right-4 w-8 h-8 rounded-full bg-[#F9F3E9]/90 backdrop-blur-sm border border-[#e5ddd0] flex items-center justify-center touch-manipulation"
          >
            <X className="w-4 h-4 text-[#6b6b6b]" />
          </motion.button>
          
          <div className="flex gap-3">
            {/* iOS Button with enhanced tap feedback */}
            <motion.a
              href="#"
              onTouchStart={() => handleTapStart('ios')}
              onTouchEnd={() => handleTapEnd('ios')}
              onTouchCancel={() => handleTapEnd('ios')}
              whileTap={{ scale: 0.96 }}
              className="flex-1 relative inline-flex items-center justify-center gap-2 px-4 py-4 bg-[#1a1a1a] text-white rounded-2xl font-medium overflow-hidden touch-manipulation min-h-[56px]"
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
                  opacity: [0.4, 0.6, 0.5],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              
              <motion.div
                whileTap={{ scale: 0.85, rotate: -10 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
              >
                <svg className="w-5 h-5 relative z-10" viewBox="0 0 800 800" fill="currentColor">
                  <path d="M396.6,183.8l16.2-28c10-17.5,32.3-23.4,49.8-13.4s23.4,32.3,13.4,49.8L319.9,462.4h112.9c36.6,0,57.1,43,41.2,72.8H143c-20.2,0-36.4-16.2-36.4-36.4c0-20.2,16.2-36.4,36.4-36.4h92.8l118.8-205.9l-37.1-64.4c-10-17.5-4.1-39.6,13.4-49.8c17.5-10,39.6-4.1,49.8,13.4L396.6,183.8L396.6,183.8z M256.2,572.7l-35,60.7c-10,17.5-32.3,23.4-49.8,13.4S148,614.5,158,597l26-45C213.4,542.9,237.3,549.9,256.2,572.7L256.2,572.7z M557.6,462.6h94.7c20.2,0,36.4,16.2,36.4,36.4c0,20.2-16.2,36.4-36.4,36.4h-52.6l35.5,61.6c10,17.5,4.1,39.6-13.4,49.8c-17.5,10-39.6,4.1-49.8-13.4c-59.8-103.7-104.7-181.3-134.5-233c-30.5-52.6-8.7-105.4,12.8-123.3C474.2,318.1,509.9,380,557.6,462.6L557.6,462.6z"/>
                </svg>
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
              className="flex-1 relative inline-flex items-center justify-center gap-2 px-4 py-4 bg-[#1a1a1a] text-white rounded-2xl font-medium overflow-hidden touch-manipulation min-h-[56px]"
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
                  opacity: [0.4, 0.6, 0.5],
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
              className="w-10 h-1 rounded-full bg-[#1a1a1a]/20"
              animate={{ scaleX: [1, 0.8, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
