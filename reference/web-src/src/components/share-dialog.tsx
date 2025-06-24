import { useState } from "react";
import { Share2, Copy, Twitter, Linkedin, Facebook, MessageCircle, Mail, FileText, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { socialSharingManager, type ShareOptions } from "@/lib/social-sharing";
import type { ThoughtmarkWithBin } from "@shared/schema";

interface ShareDialogProps {
  thoughtmark: ThoughtmarkWithBin;
  trigger?: React.ReactNode;
}

export function ShareDialog({ thoughtmark, trigger }: ShareDialogProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [shareOptions, setShareOptions] = useState<ShareOptions>({
    includePersonalInfo: false,
    includeTimestamp: true,
    includeTags: true,
    includeBin: false
  });

  const handleShareOptionChange = (key: keyof ShareOptions, value: boolean) => {
    setShareOptions(prev => ({ ...prev, [key]: value }));
  };

  const handleCopyToClipboard = async () => {
    try {
      await socialSharingManager.shareToClipboard(thoughtmark, shareOptions, user?.id);
      toast({
        title: "Copied to clipboard",
        description: "Thoughtmark copied and ready to share",
      });
      setIsOpen(false);
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Unable to copy to clipboard",
        variant: "destructive"
      });
    }
  };

  const handleWebShare = async () => {
    try {
      await socialSharingManager.shareViaWebShareImage(thoughtmark, shareOptions, user?.id);
      setIsOpen(false);
    } catch (error) {
      // Fallback to copy if Web Share API not supported
      handleCopyToClipboard();
    }
  };

  const handleXShare = () => {
    try {
      socialSharingManager.shareToX(thoughtmark, shareOptions, user?.id);
      toast({
        title: "Opening X",
        description: "Thoughtmark copied and opening X/Twitter",
      });
      setIsOpen(false);
    } catch (error) {
      toast({
        title: "Share failed",
        description: "Unable to open X. Content copied to clipboard instead.",
        variant: "destructive"
      });
    }
  };

  const handleLinkedInShare = () => {
    try {
      socialSharingManager.shareToLinkedIn(thoughtmark, shareOptions, user?.id);
      toast({
        title: "Opening LinkedIn",
        description: "Opening LinkedIn sharing dialog",
      });
      setIsOpen(false);
    } catch (error) {
      toast({
        title: "Share failed",
        description: "Unable to open LinkedIn. Content copied to clipboard instead.",
        variant: "destructive"
      });
    }
  };

  const handleFacebookShare = async () => {
    try {
      await socialSharingManager.shareToFacebook(thoughtmark, shareOptions, user?.id);
      toast({
        title: "Facebook image ready",
        description: "Rendered thoughtmark ready for Facebook sharing",
      });
      setIsOpen(false);
    } catch (error) {
      toast({
        title: "Share failed",
        description: "Unable to generate Facebook image",
        variant: "destructive"
      });
    }
  };



  const handleInstagramShare = async () => {
    try {
      await socialSharingManager.shareToInstagram(thoughtmark, shareOptions, user?.id);
      toast({
        title: "Instagram image ready",
        description: "Rendered thoughtmark ready for Instagram sharing",
      });
      setIsOpen(false);
    } catch (error) {
      toast({
        title: "Share failed",
        description: "Unable to generate Instagram image",
        variant: "destructive"
      });
    }
  };

  const handleThreadsShare = () => {
    socialSharingManager.shareToThreads(thoughtmark, shareOptions);
    setIsOpen(false);
  };



  const handleEmailShare = () => {
    socialSharingManager.shareViaEmail(thoughtmark, shareOptions);
    setIsOpen(false);
  };

  const handleMarkdownExport = async () => {
    try {
      const markdown = socialSharingManager.generateMarkdownForThoughtmark(thoughtmark, shareOptions);
      await navigator.clipboard.writeText(markdown);
      toast({
        title: "Markdown copied",
        description: "Thoughtmark copied in Markdown format",
      });
      setIsOpen(false);
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Unable to generate Markdown",
        variant: "destructive"
      });
    }
  };

  const handleRedditShare = async () => {
    try {
      await socialSharingManager.shareToReddit(thoughtmark, shareOptions, user?.id);
      toast({
        title: "Reddit image ready",
        description: "Rendered thoughtmark ready for Reddit sharing",
      });
      setIsOpen(false);
    } catch (error) {
      toast({
        title: "Share failed",
        description: "Unable to generate Reddit image",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Share2 className="w-4 h-4" />
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Share2 className="w-5 h-5 text-[#C6D600]" />
            <span>Share Thoughtmark</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Share Options */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-300">Share Options</h4>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="includeTags" className="text-sm">Include tags</Label>
                <Switch
                  id="includeTags"
                  checked={shareOptions.includeTags}
                  onCheckedChange={(value) => handleShareOptionChange('includeTags', value)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="includeTimestamp" className="text-sm">Include date</Label>
                <Switch
                  id="includeTimestamp"
                  checked={shareOptions.includeTimestamp}
                  onCheckedChange={(value) => handleShareOptionChange('includeTimestamp', value)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="includeBin" className="text-sm">Include collection</Label>
                <Switch
                  id="includeBin"
                  checked={shareOptions.includeBin}
                  onCheckedChange={(value) => handleShareOptionChange('includeBin', value)}
                />
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-300">Quick Share</h4>
            
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={handleWebShare}
                variant="outline"
                className="justify-start text-sm"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Native Share
              </Button>
              
              <Button
                onClick={handleCopyToClipboard}
                variant="outline"
                className="justify-start text-sm"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Text
              </Button>
              
              <Button
                onClick={handleMarkdownExport}
                variant="outline"
                className="justify-start text-sm"
              >
                <FileText className="w-4 h-4 mr-2" />
                Markdown
              </Button>
              
              <Button
                onClick={handleEmailShare}
                variant="outline"
                className="justify-start text-sm"
              >
                <Mail className="w-4 h-4 mr-2" />
                Email
              </Button>
            </div>
          </div>

          {/* Social Platforms */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-300">Social Platforms</h4>
            
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={handleXShare}
                variant="outline"
                className="justify-start text-sm bg-blue-600/10 border-blue-600/20 hover:bg-blue-600/20"
              >
                <Twitter className="w-4 h-4 mr-2" />
                X
              </Button>
              
              <Button
                onClick={handleLinkedInShare}
                variant="outline"
                className="justify-start text-sm bg-blue-700/10 border-blue-700/20 hover:bg-blue-700/20"
              >
                <Linkedin className="w-4 h-4 mr-2" />
                LinkedIn
              </Button>
              
              <Button
                onClick={handleFacebookShare}
                variant="outline"
                className="justify-start text-sm bg-blue-800/10 border-blue-800/20 hover:bg-blue-800/20"
              >
                <Facebook className="w-4 h-4 mr-2" />
                Facebook
              </Button>
              
              <Button
                onClick={handleInstagramShare}
                variant="outline"
                className="justify-start text-sm bg-pink-600/10 border-pink-600/20 hover:bg-pink-600/20"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Instagram
              </Button>
              
              <Button
                onClick={handleThreadsShare}
                variant="outline"
                className="justify-start text-sm bg-purple-600/10 border-purple-600/20 hover:bg-purple-600/20"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Threads
              </Button>
              

              
              <Button
                onClick={handleRedditShare}
                variant="outline"
                className="justify-start text-sm bg-orange-600/10 border-orange-600/20 hover:bg-orange-600/20"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Reddit
              </Button>
            </div>
          </div>

          {/* Preview */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-300">Preview</h4>
            <div className="bg-gray-800 rounded-lg p-3 text-xs text-gray-400 max-h-32 overflow-y-auto">
              <div className="whitespace-pre-wrap">
                {socialSharingManager.generateShareText(thoughtmark, shareOptions)}
              </div>
              {user && (
                <div className="mt-2 pt-2 border-t border-gray-700 text-xs text-gray-500">
                  Shared by: {user.displayName || user.firstName || 'Anonymous'} via Thoughtmarks
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface ShareButtonProps {
  thoughtmark: ThoughtmarkWithBin;
  variant?: "default" | "icon";
}

export function ShareButton({ thoughtmark, variant = "icon" }: ShareButtonProps) {
  if (variant === "icon") {
    return (
      <ShareDialog 
        thoughtmark={thoughtmark}
        trigger={
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-white">
            <Share2 className="w-4 h-4" />
          </Button>
        }
      />
    );
  }

  return (
    <ShareDialog 
      thoughtmark={thoughtmark}
      trigger={
        <Button variant="outline" size="sm" className="text-sm">
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
      }
    />
  );
}