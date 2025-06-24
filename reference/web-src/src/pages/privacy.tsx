import { PersistentLayout } from "@/components/persistent-layout";

export default function Privacy() {
  return (
    <PersistentLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl text-white mb-2 uppercase" style={{ fontFamily: 'Oswald, sans-serif', fontWeight: '600', letterSpacing: '-0.02em' }}>
            PRIVACY POLICY
          </h1>
          <p className="text-gray-400">How we protect and handle your data</p>
        </div>

        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-[#C6D600]">Privacy Policy</h2>
            <p className="text-sm text-gray-400">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          <section className="space-y-4">
            <h3 className="text-lg font-medium">What We Collect</h3>
            <div className="space-y-3 text-gray-300">
              <p><strong>Account Information:</strong> Your email address and display name when you create an account.</p>
              <p><strong>Thoughtmarks Content:</strong> The thoughts, ideas, and notes you save in the app.</p>
              <p><strong>Usage Data:</strong> How you interact with the app to improve performance and user experience.</p>
              <p><strong>Device Information:</strong> Basic device and browser information for compatibility and security.</p>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-medium">How We Use Your Data</h3>
            <div className="space-y-3 text-gray-300">
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>To provide and maintain the Thoughtmarks service</li>
                <li>To sync your data across devices when you're signed in</li>
                <li>To improve our AI categorization and search features</li>
                <li>To send important updates about your account or the service</li>
                <li>To provide customer support when requested</li>
              </ul>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-medium">Data Security</h3>
            <div className="space-y-3 text-gray-300">
              <p><strong>Encryption:</strong> All data is encrypted in transit and at rest using industry-standard protocols.</p>
              <p><strong>Access Control:</strong> Only authorized personnel can access user data, and only when necessary for support or maintenance.</p>
              <p><strong>Regular Audits:</strong> We regularly review our security practices and update them as needed.</p>
              <p><strong>No Third-Party Access:</strong> We never sell or share your personal data with advertisers or data brokers.</p>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-medium">Intellectual Property Rights</h3>
            <div className="space-y-3 text-gray-300">
              <p><strong>Your Content:</strong> You retain full ownership of all thoughtmarks, notes, and content you create.</p>
              <p><strong>Our Platform:</strong> Thoughtmarks retains ownership of the software, algorithms, and platform technology.</p>
              <p><strong>AI Processing:</strong> Your content may be processed by AI for categorization and search, but ownership remains with you.</p>
              <p><strong>Content License:</strong> You grant us a limited license to store, process, and display your content to provide the service.</p>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-medium">Liability Limitations</h3>
            <div className="space-y-3 text-gray-300">
              <p><strong>Service Availability:</strong> While we strive for 99.9% uptime, we cannot guarantee uninterrupted service.</p>
              <p><strong>Data Loss Protection:</strong> We maintain backups, but users are responsible for their own data backup practices.</p>
              <p><strong>AI Accuracy:</strong> AI categorization and suggestions are provided as-is and may not always be accurate.</p>
              <p><strong>Limitation of Damages:</strong> Our liability is limited to the amount paid for the service in the past 12 months.</p>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-medium">Dispute Resolution</h3>
            <div className="space-y-3 text-gray-300">
              <p><strong>Initial Contact:</strong> Contact us at support@thoughtmarks.app for any disputes or concerns.</p>
              <p><strong>Resolution Process:</strong> We commit to responding within 48 hours and resolving issues within 7 business days.</p>
              <p><strong>Escalation:</strong> If unable to resolve directly, disputes may be resolved through binding arbitration.</p>
              <p><strong>Governing Law:</strong> These terms are governed by the laws of the jurisdiction where Thoughtmarks is registered.</p>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-medium">Data Portability & Deletion</h3>
            <div className="space-y-3 text-gray-300">
              <p><strong>Export Your Data:</strong> You can export all your thoughtmarks and data at any time in JSON format.</p>
              <p><strong>Account Deletion:</strong> Request complete account deletion, and all data will be permanently removed within 30 days.</p>
              <p><strong>GDPR Compliance:</strong> We comply with GDPR, CCPA, and other applicable privacy regulations.</p>
              <p><strong>Data Retention:</strong> Active data is retained as long as your account exists; deleted data is purged within 30 days.</p>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-medium">Your Rights</h3>
            <div className="space-y-3 text-gray-300">
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Access:</strong> View all data we have about you</li>
                <li><strong>Export:</strong> Download your thoughtmarks in multiple formats</li>
                <li><strong>Delete:</strong> Permanently delete your account and all associated data</li>
                <li><strong>Modify:</strong> Update your name or email address at any time</li>
              </ul>
              <p className="text-sm text-gray-400">
                To exercise these rights, contact us through the app's settings or email us directly.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-medium">Data Sharing</h3>
            <div className="space-y-3 text-gray-300">
              <p><strong>We do not sell, rent, or share your personal information with third parties.</strong></p>
              <p>The only exceptions are:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>When you explicitly choose to share thoughtmarks using our sharing features</li>
                <li>If required by law or to protect our legal rights</li>
                <li>In case of a business transfer (with 30 days notice)</li>
              </ul>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-medium">Cookies & Tracking</h3>
            <div className="space-y-3 text-gray-300">
              <p>We use minimal cookies only for:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Keeping you logged in to your account</li>
                <li>Remembering your app preferences</li>
                <li>Essential security functions</li>
              </ul>
              <p>We do not use tracking cookies or analytics that identify you personally.</p>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-medium">Contact & Updates</h3>
            <div className="space-y-3 text-gray-300">
              <p>Questions about this privacy policy? Contact us at <strong>privacy@thoughtmarks.app</strong></p>
              <p>We'll notify you of any material changes to this policy at least 30 days before they take effect.</p>
            </div>
          </section>

          <div className="mt-12 pt-8 border-t border-gray-700">
            <p className="text-sm text-gray-500 text-center">
              This privacy policy is designed to be transparent and user-friendly. 
              We believe in minimal data collection and maximum user control.
            </p>
          </div>
        </div>
      </div>
    </PersistentLayout>
  );
}