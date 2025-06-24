import { PersistentLayout } from "@/components/persistent-layout";
import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Brain, 
  Mic, 
  Search, 
  FolderOpen, 
  Zap, 
  ArrowRight,
  CheckCircle,
  Play
} from "lucide-react";

export default function Overview() {
  const [, setLocation] = useLocation();

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

  return (
    <PersistentLayout>
      <div 
        className="max-w-4xl mx-auto px-4 py-8 momentum-scroll enhanced-scroll overview-content"
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
            Welcome to Thoughtmarks
          </h1>
          <p className="text-xl text-gray-300 mb-2">
            Your Personal Knowledge Management System
          </p>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Capture fleeting thoughts without breaking your flow. Use voice commands, quick notes, or AI-powered categorization to build your personal knowledge base effortlessly.
          </p>
        </div>

        {/* Key Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/20 card-hover touch-feedback">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Mic className="w-6 h-6 text-blue-500" />
                Voice-First Capture
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Record thoughts instantly with Siri integration. Just say "Hey Siri, add to Thoughtmarks" and your ideas are automatically transcribed and categorized.
              </p>
              <div className="flex items-center gap-2 text-sm text-green-400">
                <CheckCircle className="w-4 h-4" />
                Hands-free operation
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20 card-hover touch-feedback">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Brain className="w-6 h-6 text-green-500" />
                AI-Powered Organization
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Smart categorization automatically sorts your thoughts into relevant bins. Find insights through semantic search and pattern recognition.
              </p>
              <div className="flex items-center gap-2 text-sm text-green-400">
                <CheckCircle className="w-4 h-4" />
                Intelligent sorting
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20 card-hover touch-feedback">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Search className="w-6 h-6 text-purple-500" />
                Semantic Search
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Find thoughtmarks by meaning, not just keywords. Our AI understands context and relationships between your ideas.
              </p>
              <div className="flex items-center gap-2 text-sm text-green-400">
                <CheckCircle className="w-4 h-4" />
                Contextual discovery
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/20 card-hover touch-feedback">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <FolderOpen className="w-6 h-6 text-orange-500" />
                Smart Organization
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Organize thoughts into bins like Relevant, Life Hacks, Quotes, and more. Create custom collections that match your thinking patterns.
              </p>
              <div className="flex items-center gap-2 text-sm text-green-400">
                <CheckCircle className="w-4 h-4" />
                Flexible structure
              </div>
            </CardContent>
          </Card>
        </div>

        {/* How It Works */}
        <div className="mb-12">
          <h2 className="text-2xl text-white mb-6 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mic className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">1. Capture</h3>
              <p className="text-gray-400">
                Use voice commands, quick notes, or manual entry to capture thoughts instantly
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">2. Organize</h3>
              <p className="text-gray-400">
                AI automatically categorizes and tags your thoughtmarks for easy retrieval
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-purple-500" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">3. Discover</h3>
              <p className="text-gray-400">
                Find connections and insights through powerful search and AI recommendations
              </p>
            </div>
          </div>
        </div>

        {/* Quick Start */}
        <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Play className="w-6 h-6 text-primary" />
              Quick Start Guide
            </CardTitle>
            <CardDescription>
              Get started with Thoughtmarks in just a few steps
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="justify-start h-auto p-4 card-hover touch-feedback"
                onClick={() => setLocation("/thoughtmarks/create")}
              >
                <div className="text-left">
                  <div className="font-medium">Create Your First Thoughtmark</div>
                  <div className="text-sm text-muted-foreground">Start capturing your ideas</div>
                </div>
                <ArrowRight className="w-4 h-4 ml-auto" />
              </Button>
              
              <Button
                variant="outline"
                className="justify-start h-auto p-4 card-hover touch-feedback"
                onClick={() => setLocation("/siri-setup")}
              >
                <div className="text-left">
                  <div className="font-medium">Set Up Voice Capture</div>
                  <div className="text-sm text-muted-foreground">Install Siri shortcuts</div>
                </div>
                <ArrowRight className="w-4 h-4 ml-auto" />
              </Button>
              
              <Button
                variant="outline"
                className="justify-start h-auto p-4 card-hover touch-feedback"
                onClick={() => setLocation("/interface-guide")}
              >
                <div className="text-left">
                  <div className="font-medium">Learn the Interface</div>
                  <div className="text-sm text-muted-foreground">Master the workflow</div>
                </div>
                <ArrowRight className="w-4 h-4 ml-auto" />
              </Button>
              
              <Button
                variant="outline"
                className="justify-start h-auto p-4 card-hover touch-feedback"
                onClick={() => setLocation("/all-bins")}
              >
                <div className="text-left">
                  <div className="font-medium">Explore Organization</div>
                  <div className="text-sm text-muted-foreground">See all your bins</div>
                </div>
                <ArrowRight className="w-4 h-4 ml-auto" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Get Started */}
        <div className="text-center">
          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 card-hover touch-feedback"
            onClick={() => setLocation("/dashboard")}
          >
            Get Started
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </PersistentLayout>
  );
}