import { motion } from 'framer-motion';

export function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-border">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo/Brand */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-accent" />
            <span className="font-semibold text-lg">AppName</span>
          </motion.div>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-foreground transition-colors">Contact</a>
            <a href="#" className="hover:text-foreground transition-colors">Support</a>
          </div>

          {/* Copyright */}
          <p className="text-sm text-muted-foreground">
            © 2024 AppName. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
