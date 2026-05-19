import { motion } from 'framer-motion';

export function Footer() {
  return (
    <footer className="py-12 pb-32 md:pb-12 px-6 border-t border-border">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo/Brand */}
          <motion.a
            href="/"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="hover:opacity-80 transition-opacity inline-flex items-center gap-1 leading-none"
          >
            <img
              src="/bit-planet-peek.gif"
              alt=""
              aria-hidden="true"
              className="h-16 w-auto shrink-0 block"
            />
            <span className="font-sans font-bold text-4xl tracking-tight text-foreground leading-none mt-3">
              Orbits
            </span>
          </motion.a>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <a href="/about" className="hover:text-foreground transition-colors">About</a>
            <a href="/blog" className="hover:text-foreground transition-colors">Blog</a>
            <a href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="/tos" className="hover:text-foreground transition-colors">Terms of Service</a>
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
