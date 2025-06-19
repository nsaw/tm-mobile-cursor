import { Link } from "wouter";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbNavProps {
  items: BreadcrumbItem[];
  showHome?: boolean;
}

export function BreadcrumbNav({ items, showHome = true }: BreadcrumbNavProps) {
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-400 mb-6" aria-label="Breadcrumb">
      {showHome && (
        <>
          <Link href="/" className="hover:text-[#C6D600] transition-colors flex items-center">
            <Home className="w-4 h-4 mr-1" />
            Dashboard
          </Link>
          <ChevronRight className="w-4 h-4" />
        </>
      )}
      
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          {item.href ? (
            <Link href={item.href} className="hover:text-[#C6D600] transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-white font-medium">{item.label}</span>
          )}
          {index < items.length - 1 && (
            <ChevronRight className="w-4 h-4" />
          )}
        </div>
      ))}
    </nav>
  );
}

// Predefined breadcrumb configurations for common hierarchies
export const breadcrumbConfigs = {
  content: [
    { label: "Content Management", href: "/content" }
  ],
  bins: [
    { label: "Collections", href: "/bins" }
  ],
  ai: [
    { label: "AI Tools", href: "/ai" }
  ],
  settings: [
    { label: "Settings", href: "/settings" }
  ],
  settingsAccount: [
    { label: "Settings", href: "/settings" },
    { label: "Account", href: "/settings/account" }
  ],
  settingsAutomation: [
    { label: "Settings", href: "/settings" },
    { label: "Automation", href: "/settings/automation" }
  ],
  settingsInterface: [
    { label: "Settings", href: "/settings" },
    { label: "Interface", href: "/settings/interface" }
  ],
  settingsHelp: [
    { label: "Settings", href: "/settings" },
    { label: "Help", href: "/settings/help" }
  ],
  settingsLegal: [
    { label: "Settings", href: "/settings" },
    { label: "Legal", href: "/settings/legal" }
  ]
};