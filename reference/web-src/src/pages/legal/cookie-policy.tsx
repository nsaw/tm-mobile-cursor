import { PersistentLayout } from "@/components/persistent-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function CookiePolicy() {
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
          <h1 className="text-2xl font-bold text-white">Cookie Policy</h1>
        </div>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Cookie Policy</CardTitle>
            <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-3">What Are Cookies</h2>
              <p className="text-muted-foreground leading-relaxed">
                Cookies are small text files stored on your device when you visit our website. They help us provide 
                a better user experience by remembering your preferences and enabling essential functionality.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Types of Cookies We Use</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Essential Cookies</h3>
                  <p className="text-muted-foreground">Required for basic site functionality including authentication and security.</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Preference Cookies</h3>
                  <p className="text-muted-foreground">Remember your settings like theme preferences and language choices.</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Analytics Cookies</h3>
                  <p className="text-muted-foreground">Help us understand how you use the app to improve performance and features.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Managing Cookies</h2>
              <p className="text-muted-foreground leading-relaxed">
                You can control cookie preferences through your browser settings or our privacy settings page. 
                Note that disabling certain cookies may affect app functionality.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Third-Party Cookies</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may use third-party services that set cookies for analytics and authentication. 
                These are governed by the respective third party's privacy policies.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </PersistentLayout>
  );
}