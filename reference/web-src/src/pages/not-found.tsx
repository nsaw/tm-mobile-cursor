import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, Search, Brain, Lightbulb } from "lucide-react";
import { useLocation } from "wouter";

export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <div className="full-height w-full flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-lg mx-4 bg-card border-border">
        <CardContent className="pt-8 pb-6 text-center">
          <div className="mb-6">
            <div className="relative inline-block">
              <div className="text-8xl font-bold text-primary/20">404</div>
              <Brain className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 text-primary animate-pulse" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-foreground mb-2">
            Oops! This thoughtmark got lost
          </h1>
          
          <p className="text-muted-foreground mb-6 leading-relaxed">
            Looks like this page wandered off into the digital void. Don't worry though - 
            even the best ideas sometimes take unexpected detours before finding their home.
          </p>

          <div className="space-y-3">
            <Button 
              onClick={() => setLocation("/")}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              size="lg"
            >
              <Home className="w-5 h-5 mr-2" />
              Take Me Home
            </Button>
            
            <div className="flex gap-2">
              <Button 
                onClick={() => setLocation("/search")}
                variant="outline"
                className="flex-1"
              >
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
              
              <Button 
                onClick={() => setLocation("/thoughtmarks/create")}
                variant="outline"
                className="flex-1"
              >
                <Lightbulb className="w-4 h-4 mr-2" />
                Create
              </Button>
            </div>
          </div>

          <div className="mt-6 text-xs text-muted-foreground">
            "Not all who wander are lost... but this page definitely is."
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
