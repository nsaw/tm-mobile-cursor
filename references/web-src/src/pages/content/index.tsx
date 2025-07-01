import { PersistentLayout } from "@/components/persistent-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { Plus, Archive, RotateCcw, List, Search, ArrowLeft } from "lucide-react";
import { CanonicalHead, canonicalConfigs } from "@/components/canonical-head";

export default function ContentIndex() {
  const contentPages = [
    {
      title: "Create Thoughtmark",
      description: "Create a new thoughtmark to capture your ideas",
      href: "/thoughtmarks/create",
      icon: Plus,
      color: "text-green-500"
    },
    {
      title: "All Thoughtmarks",
      description: "Browse and manage all your thoughtmarks",
      href: "/thoughtmarks", 
      icon: List,
      color: "text-blue-500"
    },
    {
      title: "Archive",
      description: "View archived thoughtmarks and bins",
      href: "/content/archive",
      icon: Archive,
      color: "text-yellow-500"
    },
    {
      title: "Recently Deleted",
      description: "Recover deleted thoughtmarks and bins",
      href: "/content/trash",
      icon: RotateCcw,
      color: "text-red-500"
    },
    {
      title: "Search",
      description: "Search through your thoughtmarks",
      href: "/search",
      icon: Search,
      color: "text-purple-500"
    }
  ];

  return (
    <PersistentLayout>
      <CanonicalHead {...canonicalConfigs.content} />
      <div className="max-w-4xl mx-auto p-6">
        {/* Back Navigation */}
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-sm text-gray-400 hover:text-[#C6D600] transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">Content Management</h1>
          <p className="text-gray-400 text-lg">
            Create, organize, and manage your thoughtmarks and bins. Archive and trash are shared spaces for both content types.
          </p>
        </div>

        <div className="layout-stack">
          {contentPages.map((page) => {
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

        {/* Quick Actions */}
        <div className="mt-12 p-6 bg-gray-900 rounded-lg border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/thoughtmarks/create">
              <button className="px-4 py-2 bg-[#C6D600] text-black rounded-lg hover:bg-[#B8C500] transition-colors">
                <Plus className="w-4 h-4 inline mr-2" />
                New Thoughtmark
              </button>
            </Link>
            <Link href="/thoughtmarks/all">
              <button className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors">
                <List className="w-4 h-4 inline mr-2" />
                View All
              </button>
            </Link>
          </div>
        </div>
      </div>
    </PersistentLayout>
  );
}