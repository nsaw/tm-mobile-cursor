import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Sparkles, Settings, Brain, Plus, Search, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";

interface GuideItem {
  id: string;
  title: string;
  description: string;
  element: "settings" | "new-button" | "ai-tools" | "search" | "voice";
  tip: string;
}

const guideItems: GuideItem[] = [
  {
    id: "why-thoughtmarks",
    title: "Why Capture Thoughtmarks?",
    description: "Your best ideas, insights, and revelations happen throughout the day - at random moments when you're not expecting them. Thoughtmarks help you capture these fleeting thoughts before they disappear forever.",
    element: "new-button",
    tip: "Whether it's a business idea in the shower, a creative insight while walking, or a solution to a problem while exercising - capture it immediately."
  },
  {
    id: "what-to-capture",
    title: "What Should You Capture?",
    description: "Capture anything that sparks your curiosity: random ideas, book quotes, conversation insights, problem solutions, creative inspirations, learning moments, or even questions you want to explore later.",
    element: "new-button",
    tip: "The goal isn't to capture everything - just the thoughts that make you think 'I don't want to forget this.'"
  },
  {
    id: "voice-capture-workflow",
    title: "Hands-Free Voice Capture",
    description: "Getting groceries? With kids? On a walk or working out? Use voice capture to record thoughts without breaking your flow. Perfect for busy parents, commuters, or anyone on the move.",
    element: "voice",
    tip: "Tap the microphone in the bottom navigation and just start talking - your thoughts will be transcribed automatically."
  },
  {
    id: "ai-powered-search",
    title: "Instant Recall with AI Search",
    description: "Can't remember where you saved that brilliant idea? Use AI-powered search to find thoughts by meaning, not just keywords. Ask natural questions and let AI connect the dots.",
    element: "search",
    tip: "Try searching 'productivity tips' or 'business ideas' - AI understands context and finds related thoughts."
  },
  {
    id: "tags-vs-bins",
    title: "Tags vs Collections (Bins)",
    description: "Tags are like hashtags for quick categorization (#productivity #health), while Collections (Bins) are organized folders for specific projects or themes. Use both for powerful organization.",
    element: "ai-tools",
    tip: "Tags are great for cross-cutting themes, Bins are perfect for projects, goals, or specific areas of interest."
  },
  {
    id: "ai-insights-premium",
    title: "AI Tools: Find Hidden Connections",
    description: "Upgrade to Premium to unlock AI insights that reveal patterns in your thinking, suggest connections between ideas, and help you discover themes you didn't even know existed.",
    element: "ai-tools",
    tip: "Click here to explore Premium features and see how AI can amplify your knowledge management."
  },
  {
    id: "sharing-workflow",
    title: "Share Ideas with Friends",
    description: "Found a great quote or insight worth sharing? Use the share button on any thoughtmark to create beautiful branded cards for social media or send directly to friends.",
    element: "new-button",
    tip: "Your shared thoughtmarks include proper attribution and look professional across all platforms."
  },
  {
    id: "daily-workflow",
    title: "Building Your Daily Workflow",
    description: "Make thoughtmarks part of your routine: morning reflections, meeting notes, evening insights, or weekend brainstorming. The more you capture, the richer your personal knowledge base becomes.",
    element: "new-button",
    tip: "Start with just one thoughtmark per day - consistency matters more than quantity."
  }
];

