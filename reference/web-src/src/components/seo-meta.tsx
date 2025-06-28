import { useEffect } from "react";
import { useLocation } from "wouter";

interface SEOMetaProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  type?: string;
}

const defaultMeta = {
  title: "Thoughtmarks - AI-Powered Note Taking & Thought Organization",
  description: "Capture thoughts with voice, organize with AI, discover connections. The intelligent way to manage your ideas and boost productivity.",
  keywords: [
    "note taking app",
    "voice notes",
    "AI notes",
    "thought organization",
    "knowledge management",
    "productivity app",
    "idea capture",
    "digital brain",
    "smart notes",
    "voice to text"
  ],
  image: "/og-image.png",
  type: "website"
};

const pageMeta = {
  "/": {
    title: "Thoughtmarks - Your AI-Powered Second Brain",
    description: "Transform scattered thoughts into organized knowledge. Voice recording, AI organization, and smart connections for maximum productivity.",
    keywords: ["dashboard", "home", "thoughtmarks", "AI organization"]
  },
  "/create": {
    title: "Create New Thoughtmark - Capture Your Ideas",
    description: "Quickly capture thoughts with voice or text. AI automatically organizes and categorizes your ideas for easy retrieval.",
    keywords: ["create", "new note", "voice recording", "idea capture"]
  },
  "/search": {
    title: "Search Your Thoughts - Find Any Idea Instantly",
    description: "Powerful search across all your thoughtmarks. Find ideas by content, tags, or let AI discover hidden connections.",
    keywords: ["search", "find notes", "AI search", "thought discovery"]
  },
  "/all-bins": {
    title: "Organize Thoughts - Smart Collections & Bins",
    description: "Organize your ideas into smart collections. Custom bins help categorize and structure your knowledge base.",
    keywords: ["organization", "bins", "collections", "categories"]
  },
  "/tasks": {
    title: "Task Management - Turn Thoughts into Action",
    description: "Convert thoughtmarks into actionable tasks. Track progress and never lose sight of important ideas.",
    keywords: ["tasks", "todo", "productivity", "action items"]
  },
  "/ai-assistant": {
    title: "AI Assistant - Intelligent Thought Analysis",
    description: "Let AI analyze your thoughts, find patterns, and suggest improvements. Unlock insights from your knowledge base.",
    keywords: ["AI assistant", "thought analysis", "insights", "patterns"]
  }
};

export function SEOMeta({ title, description, keywords, image, type }: SEOMetaProps) {
  const [location] = useLocation();

  useEffect(() => {
    const route = location.split('?')[0];
    const meta = pageMeta[route as keyof typeof pageMeta] || {};
    
    const finalTitle = title || meta.title || defaultMeta.title;
    const finalDescription = description || meta.description || defaultMeta.description;
    const finalKeywords = keywords || meta.keywords || defaultMeta.keywords;
    const finalImage = image || defaultMeta.image;
    const finalType = type || defaultMeta.type;

    // Update document title
    document.title = finalTitle;

    // Update meta tags
    updateMetaTag('description', finalDescription);
    updateMetaTag('keywords', finalKeywords.join(', '));
    
    // Open Graph tags
    updateMetaProperty('og:title', finalTitle);
    updateMetaProperty('og:description', finalDescription);
    updateMetaProperty('og:image', finalImage);
    updateMetaProperty('og:type', finalType);
    updateMetaProperty('og:url', window.location.href);
    
    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', finalTitle);
    updateMetaTag('twitter:description', finalDescription);
    updateMetaTag('twitter:image', finalImage);
    
    // App-specific meta tags
    updateMetaTag('apple-mobile-web-app-title', 'Thoughtmarks');
    updateMetaTag('application-name', 'Thoughtmarks');
    updateMetaTag('mobile-web-app-capable', 'yes');
    updateMetaTag('apple-mobile-web-app-status-bar-style', 'black-translucent');
    
    // SEO enhancement tags
    updateMetaTag('robots', 'index, follow');
    updateMetaTag('author', 'Thoughtmarks');
    updateMetaTag('viewport', 'width=device-width, initial-scale=1.0');
    updateMetaTag('theme-color', '#C6D600');
    
  }, [location, title, description, keywords, image, type]);

  return null;
}

function updateMetaTag(name: string, content: string) {
  let element = document.querySelector(`meta[name="${name}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute('name', name);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function updateMetaProperty(property: string, content: string) {
  let element = document.querySelector(`meta[property="${property}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute('property', property);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}