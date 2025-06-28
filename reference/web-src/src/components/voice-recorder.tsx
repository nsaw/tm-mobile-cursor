import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { Square, X } from "lucide-react";
import { voiceHandler } from "@/lib/voice-handler";

interface VoiceRecorderProps {
  isOpen: boolean;
  onClose: () => void;
  onTranscriptionComplete: (text: string) => void;
}

export function VoiceRecorder({ isOpen, onClose, onTranscriptionComplete }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recognitionRef = useRef<any>(null);
  const transcriptRef = useRef<string>("");

  // Auto-start recording when modal opens
  useEffect(() => {
    if (isOpen && !isRecording) {
      startRecording();
    }
    return () => {
      // Cleanup when closing
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (error) {
          console.log('Error stopping speech recognition:', error);
        }
      }
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
      }
    };
  }, [isOpen]);

  const startRecording = async () => {
    try {
      // Reset transcript state
      setTranscript("");
      transcriptRef.current = "";
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.onstop = () => {
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);

      // Initialize speech recognition if available
      try {
        if ('webkitSpeechRecognition' in window) {
          const recognition = new (window as any).webkitSpeechRecognition();
          recognition.continuous = true;
          recognition.interimResults = true;
          recognition.lang = 'en-US';

          recognition.onresult = (event: any) => {
            let finalTranscript = '';
            let interimTranscript = '';
            
            for (let i = event.resultIndex; i < event.results.length; i++) {
              if (event.results[i].isFinal) {
                finalTranscript += event.results[i][0].transcript;
              } else {
                interimTranscript += event.results[i][0].transcript;
              }
            }
            
            // Append final results to existing transcript
            if (finalTranscript) {
              const newTranscript = (transcriptRef.current + ' ' + finalTranscript).trim();
              transcriptRef.current = newTranscript;
              setTranscript(newTranscript);
              console.log('Final transcript updated:', newTranscript);
            }
            
            // Show interim results combined with stored transcript
            if (interimTranscript && !finalTranscript) {
              const displayTranscript = (transcriptRef.current + ' ' + interimTranscript).trim();
              setTranscript(displayTranscript);
            }
          };

          recognition.onerror = (event: any) => {
            console.error('Speech recognition error:', event.error);
          };

          recognition.onend = () => {
            console.log('Speech recognition ended');
            // Don't auto-save on end, let user control when to save
          };

          recognition.start();
          recognitionRef.current = recognition;
        }
      } catch (error) {
        console.log('Speech recognition not available:', error);
      }
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = async () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.log('Error stopping speech recognition:', error);
      }
    }

    // Process and auto-save
    const currentTranscript = transcriptRef.current;
    if (currentTranscript.trim()) {
      setIsProcessing(true);
      
      try {
        // Auto-save with AI processing to Sort Later bin
        const result = await voiceHandler.handleVoiceTranscription(currentTranscript.trim());
        
        // Brief pause to show processing complete then redirect
        setTimeout(() => {
          onClose();
          // Navigate to create page for editing
          window.location.href = result.redirectUrl;
        }, 800);
      } catch (error) {
        console.error('Error processing voice note:', error);
        // Still close on error
        setTimeout(() => {
          onClose();
        }, 500);
      }
    } else {
      onClose();
    }
  };

  const cancelRecording = () => {
    // Stop recording immediately without processing
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.log('Error stopping speech recognition:', error);
      }
    }

    // Close without processing or saving
    onClose();
  };

  if (!isOpen) return null;

  const modal = (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999
      }}
      onClick={(e) => {
        // Only cancel if clicking the backdrop, not the modal content
        if (e.target === e.currentTarget && !isProcessing) {
          cancelRecording();
        }
      }}
    >
      <div className="bg-gray-800/90 backdrop-blur-lg rounded-3xl p-8 w-full max-w-sm min-h-[400px] flex flex-col items-center justify-between relative">
        {/* Cancel button - top right */}
        {!isProcessing && (
          <Button
            onClick={cancelRecording}
            variant="ghost"
            size="sm"
            className="absolute top-4 right-4 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-full p-2 h-auto w-auto"
          >
            <X className="w-5 h-5" />
          </Button>
        )}

        {/* Top section with status */}
        <div className="text-center mb-8">
          {isProcessing ? (
            <>
              <h3 className="text-xl text-gray-300 font-light mb-2">Processing...</h3>
              <p className="text-sm text-gray-500 font-light">one sec while we process</p>
            </>
          ) : (
            <>
              <h3 className="text-xl text-gray-300 font-light mb-2">Now listening...</h3>
              <p className="text-sm text-gray-500 font-light">what's on your mind?</p>
            </>
          )}
        </div>

        {/* Transcription area */}
        <div className="flex-1 flex items-center justify-center w-full">
          {transcript ? (
            <div className="text-center text-white text-lg leading-relaxed px-4">
              {transcript}
            </div>
          ) : (
            <div className="text-center text-gray-500 text-base">
              Start speaking to see your words here
            </div>
          )}
        </div>

        {/* Stop button */}
        <div className="flex justify-center">
          {isProcessing ? (
            <div className="w-20 h-20 rounded-full bg-gray-600 border-4 border-gray-600 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <Button
              onClick={stopRecording}
              className="w-20 h-20 rounded-full bg-red-500 hover:bg-red-600 border-4 border-gray-600 transition-all duration-200 active:scale-95"
              disabled={!isRecording}
            >
              <Square className="w-8 h-8 text-white fill-white" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}