export default function InterfaceGuide() {
  const [, setLocation] = useLocation();
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const { user } = useAuth();

  const renderElementPreview = (element: string) => {
    switch (element) {
      case "settings":
        return (
          <div className="relative bg-gray-900 rounded-lg p-4 border border-gray-700">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="text-[#C6D600] font-bold">Thoughtmarks</div>
                <div className="text-xs text-[#C6D600]">bookmarks for your brain</div>
              </div>
              <div className="relative">
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  <Settings className="w-6 h-6" />
                </Button>
                <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-[#C6D600] animate-pulse" />
              </div>
            </div>
          </div>
        );
      case "new-button":
        return (
          <div className="relative bg-gray-900 rounded-lg p-4 border border-gray-700">
            <div className="relative">
              <div className="p-1 rounded-xl bg-gradient-to-r from-[#C6D600] to-[#00D9FF]">
                <Button className="w-full text-[#C6D600] font-bold py-8 text-lg bg-gradient-to-r from-black to-blue-900 hover:opacity-90">
                  <Plus className="w-6 h-6 mr-2" />
                  NEW THOUGHTMARK
                </Button>
              </div>
              <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-[#C6D600] animate-pulse" />
            </div>
          </div>
        );
      case "ai-tools":
        return (
          <div className="relative bg-gray-900 rounded-lg p-4 border border-gray-700">
            <div className="relative border-2 border-yellow-400 rounded-lg p-4 bg-yellow-400/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Brain className="w-6 h-6 text-yellow-400" />
                  <span className="text-yellow-400 font-bold">AI Tools</span>
                  <div className="w-5 h-5 text-yellow-400">👑</div>
                </div>
                <div className="text-yellow-400">→</div>
              </div>
              <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-[#C6D600] animate-pulse" />
            </div>
          </div>
        );
      case "search":
        return (
          <div className="relative bg-gray-900 rounded-lg p-4 border border-gray-700">
            <div className="relative border border-gray-600 rounded-lg p-3 bg-gray-800">
              <div className="flex items-center gap-2">
                <Search className="w-5 h-5 text-gray-400" />
                <span className="text-gray-400">Search your thoughts...</span>
              </div>
              <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-[#C6D600] animate-pulse" />
            </div>
          </div>
        );
      case "voice":
        return (
          <div className="relative bg-gray-900 rounded-lg p-4 border border-gray-700">
            <div className="flex justify-center">
              <div className="relative bg-gray-800 rounded-full p-4 border border-gray-600">
                <div className="w-8 h-8 text-gray-400">🎤</div>
                <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-[#C6D600] animate-pulse" />
              </div>
            </div>
          </div>
        );
      default:
        return <div className="bg-gray-800 rounded-lg p-4 h-20"></div>;
    }
  };

  return (
    <div className="full-height bg-black text-white p-4">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLocation('/settings')}
          className="text-gray-400 hover:text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-xl font-bold text-[#C6D600]">ToolTips</h1>
          <p className="text-sm text-gray-400">Master your thoughtmark workflow</p>
        </div>
      </div>

      {/* Guide Items */}
      <div className="space-y-6">
        {guideItems.map((item) => (
          <Card key={item.id} className="bg-gray-900 border-gray-700 p-6">
            <div className="space-y-4">
              {/* Element Preview */}
              <div className="mb-4">
                {renderElementPreview(item.element)}
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-gray-300 mb-3">{item.description}</p>
                
                {/* Tip */}
                <div className="bg-[#C6D600]/10 border border-[#C6D600]/20 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-[#C6D600] mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-[#C6D600] mb-1">Pro Tip</div>
                      <div className="text-sm text-gray-300">{item.tip}</div>
                      {/* Premium link for AI insights */}
                      {item.id === "ai-insights-premium" && (
                        <Button
                          size="sm"
                          className="mt-2 bg-[#C6D600] text-black hover:bg-[#C6D600]/90"
                          onClick={() => setLocation("/subscribe")}
                        >
                          Explore Premium
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Footer - 5-Star Review Suggestion */}
      <div className="mt-8 text-center">
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 mb-6">
          <div className="flex justify-center mb-3">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-[#C6D600] text-xl">⭐</span>
            ))}
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Loving Thoughtmarks?</h3>
          <p className="text-gray-300 mb-4 text-sm">
            Help us spread the word! A 5-star review helps other people discover the power of organized thinking.
          </p>
          <Button
            className="bg-[#C6D600] text-black hover:bg-[#C6D600]/90 font-medium"
            onClick={() => window.open("https://apps.apple.com/app/thoughtmarks", "_blank")}
          >
            Leave a 5-Star Review
          </Button>
        </div>
        
        <p className="text-gray-500 text-sm">
          These guides help you master your thoughtmark workflow
        </p>
      </div>
    </div>
  );
}