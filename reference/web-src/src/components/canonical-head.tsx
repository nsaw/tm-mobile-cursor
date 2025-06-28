import { useEffect } from "react";
import { useLocation } from "wouter";

interface CanonicalHeadProps {
  title?: string;
  description?: string;
  canonicalPath?: string;
}

export function CanonicalHead({ 
  title = "Thoughtmarks - Bookmarks for Your Brain",
  description = "Personal knowledge management with AI-powered voice recording and intelligent organization.",
  canonicalPath
}: CanonicalHeadProps) {
  const [location] = useLocation();
  const baseUrl = "https://thoughtmarks.app";
  
  // Determine canonical URL - use provided path or current location
  const canonical = canonicalPath 
    ? `${baseUrl}${canonicalPath}`
    : `${baseUrl}${location}`;

  useEffect(() => {
    // Update document title
    document.title = title;
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = description;
      document.head.appendChild(meta);
    }
    
    // Update canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (canonicalLink) {
      canonicalLink.href = canonical;
    } else {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      canonicalLink.href = canonical;
      document.head.appendChild(canonicalLink);
    }
    
    // Update Open Graph tags
    const updateOgTag = (property: string, content: string) => {
      let ogTag = document.querySelector(`meta[property="${property}"]`);
      if (ogTag) {
        ogTag.setAttribute('content', content);
      } else {
        ogTag = document.createElement('meta');
        ogTag.setAttribute('property', property);
        ogTag.setAttribute('content', content);
        document.head.appendChild(ogTag);
      }
    };
    
    updateOgTag('og:title', title);
    updateOgTag('og:description', description);
    updateOgTag('og:url', canonical);
    updateOgTag('og:type', 'website');
    
  }, [title, description, canonical, location]);

  return null;
}

// Predefined canonical configurations for common pages
export const canonicalConfigs = {
  dashboard: {
    title: "Dashboard - Thoughtmarks",
    description: "Your personal knowledge management dashboard with recent thoughtmarks and collections.",
    canonicalPath: "/"
  },
  content: {
    title: "Content Management - Thoughtmarks", 
    description: "Manage all your thoughtmarks with powerful organization and search tools.",
    canonicalPath: "/content"
  },
  bins: {
    title: "Collections - Thoughtmarks",
    description: "Organize thoughtmarks into smart collections and bins for better knowledge management.",
    canonicalPath: "/bins"
  },
  ai: {
    title: "AI Tools - Thoughtmarks",
    description: "AI-powered insights, search, and intelligent organization for your thoughtmarks.",
    canonicalPath: "/ai"
  },
  settings: {
    title: "Settings - Thoughtmarks",
    description: "Configure your Thoughtmarks experience, automation, and account preferences.",
    canonicalPath: "/settings"
  }
};