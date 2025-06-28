import { PersistentLayout } from "@/components/persistent-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { Zap, FileText, Mic, MessageSquare } from "lucide-react";

export default function AutomationIndex() {
  const automationPages = [
    {
      title: "Form Automation",
      description: "Automate form filling and data entry processes",
      href: "/settings/automation/forms",
      icon: FileText,
      color: "text-blue-500"
    },
    {
      title: "Siri Integration",
      description: "Set up voice commands and Siri shortcuts",
      href: "/settings/automation/siri",
      icon: MessageSquare,
      color: "text-purple-500"
    },
    {
      title: "Voice Commands",
      description: "Configure voice-activated thoughtmark creation",
      href: "/settings/automation/voice",
      icon: Mic,
      color: "text-green-500"
    },
    {
      title: "Quick Actions",
      description: "Set up automated workflows and triggers",
      href: "/settings/ai-tools",
      icon: Zap,
      color: "text-yellow-500"
    }
  ];

  return (
    <PersistentLayout>
      <div className="max-w-4xl mx-auto p-6">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-2 text-sm text-gray-400 mb-6">
          <Link href="/" className="hover:text-[#C6D600] transition-colors">
            Dashboard
          </Link>
          <span>/</span>
          <Link href="/settings" className="hover:text-[#C6D600] transition-colors">
            Settings
          </Link>
          <span>/</span>
          <span className="text-white">Automation</span>
        </nav>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">Automation & Integration</h1>
          <p className="text-gray-400 text-lg">
            Streamline your workflow with automated thoughtmark creation and smart integrations
          </p>
        </div>

        <div className="layout-stack">
          {automationPages.map((page) => {
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

        {/* Setup Guide */}
        <div className="mt-12 p-6 bg-gray-900 rounded-lg border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-4">Getting Started</h2>
          <div className="space-y-3 text-gray-400">
            <p>1. Configure Siri shortcuts for hands-free thoughtmark creation</p>
            <p>2. Set up form automation to capture ideas from web pages</p>
            <p>3. Enable voice commands for quick access to features</p>
          </div>
          <div className="mt-6">
            <Link href="/settings/automation/siri">
              <button className="px-4 py-2 bg-[#C6D600] text-black rounded-lg hover:bg-[#B8C500] transition-colors">
                Start with Siri Setup
              </button>
            </Link>
          </div>
        </div>
      </div>
    </PersistentLayout>
  );
}