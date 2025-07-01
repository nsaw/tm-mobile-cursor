import { Zap, Brain, Focus, Mic } from "lucide-react";
import { Card } from "@/components/ui/card";
import { PersistentLayout } from "@/components/persistent-layout";

export default function About() {
  return (
    <PersistentLayout>
      <div className="max-w-md mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl text-white mb-2 uppercase" style={{ fontFamily: 'Oswald, sans-serif', fontWeight: '600', letterSpacing: '-0.02em' }}>
            ABOUT THOUGHTMARKS
          </h1>
          <p className="text-gray-400">Transform your ideas into organized insights</p>
        </div>

        {/* Logo and Tagline */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-2xl overflow-hidden mx-auto mb-4">
            <img 
              src="https://raw.githubusercontent.com/nsaw/imageSrc/main/IMG_4663.jpeg" 
              alt="Thoughtmarks Logo" 
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-2xl font-bold mb-2">Stay in Flow</h2>
          <p className="text-gray-400 text-lg">Capture thoughts without breaking focus</p>
        </div>

        {/* Core Concept */}
        <Card className="bg-gray-900 border-gray-700 p-6 mb-6">
          <div className="flex items-start space-x-3 mb-4">
            <Focus className="w-6 h-6 text-[#C6D600] mt-1" />
            <div>
              <h3 className="font-semibold mb-2">What are Thoughtmarks?</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Thoughtmarks are a way to bookmark your thoughts when you don't have the bandwidth 
                to address them in the moment but want to come back to them later. Think of them 
                as mental bookmarks that preserve your ideas without disrupting your flow state.
              </p>
            </div>
          </div>
        </Card>

        {/* Key Features */}
        <div className="space-y-4 mb-8">
          <h3 className="text-lg font-semibold text-white">Key Features</h3>
          
          <Card className="bg-gray-900 border-gray-700 p-4">
            <div className="flex items-start space-x-3">
              <Mic className="w-5 h-5 text-[#C6D600] mt-1" />
              <div>
                <h4 className="font-medium mb-1">Voice-to-Thoughtmark</h4>
                <p className="text-gray-400 text-sm">
                  Record voice notes with speech-to-text transcription. Perfect for capturing 
                  ideas on the go without breaking focus.
                </p>
              </div>
            </div>
          </Card>

          <Card className="bg-gray-900 border-gray-700 p-4">
            <div className="flex items-start space-x-3">
              <Brain className="w-5 h-5 text-[#C6D600] mt-1" />
              <div>
                <h4 className="font-medium mb-1">AI-Powered Insights</h4>
                <p className="text-gray-400 text-sm">
                  Discover connections between your ideas, get summaries, and receive 
                  personalized content recommendations.
                </p>
              </div>
            </div>
          </Card>

          <Card className="bg-gray-900 border-gray-700 p-4">
            <div className="flex items-start space-x-3">
              <Zap className="w-5 h-5 text-[#C6D600] mt-1" />
              <div>
                <h4 className="font-medium mb-1">Smart Organization</h4>
                <p className="text-gray-400 text-sm">
                  Automatically tag and organize thoughts with intelligent bins and 
                  filtering systems.
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Philosophy */}
        <Card className="bg-gradient-to-br from-blue-950 to-gray-900 border-blue-700 p-6 mb-6">
          <h3 className="font-semibold mb-3 text-[#C6D600]">Our Philosophy</h3>
          <p className="text-gray-300 text-sm leading-relaxed mb-4">
            In today's world of constant distractions, maintaining deep focus is increasingly rare 
            and valuable. Thoughtmarks helps you preserve your flow state while ensuring no 
            important idea is lost.
          </p>
          <p className="text-gray-300 text-sm leading-relaxed">
            By providing quick capture mechanisms and intelligent organization, we help you 
            stay present in the moment while building a rich repository of your thoughts 
            for future exploration.
          </p>
        </Card>

        {/* Freemium Model */}
        <Card className="bg-gray-900 border-gray-700 p-6">
          <h3 className="font-semibold mb-3">Freemium Experience</h3>
          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-medium text-[#C6D600] mb-1">Free Features</h4>
              <ul className="text-gray-400 text-sm space-y-1">
                <li>• Unlimited thoughtmark creation</li>
                <li>• Voice recording and transcription</li>
                <li>• Basic organization with bins and tags</li>
                <li>• Search and filtering</li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-medium text-[#C6D600] mb-1">Premium Features</h4>
              <ul className="text-gray-400 text-sm space-y-1">
                <li>• AI-powered thoughtmark analysis</li>
                <li>• Smart content recommendations</li>
                <li>• Advanced connection mapping</li>
                <li>• Cross-device synchronization</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </PersistentLayout>
  );
}