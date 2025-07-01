import { PersistentLayout } from "@/components/persistent-layout";

export default function TermsOfService() {
  return (
    <PersistentLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl text-white mb-2 uppercase" style={{ fontFamily: 'Oswald, sans-serif', fontWeight: '600', letterSpacing: '-0.02em' }}>
            TERMS OF SERVICE
          </h1>
          <p className="text-gray-400">Your agreement to use Thoughtmarks</p>
        </div>

        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-[#C6D600]">Terms of Service</h2>
            <p className="text-sm text-gray-400">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          <section className="space-y-4">
            <h3 className="text-lg font-medium">1. Acceptance of Terms</h3>
            <div className="space-y-3 text-gray-300">
              <p>By accessing and using Thoughtmarks, you accept and agree to be bound by the terms and provision of this agreement.</p>
              <p>If you do not agree to abide by the above, please do not use this service.</p>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-medium">2. Service Description</h3>
            <div className="space-y-3 text-gray-300">
              <p>Thoughtmarks is a personal knowledge management platform that allows users to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Capture and organize thoughts, ideas, and notes</li>
                <li>Use AI-powered categorization and search features</li>
                <li>Access content across multiple devices</li>
                <li>Utilize voice-to-text functionality</li>
                <li>Collaborate and share selected content</li>
              </ul>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-medium">3. User Accounts</h3>
            <div className="space-y-3 text-gray-300">
              <p><strong>Account Creation:</strong> You must provide accurate and complete information when creating an account.</p>
              <p><strong>Account Security:</strong> You are responsible for safeguarding your account credentials and all activities under your account.</p>
              <p><strong>Account Termination:</strong> We reserve the right to terminate accounts that violate these terms or engage in harmful activities.</p>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-medium">4. Acceptable Use</h3>
            <div className="space-y-3 text-gray-300">
              <p>You agree not to use Thoughtmarks to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Store or share illegal, harmful, or offensive content</li>
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe on intellectual property rights</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Distribute malware or engage in spam activities</li>
                <li>Harass or abuse other users</li>
              </ul>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-medium">5. Content Ownership</h3>
            <div className="space-y-3 text-gray-300">
              <p><strong>Your Content:</strong> You retain full ownership of all content you create in Thoughtmarks.</p>
              <p><strong>License to Us:</strong> You grant us a limited license to store, process, and display your content to provide the service.</p>
              <p><strong>Our Platform:</strong> Thoughtmarks retains all rights to the software, algorithms, and platform technology.</p>
              <p><strong>User-Generated Content:</strong> We do not claim ownership of your thoughts, ideas, or notes.</p>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-medium">6. Privacy and Data Protection</h3>
            <div className="space-y-3 text-gray-300">
              <p>Your privacy is important to us. Our data practices are detailed in our Privacy Policy.</p>
              <p>We implement industry-standard security measures to protect your data.</p>
              <p>You can export or delete your data at any time through your account settings.</p>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-medium">7. Subscription and Payment</h3>
            <div className="space-y-3 text-gray-300">
              <p><strong>Free Tier:</strong> Basic features are available at no cost with usage limitations.</p>
              <p><strong>Premium Features:</strong> Advanced features require a paid subscription.</p>
              <p><strong>Billing:</strong> Subscriptions are billed in advance on a recurring basis.</p>
              <p><strong>Cancellation:</strong> You may cancel your subscription at any time through account settings.</p>
              <p><strong>Refunds:</strong> Refunds are handled on a case-by-case basis according to our refund policy.</p>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-medium">8. Service Availability</h3>
            <div className="space-y-3 text-gray-300">
              <p><strong>Uptime:</strong> We strive for 99.9% service availability but cannot guarantee uninterrupted access.</p>
              <p><strong>Maintenance:</strong> Planned maintenance will be announced in advance when possible.</p>
              <p><strong>Support:</strong> Technical support is provided for paid subscribers with priority handling.</p>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-medium">9. Limitation of Liability</h3>
            <div className="space-y-3 text-gray-300">
              <p><strong>Service Provision:</strong> Thoughtmarks is provided "as is" without warranties of any kind.</p>
              <p><strong>Damage Limitations:</strong> Our liability is limited to the amount paid for the service in the past 12 months.</p>
              <p><strong>Data Loss:</strong> While we maintain backups, users are responsible for their own data protection practices.</p>
              <p><strong>Third-Party Services:</strong> We are not liable for issues with integrated third-party services.</p>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-medium">10. Dispute Resolution</h3>
            <div className="space-y-3 text-gray-300">
              <p><strong>Initial Contact:</strong> Contact support@thoughtmarks.app for any disputes or concerns.</p>
              <p><strong>Resolution Timeline:</strong> We commit to responding within 48 hours and resolving issues within 7 business days.</p>
              <p><strong>Arbitration:</strong> Unresolved disputes may be subject to binding arbitration.</p>
              <p><strong>Governing Law:</strong> These terms are governed by applicable local and international laws.</p>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-medium">11. Changes to Terms</h3>
            <div className="space-y-3 text-gray-300">
              <p>We reserve the right to modify these terms at any time.</p>
              <p>Users will be notified of significant changes at least 30 days in advance.</p>
              <p>Continued use of the service after changes constitutes acceptance of the new terms.</p>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-medium">12. Contact Information</h3>
            <div className="space-y-3 text-gray-300">
              <p>For questions about these terms, contact us at:</p>
              <p><strong>Email:</strong> legal@thoughtmarks.app</p>
              <p><strong>Support:</strong> support@thoughtmarks.app</p>
            </div>
          </section>

          <div className="mt-12 pt-8 border-t border-gray-700">
            <p className="text-sm text-gray-500 text-center">
              These terms are designed to be fair and transparent. 
              We believe in building trust through clear communication and ethical practices.
            </p>
          </div>
        </div>
      </div>
    </PersistentLayout>
  );
}