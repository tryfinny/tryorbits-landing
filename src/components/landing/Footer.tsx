import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import orbitsLogo from '@/assets/orbits-logo.png';

export function Footer() {
  return (
    <footer className="py-12 pb-32 md:pb-12 px-6 border-t border-border">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo/Brand */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-2"
          >
            <img src={orbitsLogo} alt="Orbits logo" className="w-8 h-8 object-contain aspect-square rounded-lg" />
            <span className="font-semibold text-lg">Orbits</span>
          </motion.div>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
          </div>

          {/* Copyright */}
          <p className="text-sm text-muted-foreground">
            © 2026 Orbits. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
