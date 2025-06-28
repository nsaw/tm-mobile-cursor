import { PersistentLayout } from "@/components/persistent-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { User, Shield, Lock, Settings } from "lucide-react";

export default function AccountIndex() {
  const accountPages = [
    {
      title: "Profile Settings",
      description: "Update your personal information and preferences",
      href: "/settings/account/profile",
      icon: User,
      color: "text-blue-500"
    },
    {
      title: "Privacy Settings",
      description: "Control your privacy and data sharing preferences",
      href: "/settings/account/privacy",
      icon: Shield,
      color: "text-green-500"
    },
    {
      title: "Security Settings",
      description: "Manage your account security and authentication",
      href: "/settings/account/security",
      icon: Lock,
      color: "text-red-500"
    },
    {
      title: "Account Management",
      description: "General account settings and preferences",
      href: "/settings/account",
      icon: Settings,
      color: "text-gray-500"
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
          <span className="text-white">Account</span>
        </nav>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">Account Settings</h1>
          <p className="text-gray-400 text-lg">
            Manage your profile, privacy, and security settings
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {accountPages.map((page) => {
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
      </div>
    </PersistentLayout>
  );
}