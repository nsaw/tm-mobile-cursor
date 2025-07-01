import { PersistentLayout } from "@/components/persistent-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicy() {
  const [, setLocation] = useLocation();

  return (
    <PersistentLayout>
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/settings")}
            className="text-gray-400 hover:text-white"
            aria-label="Back to settings"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-2xl font-bold text-white">Privacy Policy</h1>
        </div>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Thoughtmarks Privacy Policy</CardTitle>
            <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-3">1. Information We Collect</h2>
              <div className="space-y-3 text-muted-foreground">
                <p><strong>Account Information:</strong> Email address, display name, and authentication data</p>
                <p><strong>Content Data:</strong> Your thoughtmarks, notes, tasks, and organizational data</p>
                <p><strong>Voice Data:</strong> Audio recordings for transcription (processed and deleted)</p>
                <p><strong>Usage Data:</strong> App interaction patterns for service improvement</p>
                <p><strong>Device Information:</strong> Browser type, operating system, and device identifiers</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">2. How We Use Your Information</h2>
              <div className="space-y-3 text-muted-foreground">
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Provide and maintain the Thoughtmarks service</li>
                  <li>Process voice recordings for text transcription</li>
                  <li>Generate AI-powered categorization and insights</li>
                  <li>Improve app functionality and user experience</li>
                  <li>Send service-related notifications</li>
                  <li>Provide customer support</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">3. AI Processing and OpenAI</h2>
              <p className="text-muted-foreground leading-relaxed">
                We use OpenAI's services to provide AI-powered features including text categorization, 
                content analysis, and search capabilities. Your content may be processed by OpenAI's 
                systems in accordance with their privacy policy. We do not store your data with OpenAI 
                beyond the processing session.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">4. Voice Data Processing</h2>
              <p className="text-muted-foreground leading-relaxed">
                Voice recordings are processed for transcription using speech-to-text services. 
                Audio files are temporarily stored during processing and permanently deleted after 
                successful transcription. We do not retain voice recordings beyond what's necessary 
                for transcription accuracy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">5. Data Storage and Security</h2>
              <div className="space-y-3 text-muted-foreground">
                <p><strong>Encryption:</strong> All data is encrypted in transit and at rest</p>
                <p><strong>Access Controls:</strong> Strict access controls limit data access to authorized personnel</p>
                <p><strong>Monitoring:</strong> Continuous security monitoring and threat detection</p>
                <p><strong>Backups:</strong> Regular encrypted backups for data recovery</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">6. Data Sharing and Third Parties</h2>
              <div className="space-y-3 text-muted-foreground">
                <p>We may share your information with:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Service Providers:</strong> OpenAI for AI processing, hosting providers</li>
                  <li><strong>Legal Requirements:</strong> When required by law or legal process</li>
                  <li><strong>Business Transfers:</strong> In case of merger, acquisition, or sale</li>
                </ul>
                <p>We never sell or rent your personal information to third parties.</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">7. Your Rights and Controls</h2>
              <div className="space-y-3 text-muted-foreground">
                <p>You have the right to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Access and export your data</li>
                  <li>Correct inaccurate information</li>
                  <li>Delete your account and data</li>
                  <li>Opt out of non-essential communications</li>
                  <li>Control AI processing preferences</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">8. International Data Transfers</h2>
              <p className="text-muted-foreground leading-relaxed">
                Your data may be processed in countries other than your residence. We ensure 
                appropriate safeguards are in place for international transfers in compliance 
                with applicable data protection laws.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">9. Data Retention</h2>
              <p className="text-muted-foreground leading-relaxed">
                We retain your data for as long as your account is active or as needed to provide 
                services. When you delete your account, we permanently delete your data within 30 days, 
                except where required by law to retain certain information.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">10. Children's Privacy</h2>
              <p className="text-muted-foreground leading-relaxed">
                Thoughtmarks is not intended for children under 13. We do not knowingly collect 
                personal information from children under 13. If we become aware of such collection, 
                we will delete the information immediately.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">11. Changes to Privacy Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this privacy policy periodically. We will notify you of significant 
                changes through the app or by email. Your continued use after changes indicates 
                acceptance of the updated policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">12. Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                For privacy-related questions or to exercise your rights, contact us through the 
                app's support system or our official support channels.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </PersistentLayout>
  );
}