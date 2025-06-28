import { PersistentLayout } from "@/components/persistent-layout";

export default function IntellectualProperty() {
  return (
    <PersistentLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl text-white mb-2 uppercase" style={{ fontFamily: 'Oswald, sans-serif', fontWeight: '600', letterSpacing: '-0.02em' }}>
            INTELLECTUAL PROPERTY POLICY
          </h1>
          <p className="text-gray-400">Rights, ownership, and usage guidelines</p>
        </div>

        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-[#C6D600]">Intellectual Property Policy</h2>
            <p className="text-sm text-gray-400">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          <section className="space-y-4">
            <h3 className="text-lg font-medium">1. Your Content Rights</h3>
            <div className="space-y-3 text-gray-300">
              <p><strong>Full Ownership:</strong> You retain complete ownership of all thoughtmarks, notes, and content you create.</p>
              <p><strong>Copyright Protection:</strong> Your original content is protected by copyright law from the moment of creation.</p>
              <p><strong>No Claims:</strong> Thoughtmarks makes no ownership claims over your intellectual property.</p>
              <p><strong>Creator Attribution:</strong> You maintain the right to be identified as the creator of your content.</p>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-medium">2. License to Thoughtmarks</h3>
            <div className="space-y-3 text-gray-300">
              <p><strong>Limited License:</strong> You grant us a limited, non-exclusive license to store, process, and display your content.</p>
              <p><strong>Service Provision:</strong> This license is solely for providing the Thoughtmarks service to you.</p>
              <p><strong>No Commercial Use:</strong> We will not use your content for commercial purposes beyond service provision.</p>
              <p><strong>Revocable License:</strong> This license terminates when you delete content or close your account.</p>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-medium">3. Platform Intellectual Property</h3>
            <div className="space-y-3 text-gray-300">
              <p><strong>Software Ownership:</strong> Thoughtmarks owns all rights to the platform software and technology.</p>
              <p><strong>Algorithms and AI:</strong> All AI algorithms, categorization systems, and search technology are proprietary.</p>
              <p><strong>Trademarks:</strong> "Thoughtmarks" and associated logos are protected trademarks.</p>
              <p><strong>Design Elements:</strong> User interface design, graphics, and visual elements are copyrighted.</p>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-medium">4. AI Processing and Content</h3>
            <div className="space-y-3 text-gray-300">
              <p><strong>Processing Rights:</strong> Your content may be processed by AI for categorization, search, and feature enhancement.</p>
              <p><strong>Anonymized Learning:</strong> AI systems may learn from aggregated, anonymized usage patterns.</p>
              <p><strong>No Content Training:</strong> Your specific content is not used to train AI models for other users.</p>
              <p><strong>Opt-Out Options:</strong> You can disable AI processing features if desired.</p>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-medium">5. Third-Party Content</h3>
            <div className="space-y-3 text-gray-300">
              <p><strong>User Responsibility:</strong> You are responsible for ensuring you have rights to any third-party content you upload.</p>
              <p><strong>Copyright Compliance:</strong> Do not upload content that infringes on others' intellectual property rights.</p>
              <p><strong>Licensed Content:</strong> Properly attribute any content used under Creative Commons or other licenses.</p>
              <p><strong>Fair Use:</strong> Understand and comply with fair use limitations when including copyrighted material.</p>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-medium">6. DMCA and Copyright Protection</h3>
            <div className="space-y-3 text-gray-300">
              <p><strong>DMCA Compliance:</strong> We comply with the Digital Millennium Copyright Act and similar laws.</p>
              <p><strong>Takedown Requests:</strong> Copyright holders can request removal of infringing content.</p>
              <p><strong>Counter-Notification:</strong> Users can file counter-notifications for wrongful takedown requests.</p>
              <p><strong>Repeat Infringers:</strong> Accounts with repeated copyright violations may be terminated.</p>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-medium">7. Content Sharing and Collaboration</h3>
            <div className="space-y-3 text-gray-300">
              <p><strong>Sharing Controls:</strong> You control who can access and view your shared content.</p>
              <p><strong>Collaboration Rights:</strong> Shared content maintains original creator attribution.</p>
              <p><strong>Derivative Works:</strong> Collaborators may create derivative works only with your permission.</p>
              <p><strong>Export Rights:</strong> You can export and use your content outside Thoughtmarks at any time.</p>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-medium">8. Data Portability</h3>
            <div className="space-y-3 text-gray-300">
              <p><strong>Export Formats:</strong> Your content can be exported in standard formats (JSON, CSV, etc.).</p>
              <p><strong>No Lock-In:</strong> You are never locked into our platform and can leave with your data.</p>
              <p><strong>Migration Assistance:</strong> We provide tools and guidance for migrating to other platforms.</p>
              <p><strong>Backup Rights:</strong> You have the right to maintain personal backups of your content.</p>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-medium">9. Infringement Reporting</h3>
            <div className="space-y-3 text-gray-300">
              <p><strong>Report Process:</strong> Contact legal@thoughtmarks.app to report intellectual property violations.</p>
              <p><strong>Required Information:</strong> Include specific details about the infringement and your rights.</p>
              <p><strong>Investigation Timeline:</strong> We investigate reports within 5-7 business days.</p>
              <p><strong>Resolution Actions:</strong> May include content removal, account warnings, or account suspension.</p>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-medium">10. Open Source and Third-Party Licenses</h3>
            <div className="space-y-3 text-gray-300">
              <p><strong>Open Source Components:</strong> Some platform components use open source software under various licenses.</p>
              <p><strong>License Compliance:</strong> We comply with all applicable open source license requirements.</p>
              <p><strong>Attribution:</strong> Open source attributions are available in our platform documentation.</p>
              <p><strong>Third-Party Services:</strong> Integrated services maintain their own intellectual property rights.</p>
            </div>
          </section>

          <div className="mt-12 pt-8 border-t border-gray-700">
            <p className="text-sm text-gray-500 text-center">
              We respect intellectual property rights and expect users to do the same. 
              Contact legal@thoughtmarks.app with questions about IP policies.
            </p>
          </div>
        </div>
      </div>
    </PersistentLayout>
  );
}