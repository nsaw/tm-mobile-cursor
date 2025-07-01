import { PersistentLayout } from "@/components/persistent-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useLocation } from "wouter";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  HelpCircle, 
  MessageCircle, 
  Book, 
  Video, 
  Mail, 
  ExternalLink,
  Search,
  ArrowRight,
  CheckCircle,
  Lightbulb,
  Users,
  FileText,
  Mic,
  Brain,
  ArrowLeft
} from "lucide-react";

export default function Help() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [contactEmail, setContactEmail] = useState("");

  const handleBackNavigation = () => {
    setLocation("/settings");
  };

  // Add swipe gesture support
  const handleTouchStart = (e: React.TouchEvent) => {
    const touchStartX = e.touches[0].clientX;
    
    const handleTouchEnd = (endEvent: TouchEvent) => {
      const touchEndX = endEvent.changedTouches[0].clientX;
      const swipeDistance = touchEndX - touchStartX;
      
      if (swipeDistance > 100) { // Swipe right threshold
        handleBackNavigation();
      }
      
      document.removeEventListener('touchend', handleTouchEnd);
    };
    
    document.addEventListener('touchend', handleTouchEnd);
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/support/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: contactEmail,
          message: contactMessage,
        }),
      });

      if (response.ok) {
        setContactEmail("");
        setContactMessage("");
        toast({
          title: "Message sent",
          description: "We'll get back to you within 24 hours.",
        });
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      toast({
        title: "Error sending message",
        description: "Please try again or email us directly at support@thoughtmarks.app",
        variant: "destructive",
      });
    }
  };

  const commonQuestions = [
    {
      question: "How do I set up Siri voice capture?",
      answer: "Go to Settings > Voice & Shortcuts and tap 'Quick Siri Setup' to install the shortcut.",
      category: "Voice",
      icon: Mic
    },
    {
      question: "How does AI categorization work?",
      answer: "Our AI analyzes your thoughtmarks and automatically sorts them into relevant bins based on content and context.",
      category: "AI",
      icon: Brain
    },
    {
      question: "Can I organize thoughtmarks into custom bins?",
      answer: "Yes! Create custom bins from the All Bins page or when creating a new thoughtmark.",
      category: "Organization",
      icon: FileText
    },
    {
      question: "How do I search for specific thoughtmarks?",
      answer: "Use the search function to find thoughtmarks by keywords, content, or semantic meaning.",
      category: "Search",
      icon: Search
    }
  ];

  const helpCategories = [
    {
      title: "Getting Started",
      description: "Learn the basics of Thoughtmarks",
      icon: Lightbulb,
      items: [
        "Creating your first thoughtmark",
        "Understanding bins and organization",
        "Setting up voice capture",
        "Navigating the interface"
      ],
      action: () => setLocation("/overview")
    },
    {
      title: "Voice Features",
      description: "Master hands-free capture",
      icon: Mic,
      items: [
        "Siri shortcut installation",
        "Voice commands and phrases",
        "Background voice processing",
        "Troubleshooting voice issues"
      ],
      action: () => setLocation("/siri-setup")
    },
    {
      title: "AI & Smart Features",
      description: "Leverage intelligent tools",
      icon: Brain,
      items: [
        "Auto-categorization",
        "Semantic search",
        "Pattern recognition",
        "AI insights and tips"
      ],
      action: () => setLocation("/ai-tools")
    },
    {
      title: "Organization & Workflow",
      description: "Optimize your knowledge management",
      icon: FileText,
      items: [
        "Creating and managing bins",
        "Tagging strategies",
        "Archive and cleanup",
        "Collaboration features"
      ],
      action: () => setLocation("/interface-guide")
    }
  ];

  return (
    <PersistentLayout>
      <div 
        className="max-w-4xl mx-auto px-4 py-8 momentum-scroll enhanced-scroll help-content"
        onTouchStart={handleTouchStart}
      >
        {/* Back Navigation */}
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackNavigation}
            className="flex items-center gap-2 text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            Settings
          </Button>
        </div>
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl text-white mb-4 uppercase" style={{ fontFamily: 'Oswald, sans-serif', fontWeight: '600', letterSpacing: '-0.02em' }}>
            Help & Support
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Get assistance and find answers to make the most of Thoughtmarks
          </p>
        </div>

        {/* Search Help */}
        <Card className="mb-8 card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Search Help Topics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="What do you need help with?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Quick Help Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {helpCategories.map((category, index) => (
            <Card key={index} className="card-hover touch-feedback cursor-pointer" onClick={category.action}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                    <category.icon className="w-5 h-5 text-primary" />
                  </div>
                  {category.title}
                </CardTitle>
                <CardDescription>{category.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-4">
                  {category.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center gap-2 text-primary text-sm font-medium">
                  Learn more
                  <ArrowRight className="w-3 h-3" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Common Questions */}
        <div className="mb-12">
          <h2 className="text-2xl text-white mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {commonQuestions.map((faq, index) => (
              <Card key={index} className="card-hover">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-3 text-lg">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <faq.icon className="w-4 h-4 text-blue-500" />
                    </div>
                    {faq.question}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{faq.answer}</p>
                  <div className="mt-3">
                    <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                      {faq.category}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Contact Support */}
        <Card className="mb-8 card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Contact Support
            </CardTitle>
            <CardDescription>
              Can't find what you're looking for? Send us a message and we'll help you out.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div>
                <label htmlFor="contact-email" className="text-sm font-medium text-white mb-2 block">
                  Email Address
                </label>
                <Input
                  id="contact-email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="contact-message" className="text-sm font-medium text-white mb-2 block">
                  How can we help?
                </label>
                <Textarea
                  id="contact-message"
                  placeholder="Describe your question or issue..."
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  rows={4}
                  required
                />
              </div>
              
              <Button type="submit" className="w-full touch-feedback">
                <Mail className="w-4 h-4 mr-2" />
                Send Message
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Additional Resources */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="card-hover touch-feedback cursor-pointer" onClick={() => setLocation("/about")}>
            <CardContent className="p-6 text-center">
              <Book className="w-8 h-8 text-blue-500 mx-auto mb-3" />
              <h3 className="font-semibold text-white mb-2">Documentation</h3>
              <p className="text-sm text-muted-foreground">Comprehensive guides and tutorials</p>
            </CardContent>
          </Card>
          
          <Card className="card-hover touch-feedback cursor-pointer" onClick={() => window.open('https://community.thoughtmarks.app', '_blank')}>
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 text-green-500 mx-auto mb-3" />
              <h3 className="font-semibold text-white mb-2">Community</h3>
              <p className="text-sm text-muted-foreground">Connect with other users</p>
              <ExternalLink className="w-3 h-3 ml-1 inline" />
            </CardContent>
          </Card>
          
          <Card className="card-hover touch-feedback cursor-pointer" onClick={() => window.open('mailto:support@thoughtmarks.app')}>
            <CardContent className="p-6 text-center">
              <Mail className="w-8 h-8 text-purple-500 mx-auto mb-3" />
              <h3 className="font-semibold text-white mb-2">Direct Email</h3>
              <p className="text-sm text-muted-foreground">support@thoughtmarks.app</p>
              <ExternalLink className="w-3 h-3 ml-1 inline" />
            </CardContent>
          </Card>
        </div>

        {/* Response Time Notice */}
        <Card className="bg-blue-500/10 border-blue-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <HelpCircle className="w-5 h-5 text-blue-500" />
              <div>
                <h4 className="font-medium text-white">Support Response Times</h4>
                <p className="text-sm text-muted-foreground">
                  We typically respond to support requests within 24 hours. For urgent issues, please email us directly.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PersistentLayout>
  );
}