import { PersistentLayout } from "@/components/persistent-layout";

export default function DisputeResolution() {
  return (
    <PersistentLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl text-white mb-2 uppercase" style={{ fontFamily: 'Oswald, sans-serif', fontWeight: '600', letterSpacing: '-0.02em' }}>
            DISPUTE RESOLUTION
          </h1>
          <p className="text-gray-400">How we handle conflicts and disagreements</p>
        </div>

        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-[#C6D600]">Dispute Resolution Process</h2>
            <p className="text-sm text-gray-400">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          <section className="space-y-4">
            <h3 className="text-lg font-medium">1. Initial Contact</h3>
            <div className="space-y-3 text-gray-300">
              <p><strong>First Step:</strong> Contact us at support@thoughtmarks.app for any disputes, concerns, or complaints.</p>
              <p><strong>Information Required:</strong> Provide your account details, description of the issue, and desired resolution.</p>
              <p><strong>Response Time:</strong> We commit to acknowledging your request within 24 hours.</p>
              <p><strong>Documentation:</strong> Include any relevant screenshots, error messages, or supporting documentation.</p>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-medium">2. Investigation Process</h3>
            <div className="space-y-3 text-gray-300">
              <p><strong>Review Timeline:</strong> Initial investigation begins within 48 hours of receiving your dispute.</p>
              <p><strong>Information Gathering:</strong> We may request additional information or clarification during the process.</p>
              <p><strong>Technical Analysis:</strong> Our team will review logs, account activity, and system records as applicable.</p>
              <p><strong>Progress Updates:</strong> You will receive status updates every 3-5 business days during the investigation.</p>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-medium">3. Resolution Timeline</h3>
            <div className="space-y-3 text-gray-300">
              <p><strong>Simple Issues:</strong> Account access, billing questions, or feature clarifications resolved within 2-3 business days.</p>
              <p><strong>Technical Issues:</strong> Bug reports, data sync problems, or performance issues resolved within 5-7 business days.</p>
              <p><strong>Complex Disputes:</strong> Policy violations, account suspensions, or legal matters may take 10-14 business days.</p>
              <p><strong>Final Decision:</strong> All disputes receive a final written response within 21 business days maximum.</p>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-medium">4. Types of Resolutions</h3>
            <div className="space-y-3 text-gray-300">
              <p><strong>Account Restoration:</strong> Reinstatement of suspended accounts when appropriate.</p>
              <p><strong>Service Credits:</strong> Account credits for service disruptions or billing errors.</p>
              <p><strong>Feature Fixes:</strong> Priority bug fixes for reported technical issues.</p>
              <p><strong>Policy Clarification:</strong> Written explanations of policy decisions and their rationale.</p>
              <p><strong>Refunds:</strong> Partial or full refunds when service failures warrant compensation.</p>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-medium">5. Escalation Process</h3>
            <div className="space-y-3 text-gray-300">
              <p><strong>Supervisor Review:</strong> Request escalation to a supervisor if unsatisfied with initial resolution.</p>
              <p><strong>Management Review:</strong> Complex cases can be escalated to department management.</p>
              <p><strong>Executive Review:</strong> Final internal escalation to executive leadership for significant disputes.</p>
              <p><strong>External Options:</strong> Information about external dispute resolution if internal process is insufficient.</p>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-medium">6. Billing and Payment Disputes</h3>
            <div className="space-y-3 text-gray-300">
              <p><strong>Billing Errors:</strong> Immediate investigation and correction of erroneous charges.</p>
              <p><strong>Unauthorized Charges:</strong> Refunds for charges made without proper authorization.</p>
              <p><strong>Service Disputes:</strong> Pro-rated refunds for service interruptions or feature unavailability.</p>
              <p><strong>Subscription Issues:</strong> Resolution of cancellation, upgrade, or downgrade problems.</p>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-medium">7. Data and Privacy Disputes</h3>
            <div className="space-y-3 text-gray-300">
              <p><strong>Data Access:</strong> Assistance with accessing, correcting, or deleting personal data.</p>
              <p><strong>Privacy Concerns:</strong> Investigation of potential privacy policy violations.</p>
              <p><strong>Data Portability:</strong> Help with exporting data in accessible formats.</p>
              <p><strong>Consent Issues:</strong> Resolution of consent-related problems or misunderstandings.</p>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-medium">8. Arbitration</h3>
            <div className="space-y-3 text-gray-300">
              <p><strong>Binding Arbitration:</strong> Final disputes may be resolved through binding arbitration.</p>
              <p><strong>Arbitrator Selection:</strong> Neutral arbitrator chosen through established arbitration services.</p>
              <p><strong>Cost Sharing:</strong> Arbitration costs shared between parties unless otherwise specified.</p>
              <p><strong>Final Decision:</strong> Arbitrator's decision is final and legally binding on both parties.</p>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-medium">9. Governing Law</h3>
            <div className="space-y-3 text-gray-300">
              <p><strong>Jurisdiction:</strong> Disputes governed by the laws where Thoughtmarks is legally registered.</p>
              <p><strong>Court Jurisdiction:</strong> Local courts have jurisdiction for matters not resolved through arbitration.</p>
              <p><strong>International Users:</strong> International data protection laws respected where applicable.</p>
              <p><strong>Consumer Protection:</strong> Local consumer protection laws remain in effect where they apply.</p>
            </div>
          </section>

          <div className="mt-12 pt-8 border-t border-gray-700">
            <p className="text-sm text-gray-500 text-center">
              We are committed to fair and timely dispute resolution. 
              Our goal is to address your concerns quickly and thoroughly.
            </p>
          </div>
        </div>
      </div>
    </PersistentLayout>
  );
}