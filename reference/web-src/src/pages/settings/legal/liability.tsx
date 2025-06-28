import { PersistentLayout } from "@/components/persistent-layout";

export default function LiabilityLimitations() {
  return (
    <PersistentLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl text-white mb-2 uppercase" style={{ fontFamily: 'Oswald, sans-serif', fontWeight: '600', letterSpacing: '-0.02em' }}>
            LIABILITY LIMITATIONS
          </h1>
          <p className="text-gray-400">Service limitations and liability protections</p>
        </div>

        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-[#C6D600]">Liability Limitations</h2>
            <p className="text-sm text-gray-400">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          <section className="space-y-4">
            <h3 className="text-lg font-medium">1. Service Availability</h3>
            <div className="space-y-3 text-gray-300">
              <p><strong>Uptime Target:</strong> We strive for 99.9% service availability but cannot guarantee uninterrupted access.</p>
              <p><strong>Planned Maintenance:</strong> Scheduled maintenance will be announced in advance when possible.</p>
              <p><strong>Emergency Maintenance:</strong> Critical security or stability issues may require immediate maintenance without notice.</p>
              <p><strong>Third-Party Dependencies:</strong> Service availability may be affected by external providers (cloud infrastructure, CDNs, etc.).</p>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-medium">2. Data Protection Limitations</h3>
            <div className="space-y-3 text-gray-300">
              <p><strong>Backup Systems:</strong> We maintain automated backups but cannot guarantee complete data recovery in all circumstances.</p>
              <p><strong>User Responsibility:</strong> Users are responsible for maintaining their own local backups of important data.</p>
              <p><strong>Data Export:</strong> Users can export their data at any time to maintain personal backups.</p>
              <p><strong>Retention Limits:</strong> Deleted data is permanently removed after 30 days and cannot be recovered.</p>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-medium">3. AI Feature Limitations</h3>
            <div className="space-y-3 text-gray-300">
              <p><strong>Accuracy Disclaimer:</strong> AI categorization, search, and suggestions are provided as-is and may not always be accurate.</p>
              <p><strong>Learning Limitations:</strong> AI performance may vary based on content type and quality.</p>
              <p><strong>No Medical/Legal Advice:</strong> AI suggestions are not professional advice and should not be relied upon for critical decisions.</p>
              <p><strong>Content Interpretation:</strong> AI may misinterpret context, sarcasm, or nuanced content.</p>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-medium">4. Financial Liability Limits</h3>
            <div className="space-y-3 text-gray-300">
              <p><strong>Maximum Liability:</strong> Our total liability is limited to the amount paid for the service in the past 12 months.</p>
              <p><strong>Consequential Damages:</strong> We are not liable for indirect, incidental, or consequential damages.</p>
              <p><strong>Business Interruption:</strong> Not liable for lost profits, business interruption, or opportunity costs.</p>
              <p><strong>Data Loss Claims:</strong> Liability for data loss is limited to service credit or refund, not data recreation costs.</p>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-medium">5. User Content Limitations</h3>
            <div className="space-y-3 text-gray-300">
              <p><strong>Content Review:</strong> We do not actively monitor or review user content for accuracy or appropriateness.</p>
              <p><strong>User Responsibility:</strong> Users are solely responsible for the content they create and share.</p>
              <p><strong>Copyright Issues:</strong> Users must ensure they have rights to any content they upload or share.</p>
              <p><strong>Content Backup:</strong> We are not responsible for recreating lost user-generated content.</p>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-medium">6. Security Limitations</h3>
            <div className="space-y-3 text-gray-300">
              <p><strong>Security Measures:</strong> We implement industry-standard security but cannot guarantee absolute security.</p>
              <p><strong>User Account Security:</strong> Users are responsible for maintaining secure passwords and account access.</p>
              <p><strong>Breach Response:</strong> We will notify users of security breaches as required by law, but are not liable for all consequences.</p>
              <p><strong>Third-Party Security:</strong> Not responsible for security issues with integrated third-party services.</p>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-medium">7. Integration Limitations</h3>
            <div className="space-y-3 text-gray-300">
              <p><strong>Third-Party Services:</strong> We are not responsible for the availability or functionality of external integrations.</p>
              <p><strong>API Changes:</strong> Third-party API changes may affect integrations without notice.</p>
              <p><strong>Data Sync Issues:</strong> Synchronization with external services may fail due to factors beyond our control.</p>
              <p><strong>Compatibility:</strong> Not all features may work across all devices or platforms.</p>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-medium">8. Warranty Disclaimers</h3>
            <div className="space-y-3 text-gray-300">
              <p><strong>As-Is Service:</strong> Thoughtmarks is provided "as is" without warranties of any kind.</p>
              <p><strong>Fitness for Purpose:</strong> No warranty that the service will meet specific requirements or expectations.</p>
              <p><strong>Error-Free Operation:</strong> No guarantee that the service will be error-free or uninterrupted.</p>
              <p><strong>Future Features:</strong> No obligation to provide specific features or updates.</p>
            </div>
          </section>

          <div className="mt-12 pt-8 border-t border-gray-700">
            <p className="text-sm text-gray-500 text-center">
              These limitations are designed to be fair while protecting our ability to provide reliable service. 
              For questions, contact us at legal@thoughtmarks.app
            </p>
          </div>
        </div>
      </div>
    </PersistentLayout>
  );
}