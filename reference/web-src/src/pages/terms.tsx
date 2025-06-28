import { PersistentLayout } from "@/components/persistent-layout";

export default function Terms() {
  return (
    <PersistentLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl text-white mb-2 uppercase" style={{ fontFamily: 'Oswald, sans-serif', fontWeight: '600', letterSpacing: '-0.02em' }}>
            TERMS OF SERVICE
          </h1>
          <p className="text-gray-400">Usage terms and conditions</p>
        </div>

        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-[#C6D600]">Terms of Service</h2>
            <p className="text-sm text-gray-400">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          <section className="space-y-4">
            <h3 className="text-lg font-medium">Agreement to Terms</h3>
            <div className="space-y-3 text-gray-300">
              <p>By accessing and using Thoughtmarks, you accept and agree to be bound by the terms and provision of this agreement.</p>
              <p>If you do not agree to abide by the above, please do not use this service.</p>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-medium">Use License</h3>
            <div className="space-y-3 text-gray-300">
              <p>Permission is granted to temporarily download one copy of Thoughtmarks for personal, non-commercial transitory viewing only.</p>
              <p>This is the grant of a license, not a transfer of title, and under this license you may not:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>modify or copy the materials</li>
                <li>use the materials for any commercial purpose or for any public display</li>
                <li>attempt to reverse engineer any software contained in Thoughtmarks</li>
                <li>remove any copyright or other proprietary notations from the materials</li>
              </ul>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-medium">User Accounts</h3>
            <div className="space-y-3 text-gray-300">
              <p>When you create an account with us, you must provide information that is accurate, complete, and current at all times.</p>
              <p>You are responsible for safeguarding the password and for all activities that occur under your account.</p>
              <p>You agree not to disclose your password to any third party and to take sole responsibility for activities under your account.</p>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-medium">Content</h3>
            <div className="space-y-3 text-gray-300">
              <p>Our Service allows you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material ("Content").</p>
              <p>You are responsible for the Content that you post to the Service, including its legality, reliability, and appropriateness.</p>
              <p>By posting Content to the Service, you grant us the right and license to use, modify, publicly perform, publicly display, reproduce, and distribute such Content on and through the Service.</p>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-medium">Privacy Policy</h3>
            <div className="space-y-3 text-gray-300">
              <p>Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Service, to understand our practices.</p>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-medium">Prohibited Uses</h3>
            <div className="space-y-3 text-gray-300">
              <p>You may not use our Service:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
                <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
                <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
                <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                <li>To submit false or misleading information</li>
                <li>To upload or transmit viruses or any other type of malicious code</li>
              </ul>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-medium">Termination</h3>
            <div className="space-y-3 text-gray-300">
              <p>We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>
              <p>Upon termination, your right to use the Service will cease immediately. If you wish to terminate your account, you may simply discontinue using the Service.</p>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-medium">Disclaimer</h3>
            <div className="space-y-3 text-gray-300">
              <p>The information on this service is provided on an "as is" basis. To the fullest extent permitted by law, this Company:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>excludes all representations and warranties relating to this service and its contents</li>
                <li>excludes all liability for damages arising out of or in connection with your use of this service</li>
              </ul>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-medium">Limitation of Liability</h3>
            <div className="space-y-3 text-gray-300">
              <p>In no case shall Thoughtmarks, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, punitive, special, or consequential damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the Service.</p>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-medium">Governing Law</h3>
            <div className="space-y-3 text-gray-300">
              <p>These Terms shall be interpreted and governed by the laws of the State of [State/Country], without regard to its conflict of law provisions.</p>
              <p>Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.</p>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-medium">Changes to Terms</h3>
            <div className="space-y-3 text-gray-300">
              <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time.</p>
              <p>If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.</p>
              <p>What constitutes a material change will be determined at our sole discretion.</p>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-medium">Contact Information</h3>
            <div className="space-y-3 text-gray-300">
              <p>If you have any questions about these Terms of Service, please contact us at:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Email: legal@thoughtmarksapp.com</li>
                <li>Address: [Company Address]</li>
              </ul>
            </div>
          </section>

          <div className="pt-8 border-t border-gray-800">
            <p className="text-sm text-gray-500 text-center">
              These terms are designed to be fair and transparent while protecting both users and the service.
            </p>
          </div>
        </div>
      </div>
    </PersistentLayout>
  );
}