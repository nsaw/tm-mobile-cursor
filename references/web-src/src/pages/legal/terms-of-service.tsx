import { PersistentLayout } from "@/components/persistent-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function TermsOfService() {
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
          <h1 className="text-2xl font-bold text-white">Terms of Service</h1>
        </div>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Thoughtmarks Terms of Service</CardTitle>
            <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing and using Thoughtmarks, you accept and agree to be bound by the terms and provision of this agreement. 
                If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">2. Service Description</h2>
              <p className="text-muted-foreground leading-relaxed">
                Thoughtmarks is a personal knowledge management application that allows users to capture, organize, and retrieve 
                their thoughts and ideas using AI-powered categorization and voice recording capabilities.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">3. User Accounts and Responsibilities</h2>
              <div className="space-y-3 text-muted-foreground">
                <p>Users are responsible for:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Maintaining the confidentiality of their account credentials</li>
                  <li>All activities that occur under their account</li>
                  <li>Ensuring their content complies with applicable laws</li>
                  <li>Not sharing accounts with unauthorized users</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">4. Content and Privacy</h2>
              <p className="text-muted-foreground leading-relaxed">
                You retain ownership of your content. We process your data according to our Privacy Policy to provide 
                and improve our services. We implement industry-standard security measures to protect your information.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">5. AI and Voice Processing</h2>
              <p className="text-muted-foreground leading-relaxed">
                Our AI features process your content to provide categorization, insights, and search capabilities. 
                Voice recordings are processed for transcription and may be temporarily stored for service improvement.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">6. Premium Features</h2>
              <p className="text-muted-foreground leading-relaxed">
                Premium subscriptions provide access to advanced features. Billing is recurring unless cancelled. 
                Refunds are provided according to our refund policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">7. Prohibited Uses</h2>
              <div className="space-y-3 text-muted-foreground">
                <p>You may not use Thoughtmarks to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Store illegal, harmful, or offensive content</li>
                  <li>Violate any applicable laws or regulations</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>Interfere with the service's operation</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">8. Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed">
                Thoughtmarks is provided "as is" without warranties. We are not liable for any indirect, incidental, 
                or consequential damages arising from your use of the service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">9. Changes to Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to modify these terms at any time. Users will be notified of significant changes 
                and continued use constitutes acceptance of the modified terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">10. Contact Information</h2>
              <p className="text-muted-foreground leading-relaxed">
                For questions about these terms, please contact us through the app's support system or at our official support channels.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </PersistentLayout>
  );
}