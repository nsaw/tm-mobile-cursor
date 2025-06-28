import { useEffect, useState } from "react";
import { CheckCircle, Mic, AlertCircle } from "lucide-react";
import { LoadingScreen } from "@/components/loading-screen";

export default function VoiceProcessing() {
  const [status, setStatus] = useState<"processing" | "success" | "error">("processing");
  const [message, setMessage] = useState("Processing your voice note...");

  useEffect(() => {
    // Listen for voice processing events
    const handleVoiceEvent = (event: CustomEvent) => {
      const { message: eventMessage, type } = event.detail;
      setMessage(eventMessage);
      
      if (type === "success") {
        setStatus("success");
      } else if (type === "error") {
        setStatus("error");
      }
    };

    window.addEventListener('voice-note-saved', handleVoiceEvent as EventListener);

    return () => {
      window.removeEventListener('voice-note-saved', handleVoiceEvent as EventListener);
    };
  }, []);

  const getIcon = () => {
    switch (status) {
      case "processing":
        return <ProcessingLoader size="lg" />;
      case "success":
        return <CheckCircle className="w-12 h-12 text-green-500" />;
      case "error":
        return <AlertCircle className="w-12 h-12 text-red-500" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "processing":
        return "text-[#C6D600]";
      case "success":
        return "text-green-500";
      case "error":
        return "text-red-500";
    }
  };

  return (
    <div className="full-height bg-black flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="mb-6 flex justify-center">
          {getIcon()}
        </div>
        
        <div className="mb-4">
          <Mic className="w-8 h-8 text-gray-500 mx-auto mb-2" />
          <h1 className="text-xl font-semibold text-white mb-2">
            Voice Note
          </h1>
        </div>
        
        <p className={`text-sm ${getStatusColor()} mb-6`}>
          {message}
        </p>
        
        {status === "processing" && (
          <div className="space-y-2">
            <p className="text-xs text-gray-500">
              AI is processing your thoughtmark
            </p>
          </div>
        )}
        
        {status === "success" && (
          <p className="text-xs text-gray-500">
            Closing automatically...
          </p>
        )}
        
        {status === "error" && (
          <p className="text-xs text-gray-500">
            Redirecting to manual entry...
          </p>
        )}
      </div>
    </div>
  );
}