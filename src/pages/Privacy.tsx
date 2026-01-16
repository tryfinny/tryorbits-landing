import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 md:bg-background/80 md:backdrop-blur-xl border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-12 lg:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl lg:text-4xl font-bold mb-8 font-sans">Privacy Policy</h1>
          
          <div className="prose prose-lg max-w-none text-foreground/90 space-y-8">
            <section>
              <h2 className="text-xl font-semibold mb-3 font-sans">1. Information We Collect</h2>
              <p className="text-muted-foreground leading-relaxed">
                We collect personal information that you provide when using Orbits, such as your name, email address, and payment details (for subscriptions). We may also collect usage data, device information, and communications you have with us (for example, when you contact support or submit feedback).
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 font-sans">2. How We Use Your Information</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                We use your information to:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Provide, maintain, and improve the Orbits app and its features</li>
                <li>Process payments and manage subscriptions</li>
                <li>Communicate with you about updates, support, and account-related matters</li>
                <li>Personalize your experience and deliver relevant features</li>
                <li>Comply with legal and regulatory obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 font-sans">3. Subscription and Payment Data</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you purchase a subscription, payment details are collected and processed securely through third-party payment providers. Nemus AI, Inc. does not store your full payment information. We only retain limited transaction data (e.g., payment status, amount, and subscription term) to manage your account and billing history.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 font-sans">4. Data Sharing</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                We do not sell your personal information. We only share data with trusted service providers who assist in:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Operating and maintaining the Orbits app</li>
                <li>Processing payments</li>
                <li>Providing analytics or cloud infrastructure</li>
                <li>Complying with legal requests when required</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-3">
                All third parties are required to handle your data securely and only for the purposes specified by Nemus AI, Inc.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 font-sans">5. Security</h2>
              <p className="text-muted-foreground leading-relaxed">
                We implement industry-standard administrative, technical, and physical safeguards to protect your information against unauthorized access, loss, misuse, or disclosure. However, no online service can guarantee absolute security, and you use Orbits at your own risk.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 font-sans">6. Your Rights</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Depending on your location, you may have the right to:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Access, correct, or delete your personal data</li>
                <li>Withdraw consent for data processing (where applicable)</li>
                <li>Request a copy of your data in a portable format</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-3">
                To exercise these rights, contact us at{' '}
                <a href="mailto:contact@tryorbits.com" className="text-primary hover:underline">
                  contact@tryorbits.com
                </a>. We will respond to all requests in accordance with applicable laws.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 font-sans">7. Data Retention</h2>
              <p className="text-muted-foreground leading-relaxed">
                We retain your personal data only as long as necessary to provide Orbits' services, comply with legal obligations, or resolve disputes. When your data is no longer needed, we securely delete or anonymize it.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 font-sans">8. Changes to This Privacy Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this Privacy Policy periodically. If material changes are made, we will notify you by posting the updated version within the Orbits app or through other appropriate channels. Continued use of Orbits after such updates means you accept the revised policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 font-sans">9. Account Deletion</h2>
              <p className="text-muted-foreground leading-relaxed">
                To delete your account, please contact us at{' '}
                <a href="mailto:contact@tryorbits.com" className="text-primary hover:underline">
                  contact@tryorbits.com
                </a>.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 font-sans">10. Contact Information</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have questions, concerns, or requests about this Privacy Policy, please contact us at:
              </p>
              <p className="text-muted-foreground leading-relaxed mt-3">
                <strong className="text-foreground">Nemus AI, Inc.</strong><br />
                Email:{' '}
                <a href="mailto:contact@tryorbits.com" className="text-primary hover:underline">
                  contact@tryorbits.com
                </a>
              </p>
            </section>
          </div>
        </motion.div>
      </main>

      {/* Simple Footer */}
      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-4xl mx-auto text-center text-sm text-muted-foreground">
          © 2026 Orbits. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
