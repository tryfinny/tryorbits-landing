import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Terms() {
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
          <h1 className="text-3xl lg:text-4xl font-bold mb-8 font-sans">Terms of Service</h1>
          
          <div className="prose prose-lg max-w-none text-foreground/90 space-y-8">
            <section>
              <h2 className="text-xl font-semibold mb-3 font-sans">1. Introduction</h2>
              <p className="text-muted-foreground leading-relaxed">
                Welcome to Orbits ("the App"). These Terms of Service ("Terms") govern your use of the Orbits mobile and web application, provided by Nemus AI, Inc. ("Company," "we," "us," or "our"). By accessing or using the App, you agree to be bound by these Terms. If you do not agree, please do not use the App.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 font-sans">2. Eligibility</h2>
              <p className="text-muted-foreground leading-relaxed">
                You must be at least 18 years old (or the legal age in your jurisdiction) to use the App. By using Orbits, you represent and warrant that you meet this requirement.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 font-sans">3. Account Registration</h2>
              <p className="text-muted-foreground leading-relaxed">
                Certain features of Orbits require you to create an account. You agree to provide accurate and complete information during registration and to keep it updated. You are responsible for maintaining the confidentiality of your account credentials and for all activity under your account.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 font-sans">4. Paid Subscription</h2>
              <p className="text-muted-foreground leading-relaxed">
                Orbits offers paid subscription plans that unlock premium features. Subscriptions may include a free trial period, as specified at the time of sign-up. By subscribing, you agree to pay the applicable fees once the trial period ends.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-3">
                All subscription payments are non-refundable except where required by law. You may cancel your subscription at any time through your account settings, but premium access will remain active until the end of the current billing cycle or trial period.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 font-sans">5. Acceptable Use</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                You agree to use Orbits in compliance with all applicable laws and regulations. You must not:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Use the App for any unlawful or fraudulent purpose</li>
                <li>Distribute malware or harmful code</li>
                <li>Attempt to gain unauthorized access to Orbits, other users' data, or our systems</li>
                <li>Interfere with or disrupt the App's functionality or services</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 font-sans">6. Privacy</h2>
              <p className="text-muted-foreground leading-relaxed">
                Your use of Orbits is subject to our Privacy Policy, which describes how we collect, use, and protect your data. By using the App, you agree to the practices outlined in that policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 font-sans">7. Termination</h2>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to suspend or terminate your access to Orbits at our discretion, without prior notice, if you violate these Terms. You may also stop using the App at any time.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 font-sans">8. Disclaimer of Warranties</h2>
              <p className="text-muted-foreground leading-relaxed">
                Orbits is provided on an "as is" and "as available" basis, without warranties of any kind, express or implied. We do not guarantee that the App will be error-free, uninterrupted, or secure.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 font-sans">9. Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed">
                To the fullest extent permitted by law, Nemus AI, Inc. and its affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from or relating to your use of Orbits.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 font-sans">10. Changes to These Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update these Terms from time to time. If we make material changes, we will notify you by posting the updated Terms within the App or through other appropriate means. Continued use of Orbits after such updates constitutes your acceptance of the revised Terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 font-sans">11. Governing Law</h2>
              <p className="text-muted-foreground leading-relaxed">
                These Terms are governed by and construed in accordance with the laws of Canada or the United States (depending on your country of residence), without regard to conflict-of-law principles.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 font-sans">12. Contact Information</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about these Terms, please contact us at{' '}
                <a href="mailto:contact@tryorbits.com" className="text-primary hover:underline">
                  contact@tryorbits.com
                </a>.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 font-sans">13. Sweepstakes and Promotions</h2>
              <p className="text-muted-foreground leading-relaxed">
                From time to time, Orbits or Nemus AI, Inc. may offer sweepstakes or promotional giveaways. No purchase is necessary to enter. You may enter by emailing{' '}
                <a href="mailto:contact@tryorbits.com" className="text-primary hover:underline">
                  contact@tryorbits.com
                </a>{' '}
                with the subject line "Sweepstakes Entry." Each promotion will have its own specific rules and eligibility requirements, which you should review before participating.
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
