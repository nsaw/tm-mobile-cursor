import { apiRequest } from "@/lib/queryClient";

export interface VoiceNoteData {
  transcript: string;
  binId?: number;
  timestamp: Date;
}

export class VoiceHandler {
  private static instance: VoiceHandler;
  
  static getInstance(): VoiceHandler {
    if (!VoiceHandler.instance) {
      VoiceHandler.instance = new VoiceHandler();
    }
    return VoiceHandler.instance;
  }

  constructor() {
    // Initialize background voice note processing
    this.initializeBackgroundHandling();
  }

  private initializeBackgroundHandling(): void {
    // Listen for Siri shortcut voice notes sent via URL parameters
    if (typeof window !== 'undefined') {
      this.checkForSiriShortcutVoiceNote();
      
      // Listen for app focus events to check for pending voice notes
      window.addEventListener('focus', this.checkForSiriShortcutVoiceNote.bind(this));
      
      // Listen for visibility change (app coming to foreground)
      document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
          this.checkForSiriShortcutVoiceNote();
        }
      });
    }
  }

  private checkForSiriShortcutVoiceNote(): void {
    const urlParams = new URLSearchParams(window.location.search);
    const voiceText = urlParams.get('voice');
    
    if (voiceText && voiceText.trim()) {
      // Process voice note from any voice parameter
      console.log('Processing voice note:', voiceText);
      this.handleBackgroundVoiceNote(decodeURIComponent(voiceText));
      
      // Clean up URL parameters and redirect to dashboard
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  }

  private async handleBackgroundVoiceNote(transcript: string): Promise<void> {
    try {
      // Show immediate processing feedback
      this.showNotification(`Processing voice note: "${transcript.substring(0, 50)}..."`, "success");
      
      const result = await this.handleVoiceTranscription(transcript);
      
      if (result.thoughtmarkId) {
        // Show success notification
        this.showNotification(`✓ Voice note saved successfully`, "success");
        
        // Automatically close the browser tab/window after a brief delay
        // This mimics the background behavior users expect
        setTimeout(() => {
          // Try to close the window (works if opened by script)
          if (window.opener || window.history.length === 1) {
            window.close();
          } else {
            // If can't close, redirect to dashboard
            window.location.href = "/dashboard";
          }
        }, 1500);
      }
    } catch (error) {
      console.error('Failed to process background voice note:', error);
      this.showNotification("Failed to save voice note - please try again", "error");
      
      // On error, redirect to create page with the text pre-filled
      setTimeout(() => {
        window.location.href = `/create?text=${encodeURIComponent(transcript)}`;
      }, 2000);
    }
  }

  async saveVoiceNote(data: VoiceNoteData): Promise<boolean> {
    try {
      // Find Sort Later bin if no specific bin provided
      let targetBinId = data.binId;
      
      if (!targetBinId) {
        const binsResponse = await apiRequest("GET", "/api/bins");
        const bins = await binsResponse.json();
        const sortLaterBin = bins.find((bin: any) => bin.name === "Sort Later");
        targetBinId = sortLaterBin?.id;
      }

      const thoughtmarkData = {
        title: `Voice Note - ${data.timestamp.toLocaleDateString()}`,
        content: data.transcript,
        tags: ["voice"],
        binId: targetBinId,
        attachments: []
      };

      const response = await apiRequest("POST", "/api/thoughtmarks", thoughtmarkData);
      
      if (response.ok) {
        const createdThoughtmark = await response.json();
        this.lastCreatedThoughtmarkId = createdThoughtmark.id;
        
        // Show success notification
        this.showNotification("Voice note saved to Sort Later", "success");
        return true;
      } else {
        throw new Error("Failed to save voice note");
      }
    } catch (error) {
      console.error("Error saving voice note:", error);
      this.showNotification("Failed to save voice note", "error");
      return false;
    }
  }

  private showNotification(message: string, type: "success" | "error"): void {
    // Create toast notification
    const event = new CustomEvent('voice-note-saved', {
      detail: { message, type }
    });
    window.dispatchEvent(event);

    // Show browser notification if permission granted
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Thoughtmarks', {
        body: message,
        icon: '/favicon.ico',
        tag: 'voice-note'
      });
    }
  }

  async handleVoiceTranscription(transcript: string): Promise<{ thoughtmarkId: number | null; redirectUrl: string }> {
    if (!transcript.trim()) return { thoughtmarkId: null, redirectUrl: "/" };

    try {
      // Find appropriate bin based on user template
      const binsResponse = await apiRequest("GET", "/api/bins");
      const bins = await binsResponse.json();
      
      // Always default to Sort Later bin for voice notes
      const targetBin = bins.find((bin: any) => bin.name === "Sort Later");
      
      // Generate AI-suggested title
      let aiTitle = "Voice Note";
      try {
        const aiResponse = await apiRequest('POST', '/api/ai/voice-title', {
          content: transcript.trim()
        });
        const aiData = await aiResponse.json();
        if (aiData.title) {
          aiTitle = aiData.title;
        }
      } catch (aiError) {
        console.log('AI title generation failed, using fallback');
        // Fallback: use first 6 words as title
        const words = transcript.trim().split(' ');
        aiTitle = words.length > 6 ? words.slice(0, 6).join(' ') + '...' : transcript.trim();
      }
      
      const thoughtmarkData = {
        title: aiTitle,
        content: transcript.trim(),
        tags: ["voice"],
        binId: targetBin?.id,
        attachments: []
      };

      const response = await apiRequest("POST", "/api/thoughtmarks", thoughtmarkData);
      
      if (response.ok) {
        const createdThoughtmark = await response.json();
        this.lastCreatedThoughtmarkId = createdThoughtmark.id;
        
        // Show success notification
        this.showNotification(`Voice note "${aiTitle}" saved to Sort Later`, "success");
        
        // Return redirect URL to edit page instead of view page
        const redirectUrl = `/thoughtmark/${createdThoughtmark.id}?mode=edit`;
        return { thoughtmarkId: this.lastCreatedThoughtmarkId, redirectUrl };
      } else {
        throw new Error("Failed to save voice note");
      }
    } catch (error) {
      console.error("Error processing voice note:", error);
      // Fallback to basic save
      const voiceData: VoiceNoteData = {
        transcript: transcript.trim(),
        timestamp: new Date()
      };
      const success = await this.saveVoiceNote(voiceData);
      
      // Still redirect to create page with content
      const redirectUrl = `/create?content=${encodeURIComponent(transcript.trim())}&voice=true`;
      return { 
        thoughtmarkId: success ? this.lastCreatedThoughtmarkId : null, 
        redirectUrl 
      };
    }
  }

  private lastCreatedThoughtmarkId: number | null = null;
}

export const voiceHandler = VoiceHandler.getInstance();