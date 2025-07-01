import { PersistentLayout } from "@/components/persistent-layout";
import { Link } from "wouter";
import { FileText, Shield, Cookie, Scale } from "lucide-react";

export default function LegalIndex() {
  const legalPages = [
    {
      title: "Privacy Policy",
      description: "How we collect, use, and protect your personal information",
      href: "/settings/legal/privacy",
      icon: Shield,
      lastUpdated: "Updated recently"
    },
    {
      title: "Terms of Service",
      description: "Your agreement to use Thoughtmarks and our services",
      href: "/settings/legal/terms",
      icon: FileText,
      lastUpdated: "Updated recently"
    },
    {
      title: "Liability Limitations",
      description: "Service limitations and liability protections",
      href: "/settings/legal/liability",
      icon: Scale,
      lastUpdated: "Updated recently"
    },
    {
      title: "Dispute Resolution",
      description: "How we handle conflicts and disagreements",
      href: "/settings/legal/dispute-resolution",
      icon: FileText,
      lastUpdated: "Updated recently"
    },
    {
      title: "Intellectual Property",
      description: "Rights, ownership, and usage guidelines",
      href: "/settings/legal/intellectual-property",
      icon: Shield,
      lastUpdated: "Updated recently"
    },
    {
      title: "Cookie Policy",
      description: "How we use cookies and similar tracking technologies",
      href: "/legal/cookies",
      icon: Cookie,
      lastUpdated: "Updated recently"
    }
  ];

  return (
    <PersistentLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl text-white mb-2 uppercase" style={{ fontFamily: 'Oswald, sans-serif', fontWeight: '600', letterSpacing: '-0.02em' }}>
            LEGAL DOCUMENTS
          </h1>
          <p className="text-gray-400">Important legal information and policies</p>
        </div>

        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {legalPages.map((page) => {
              const IconComponent = page.icon;
              return (
                <Link key={page.href} href={page.href}>
                  <div className="bg-gray-900 rounded-lg p-6 border border-gray-700 hover:border-[#C6D600] transition-colors cursor-pointer group">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <IconComponent className="w-6 h-6 text-[#C6D600] group-hover:text-white transition-colors" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-medium text-white group-hover:text-[#C6D600] transition-colors">
                          {page.title}
                        </h3>
                        <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                          {page.description}
                        </p>
                        <p className="text-xs text-gray-500 mt-3">
                          {page.lastUpdated}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-medium text-white mb-4">Quick Summary</h3>
            <div className="space-y-4 text-gray-300">
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-[#C6D600] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Privacy First</p>
                  <p className="text-sm text-gray-400">We collect minimal data and never sell your information</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <FileText className="w-5 h-5 text-[#C6D600] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Fair Terms</p>
                  <p className="text-sm text-gray-400">Clear, user-friendly terms without hidden clauses</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Scale className="w-5 h-5 text-[#C6D600] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Your Rights</p>
                  <p className="text-sm text-gray-400">Full data portability and deletion rights</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center py-6 border-t border-gray-700">
            <p className="text-sm text-gray-500">
              Questions about our legal policies? Contact us at{" "}
              <a href="mailto:legal@thoughtmarks.app" className="text-[#C6D600] hover:underline">
                legal@thoughtmarks.app
              </a>
            </p>
          </div>
        </div>
      </div>
    </PersistentLayout>
  );
}