import { PersistentLayout } from "@/components/persistent-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { MessageSquare, Search, TrendingUp, Zap, ArrowLeft } from "lucide-react";
import { CanonicalHead, canonicalConfigs } from "@/components/canonical-head";

export default function AIIndex() {
  const aiPages = [
    {
      title: "Intelligent Insights",
      description: "Get AI-powered insights and intelligent analysis",
      href: "/ai/assistant",
      icon: MessageSquare,
      color: "text-blue-500"
    },
    {
      title: "AI Search",
      description: "Search your thoughtmarks using natural language",
      href: "/ai/search",
      icon: Search,
      color: "text-green-500"
    },
    {
      title: "AI Insights",
      description: "Get AI-powered insights and analytics",
      href: "/ai/insights",
      icon: TrendingUp,
      color: "text-purple-500"
    },
    {
      title: "Quick Tools",
      description: "Access AI-powered quick tools and features",
      href: "/settings/ai-tools",
      icon: Zap,
      color: "text-yellow-500"
    }
  ];

  return (
    <PersistentLayout>
      <CanonicalHead {...canonicalConfigs.ai} />
      <div className="max-w-4xl mx-auto p-6">
        {/* Back Navigation */}
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-sm text-gray-400 hover:text-[#C6D600] transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">AI-Powered Tools</h1>
          <p className="text-gray-400 text-lg">
            Harness artificial intelligence to enhance your thoughtmark experience
          </p>
        </div>

        <div className="layout-stack">
          {aiPages.map((page) => {
            const IconComponent = page.icon;
            return (
              <Link key={page.href} href={page.href}>
                <Card className="bg-gray-900 border-gray-700 hover:border-[#C6D600] transition-all duration-200 cursor-pointer group h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <IconComponent className={`w-8 h-8 ${page.color} group-hover:text-white transition-colors`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-white group-hover:text-[#C6D600] transition-colors mb-2">
                          {page.title}
                        </h3>
                        <p className="text-sm text-gray-400 leading-relaxed">
                          {page.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* AI Features Overview */}
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="p-6 bg-gray-900 rounded-lg border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-3">Smart Search</h3>
            <p className="text-gray-400 text-sm mb-4">
              Find thoughtmarks using natural language queries and semantic understanding.
            </p>
            <Link href="/ai/search">
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
                Try AI Search
              </button>
            </Link>
          </div>
          
          <div className="p-6 bg-gray-900 rounded-lg border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-3">Intelligent Assistant</h3>
            <p className="text-gray-400 text-sm mb-4">
              Get personalized insights and recommendations based on your thoughtmarks.
            </p>
            <Link href="/ai/assistant">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                Chat with AI
              </button>
            </Link>
          </div>
        </div>
      </div>
    </PersistentLayout>
  );
}