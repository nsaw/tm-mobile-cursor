import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Mic, Copy, CheckCircle, Smartphone, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PersistentLayout } from "@/components/persistent-layout";
import { useToast } from "@/hooks/use-toast";
import { SiriShortcutGenerator } from "@/lib/siri-shortcuts";

export default function SiriSetup() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [copiedStep, setCopiedStep] = useState<number | null>(null);

  const appUrl = window.location.origin;
  const endpointUrl = `${appUrl}/api/siri-shortcut`;

  const copyToClipboard = async (text: string, step: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStep(step);
      toast({
        title: "Copied!",
        description: "Text copied to clipboard",
      });
      setTimeout(() => setCopiedStep(null), 2000);
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Please copy manually",
        variant: "destructive",
      });
    }
  };

  const siriPayload = `{
  "instruction": "[DictatedText]",
  "timestamp": "[CurrentDate]"
}`;

  return (
    <PersistentLayout>
      <div className="max-w-md mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Smartphone className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-xl font-bold text-white mb-2">Voice to Thoughtmarks</h1>
          <p className="text-gray-400 text-sm">
            Install the Siri shortcut for hands-free voice capture
          </p>
        </div>

        {/* One-Tap Install */}
        <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-lg p-4 border border-blue-500/20">
          <div className="flex items-center gap-3 mb-3">
            <Download className="w-5 h-5 text-blue-400" />
            <h3 className="font-semibold text-white">Install Shortcut</h3>
          </div>
          <p className="text-sm text-gray-300 mb-4">
            One-tap install of the pre-built Siri shortcut with native background processing.
          </p>
          <Button
            onClick={() => {
              // iCloud shortcut link will be added here
              const iCloudLink = "https://www.icloud.com/shortcuts/[YOUR_SHORTCUT_ID]";
              window.open(iCloudLink, '_blank');
              
              toast({
                title: "Opening Shortcut",
                description: "Tap 'Add Shortcut' to install instantly",

              });
            }}
            className="w-full bg-blue-600 text-white hover:bg-blue-700 font-medium"
          >
            <Download className="w-4 h-4 mr-2" />
            Download & Install Shortcut
          </Button>
        </div>

        {/* How It Works */}
        <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
          <h3 className="text-sm font-semibold text-white mb-3">How It Works:</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-gray-800 rounded">
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-0.5">1</div>
              <div>
                <div className="text-sm font-medium text-white mb-1">Say "Hey Siri, Add Thoughtmark"</div>
                <div className="text-xs text-gray-400">
                  Triggers the voice recording prompt
                </div>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-gray-800 rounded">
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-0.5">2</div>
              <div>
                <div className="text-sm font-medium text-white mb-1">Speak Your Thoughtmark</div>
                <div className="text-xs text-gray-400">
                  Voice is transcribed and processed in the background
                </div>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-green-900/30 border border-green-700/30 rounded">
              <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-0.5">✓</div>
              <div>
                <div className="text-sm font-medium text-white mb-1">Automatically Saved</div>
                <div className="text-xs text-gray-300">
                  • AI processes and categorizes your thoughtmark<br/>
                  • Saved to Sort Later bin with voice and siri tags<br/>
                  • Native notification confirms it's saved<br/>
                  • Phone stays in pocket throughout
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Test Section */}
        <div className="bg-green-900/20 rounded-lg p-4 border border-green-700/30">
          <h3 className="font-semibold text-green-400 mb-2">Test Your Shortcut</h3>
          <p className="text-sm text-gray-300">
            Once set up, say "Hey Siri, add to Thoughtmarks" followed by your idea. 
            It will automatically be saved to your Sort Later bin with voice and siri tags.
          </p>
        </div>

        {/* Back Button */}
        <div className="pt-4">
          <Button
            onClick={() => setLocation("/settings")}
            variant="outline"
            className="w-full"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Settings
          </Button>
        </div>
      </div>
    </PersistentLayout>
  );
}