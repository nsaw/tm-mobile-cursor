import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { PageLayout } from "@/components/page-layout";
import { apiRequest } from "@/lib/queryClient";
import { Badge } from "@/components/ui/badge";
import { Mail, Users, Settings, ExternalLink, Copy, CheckCircle, AlertCircle } from "lucide-react";

export default function FormAutomation() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [bulkEmails, setBulkEmails] = useState("");
  const [testEmail, setTestEmail] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const { toast } = useToast();

  const handleTestSubmission = async () => {
    if (!testEmail.trim()) {
      toast({
        title: "No test email provided",
        description: "Please enter a test email address",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    try {
      const response = await apiRequest("POST", "/api/premium-trial-automation", {
        email: testEmail,
        name: "Test User",
        source: "manual_test"
      });

      setResults([{
        email: testEmail,
        status: "success",
        message: "Premium trial activated successfully",
        timestamp: new Date().toISOString()
      }]);

      toast({
        title: "Test successful",
        description: `Premium trial activation tested for ${testEmail}`,
      });
    } catch (error: any) {
      console.error("Test submission error:", error);
      setResults([{
        email: testEmail,
        status: "error",
        message: error.message || "Failed to process test submission",
        timestamp: new Date().toISOString()
      }]);
      
      toast({
        title: "Test failed",
        description: error.message || "Failed to process test submission",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBulkSubmission = async () => {
    if (!bulkEmails.trim()) {
      toast({
        title: "No emails provided",
        description: "Please enter email addresses to process",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    try {
      const emailLines = bulkEmails.split('\n').filter(line => line.trim());
      const submissions = [];

      for (const line of emailLines) {
        const parts = line.split(',').map(p => p.trim());
        if (parts.length >= 2) {
          submissions.push({
            email: parts[0],
            name: parts[1],
            interests: parts[2] ? parts[2].split(';') : [],
            source: 'bulk_import'
          });
        }
      }

      const processedResults = [];
      for (const submission of submissions) {
        try {
          const response = await apiRequest("POST", "/api/form/submit", submission);
          const result = await response.json();
          processedResults.push({ 
            email: submission.email, 
            success: response.ok, 
            result 
          });
        } catch (error: any) {
          processedResults.push({ 
            email: submission.email, 
            success: false, 
            error: error.message 
          });
        }
      }

      setResults(processedResults);
      toast({
        title: "Bulk processing complete",
        description: `Processed ${processedResults.length} submissions`
      });

    } catch (error: any) {
      toast({
        title: "Processing failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTestEmail = async () => {
    if (!testEmail) {
      toast({
        title: "Email required",
        description: "Please enter an email address to test",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await apiRequest("POST", "/api/form/submit", {
        email: testEmail,
        name: "Test User",
        interests: ["AI", "Productivity"],
        source: "admin_test"
      });

      if (response.ok) {
        const result = await response.json();
        toast({
          title: "Test submission successful",
          description: `Premium trial created for ${testEmail}`
        });
        
        // Open email preview
        window.open(`/api/email/preview/${encodeURIComponent(testEmail)}`, '_blank');
      } else {
        throw new Error("Test submission failed");
      }
    } catch (error: any) {
      toast({
        title: "Test failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const copyWebhookUrl = () => {
    const url = `${window.location.origin}/api/webhook/google-form`;
    navigator.clipboard.writeText(url);
    toast({
      title: "Webhook URL copied",
      description: "URL copied to clipboard"
    });
  };

  const copyFormSubmitUrl = () => {
    const url = `${window.location.origin}/api/form/submit`;
    navigator.clipboard.writeText(url);
    toast({
      title: "Form submission URL copied",
      description: "URL copied to clipboard"
    });
  };

  return (
    <PageLayout>
      <div className="container max-w-4xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Form Automation</h1>
            <p className="text-muted-foreground">Manage Google Form submissions and premium trial automation</p>
          </div>
        </div>

        {/* API Endpoints */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              API Endpoints
            </CardTitle>
            <CardDescription>
              Configure your Google Form or external service to use these endpoints
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Form Submission Endpoint</Label>
              <div className="flex gap-2">
                <Input 
                  value={`${window.location.origin}/api/form/submit`}
                  readOnly
                  className="font-mono text-sm"
                />
                <Button onClick={copyFormSubmitUrl} size="sm" variant="outline">
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                POST with JSON: {"{"}"email": "user@email.com", "name": "User Name", "interests": ["AI", "Productivity"]{"}"} 
              </p>
            </div>

            <div className="space-y-2">
              <Label>Google Form Webhook</Label>
              <div className="flex gap-2">
                <Input 
                  value={`${window.location.origin}/api/webhook/google-form`}
                  readOnly
                  className="font-mono text-sm"
                />
                <Button onClick={copyWebhookUrl} size="sm" variant="outline">
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                For Google Apps Script integration - processes multiple form submissions
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Test Single Submission */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Test Single Submission
            </CardTitle>
            <CardDescription>
              Test the premium trial flow with a single email address
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="testEmail">Test Email Address</Label>
              <Input
                id="testEmail"
                type="email"
                placeholder="test@example.com"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
              />
            </div>
            <Button onClick={handleTestSubmission} className="w-full" disabled={isProcessing}>
              {isProcessing ? "Testing..." : "Create Test Premium Trial"}
            </Button>
          </CardContent>
        </Card>

        {/* Bulk Processing */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Bulk Form Processing
            </CardTitle>
            <CardDescription>
              Process multiple form submissions at once. Enter one submission per line.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bulkEmails">Form Submissions</Label>
              <Textarea
                id="bulkEmails"
                placeholder="email@example.com, Name, interests1;interests2&#10;another@email.com, Another Name, productivity;AI"
                value={bulkEmails}
                onChange={(e) => setBulkEmails(e.target.value)}
                rows={8}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Format: email, name, interests (separated by semicolons) - one per line
              </p>
            </div>

            <Button 
              onClick={handleBulkSubmission} 
              disabled={isProcessing}
              className="w-full"
            >
              {isProcessing ? "Processing..." : "Process All Submissions"}
            </Button>

            {results.length > 0 && (
              <div className="space-y-2">
                <Label>Processing Results</Label>
                <div className="max-h-60 overflow-y-auto space-y-2">
                  {results.map((result, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <span className="text-sm font-mono">{result.email}</span>
                      {result.success ? (
                        <Badge variant="default" className="bg-green-600">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Success
                        </Badge>
                      ) : (
                        <Badge variant="destructive">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Failed
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* DNS Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>DNS Configuration Required</CardTitle>
            <CardDescription>
              Add these DNS records to thoughtmarks.app for email authentication
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <h4 className="font-medium mb-2 text-blue-300">SPF Record (TXT)</h4>
              <div className="font-mono text-sm bg-gray-800 p-2 rounded">
                <div>Name: @</div>
                <div>Value: v=spf1 include:sendgrid.net ~all</div>
              </div>
            </div>

            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
              <h4 className="font-medium mb-2 text-green-300">DMARC Policy (TXT)</h4>
              <div className="font-mono text-sm bg-gray-800 p-2 rounded">
                <div>Name: _dmarc</div>
                <div>Value: v=DMARC1; p=quarantine; rua=mailto:hello@thoughtmarks.app</div>
              </div>
            </div>

            <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
              <h4 className="font-medium mb-2 text-purple-300">DKIM Records (CNAME)</h4>
              <p className="text-sm text-muted-foreground mb-2">
                SendGrid will provide these after domain verification:
              </p>
              <div className="font-mono text-xs bg-gray-800 p-2 rounded">
                <div>s1._domainkey → s1.domainkey.u[ID].wl[ID].sendgrid.net</div>
                <div>s2._domainkey → s2.domainkey.u[ID].wl[ID].sendgrid.net</div>
              </div>
            </div>

            <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
              <h4 className="font-medium mb-2 text-orange-300">Setup Checklist</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Add SENDGRID_API_KEY secret to Replit</li>
                <li>Verify domain in SendGrid dashboard</li>
                <li>Add DNS records above to thoughtmarks.app</li>
                <li>Verify hello@thoughtmarks.app sender identity</li>
                <li>Test email delivery to major providers</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <Label>Google Apps Script for Form Integration</Label>
              <Textarea
                readOnly
                value={`function onFormSubmit(e) {
  const formData = {
    email: e.values[1], // Adjust column indexes based on your form
    name: e.values[2],
    interests: e.values[3] ? e.values[3].split(',') : []
  };
  
  const response = UrlFetchApp.fetch('${window.location.origin}/api/form/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    payload: JSON.stringify(formData)
  });
  
  console.log('Response:', response.getContentText());
}`}
                rows={12}
                className="font-mono text-xs"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}