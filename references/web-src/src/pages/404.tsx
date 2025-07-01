import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { PersistentLayout } from "@/components/persistent-layout";
import { ContentBackButton } from "@/components/ui/BackButton";
import brainImage from "@assets/SVG/brains-4.svg";

export default function NotFoundPage() {
  const [, setLocation] = useLocation();

  const goHome = () => {
    setLocation('/');
  };

  return (
    <PersistentLayout>
      <div className="max-w-md mx-auto px-4 py-8 text-center">
        <div className="mb-8">
          <div className="mb-6 flex justify-center">
            <img 
              src={brainImage} 
              alt="Brain illustration" 
              className="w-32 h-32 opacity-50"
            />
          </div>
          <h1 className="text-6xl font-bold text-white mb-4">404</h1>
          <h2 className="text-2xl text-white mb-2">Page Not Found</h2>
          <p className="text-gray-400">The page you're looking for doesn't exist.</p>
        </div>

        <div className="space-y-4">
          <div className="flex justify-center mb-4">
            <ContentBackButton />
          </div>
          <Button
            variant="outline"
            onClick={goHome}
            className="w-full border-gray-600 text-white hover:bg-gray-800"
          >
            <Home className="w-4 h-4 mr-2" />
            Go Home
          </Button>
        </div>
      </div>
    </PersistentLayout>
  );
}