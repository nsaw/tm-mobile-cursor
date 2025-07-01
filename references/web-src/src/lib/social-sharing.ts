import type { ThoughtmarkWithBin } from "@shared/schema";
import { thoughtmarkRenderer, ThoughtmarkRenderer } from "./thoughtmark-renderer-v2";

export interface ShareableThoughtmark {
  id: number;
  title: string;
  content: string;
  tags: string[];
  binName?: string;
  createdAt: string;
  sharedBy?: string;
  shareUrl?: string;
}

export interface ShareOptions {
  includePersonalInfo: boolean;
  includeTimestamp: boolean;
  includeTags: boolean;
  includeBin: boolean;
}

export class SocialSharingManager {
  generateShareText(thoughtmark: ThoughtmarkWithBin, options: ShareOptions): string {
    let shareText = `💭 ${thoughtmark.title}\n\n`;
    shareText += `${thoughtmark.content}\n\n`;
    
    if (options.includeTags && thoughtmark.tags?.length) {
      shareText += `Tags: ${thoughtmark.tags.join(', ')}\n`;
    }
    
    if (options.includeBin && thoughtmark.binName) {
      shareText += `Collection: ${thoughtmark.binName}\n`;
    }
    
    if (options.includeTimestamp) {
      shareText += `Captured: ${new Date(thoughtmark.createdAt).toLocaleDateString()}\n`;
    }
    
    shareText += `\nShared from Thoughtmarks - bookmarks for your brain\n#MarkMyThoughts #DontForgetThisApp #Thoughtmark`;
    
    return shareText;
  }

  private generateShareURL(thoughtmark: ThoughtmarkWithBin, userId?: number): string {
    const baseUrl = window.location.origin;
    // Generate view URL instead of edit URL for social sharing
    return `${baseUrl}/thoughtmarks/${thoughtmark.id}`;
  }

  private generateImageURL(thoughtmark: ThoughtmarkWithBin, userId?: number): string {
    const baseUrl = window.location.origin;
    const shareId = btoa(`${thoughtmark.id}-${userId || thoughtmark.userId}-${Date.now()}`);
    return `${baseUrl}/api/share/${shareId}/card.png`;
  }

  async shareToClipboard(thoughtmark: ThoughtmarkWithBin, options: ShareOptions, userId?: number): Promise<void> {
    const shareUrl = this.generateShareURL(thoughtmark, userId);
    const shareText = `💭 ${thoughtmark.title}\n\n${thoughtmark.content}\n\n${thoughtmark.tags && thoughtmark.tags.length > 0 ? `Tags: ${thoughtmark.tags.join(', ')}\n\n` : ''}Shared from Thoughtmarks: ${shareUrl}`;
    
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(shareText);
      } else {
        // Fallback for older browsers or non-secure contexts
        const textArea = document.createElement('textarea');
        textArea.value = shareText;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        if (!successful) {
          throw new Error('Copy command failed');
        }
      }
    } catch (error) {
      throw new Error('Unable to copy to clipboard');
    }
  }

  async shareViaWebShare(thoughtmark: ThoughtmarkWithBin, options: ShareOptions, userId?: number): Promise<void> {
    if (!navigator.share) {
      throw new Error('Web Share API not supported');
    }

    const shareUrl = this.generateShareURL(thoughtmark, userId);
    const shareText = `${thoughtmark.content.substring(0, 200)}${thoughtmark.content.length > 200 ? '...' : ''}`;

    await navigator.share({
      title: `💭 ${thoughtmark.title}`,
      text: shareText,
      url: shareUrl
    });
  }

  shareToX(thoughtmark: ThoughtmarkWithBin, options: ShareOptions, userId?: number): void {
    try {
      const shareUrl = this.generateShareURL(thoughtmark, userId);
      const title = `💭 ${thoughtmark.title}`;
      const content = thoughtmark.content.substring(0, 150);
      const hashtags = thoughtmark.tags?.slice(0, 3).join(',') || 'Thoughtmarks';
      
      // X/Twitter optimized format with URL for rich card
      const tweetText = `${title}\n\n${content}${content.length >= 150 ? '...' : ''}\n\n#${hashtags.replace(/,/g, ' #')}`;
      const maxLength = 240; // Leave room for URL
      const finalText = tweetText.length > maxLength 
        ? tweetText.substring(0, maxLength - 3) + '...'
        : tweetText;
      
      const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(finalText)}&url=${encodeURIComponent(shareUrl)}`;
      const popup = window.open(xUrl, '_blank', 'width=550,height=420,scrollbars=yes,resizable=yes');
      
      if (!popup) {
        throw new Error('Popup blocked');
      }
    } catch (error) {
      console.error('X sharing failed:', error);
      // Fallback to copying content
      this.shareToClipboard(thoughtmark, options, userId);
    }
  }

  shareToLinkedIn(thoughtmark: ThoughtmarkWithBin, options: ShareOptions, userId?: number): void {
    try {
      const shareUrl = this.generateShareURL(thoughtmark, userId);
      const title = thoughtmark.title;
      const summary = `${thoughtmark.content.substring(0, 250)}${thoughtmark.content.length > 250 ? '...' : ''}`;
      
      // LinkedIn optimized format - URL will generate rich card automatically
      const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
      const popup = window.open(linkedInUrl, '_blank', 'width=600,height=500,scrollbars=yes,resizable=yes');
      
      if (!popup) {
        throw new Error('Popup blocked');
      }
    } catch (error) {
      console.error('LinkedIn sharing failed:', error);
      this.shareToClipboard(thoughtmark, options, userId);
    }
  }

  async generateRenderedImage(thoughtmark: ThoughtmarkWithBin, options: ShareOptions, platform: string): Promise<Blob> {
    const renderConfig = ThoughtmarkRenderer.getPresetConfig(platform);
    return await thoughtmarkRenderer.renderThoughtmark(thoughtmark, options, renderConfig);
  }

  async shareToInstagramStory(thoughtmark: ThoughtmarkWithBin, options: ShareOptions, userId?: number): Promise<void> {
    const imageBlob = await this.generateRenderedImage(thoughtmark, options, 'instagram-story');
    await this.shareRenderedImage(imageBlob, 'Instagram Story');
  }

  async shareToInstagram(thoughtmark: ThoughtmarkWithBin, options: ShareOptions, userId?: number): Promise<void> {
    const imageBlob = await this.generateRenderedImage(thoughtmark, options, 'instagram-post');
    await this.shareRenderedImage(imageBlob, 'Instagram');
  }

  async shareToReddit(thoughtmark: ThoughtmarkWithBin, options: ShareOptions, userId?: number): Promise<void> {
    const imageBlob = await this.generateRenderedImage(thoughtmark, options, 'reddit');
    await this.shareRenderedImage(imageBlob, 'Reddit');
  }

  private async shareRenderedImage(imageBlob: Blob, platform: string): Promise<void> {
    if (navigator.share && navigator.canShare?.({ files: [new File([imageBlob], 'thoughtmark.png', { type: 'image/png' })] })) {
      const file = new File([imageBlob], 'thoughtmark.png', { type: 'image/png' });
      await navigator.share({
        title: 'Thoughtmark',
        files: [file]
      });
    } else {
      // Fallback: download the image
      const url = URL.createObjectURL(imageBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `thoughtmark-${platform.toLowerCase()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  }

  async shareToFacebook(thoughtmark: ThoughtmarkWithBin, options: ShareOptions, userId?: number): Promise<void> {
    const imageBlob = await this.generateRenderedImage(thoughtmark, options, 'facebook');
    await this.shareRenderedImage(imageBlob, 'Facebook');
  }

  async shareToSnapchat(thoughtmark: ThoughtmarkWithBin, options: ShareOptions, userId?: number): Promise<void> {
    const imageBlob = await this.generateRenderedImage(thoughtmark, options, 'instagram-story');
    await this.shareRenderedImage(imageBlob, 'Snapchat');
  }

  async shareViaWebShareImage(thoughtmark: ThoughtmarkWithBin, options: ShareOptions, userId?: number): Promise<void> {
    if (!navigator.share) {
      throw new Error('Web Share API not supported');
    }

    const imageBlob = await this.generateRenderedImage(thoughtmark, options, 'general');
    const file = new File([imageBlob], 'thoughtmark.png', { type: 'image/png' });
    
    if (navigator.canShare?.({ files: [file] })) {
      await navigator.share({
        title: `💭 ${thoughtmark.title}`,
        files: [file]
      });
    } else {
      // Fallback to text sharing
      await this.shareViaWebShare(thoughtmark, options, userId);
    }
  }

  async shareToInstagramStories(thoughtmark: ThoughtmarkWithBin, options: ShareOptions, userId?: number): Promise<void> {
    const imageBlob = await this.generateRenderedImage(thoughtmark, options, 'instagram-story');
    await this.shareRenderedImage(imageBlob, 'Instagram Stories');
  }

  shareToThreads(thoughtmark: ThoughtmarkWithBin, options: ShareOptions): void {
    const shareUrl = this.generateShareURL(thoughtmark);
    const title = `💭 ${thoughtmark.title}`;
    const content = thoughtmark.content.substring(0, 300);
    const hashtags = thoughtmark.tags?.slice(0, 3).map(tag => `#${tag.replace(/\s+/g, '')}`).join(' ') || '#Thoughtmarks';
    
    // Threads optimized format with URL for rich preview
    const threadsText = `${title}\n\n${content}${content.length >= 300 ? '...' : ''}\n\n${hashtags}\n\n${shareUrl}`;
    const maxLength = 500;
    const finalText = threadsText.length > maxLength 
      ? threadsText.substring(0, maxLength - 3) + '...'
      : threadsText;
    
    const threadsUrl = `https://www.threads.net/intent/post?text=${encodeURIComponent(finalText)}`;
    window.open(threadsUrl, '_blank', 'width=550,height=420');
  }

  shareViaEmail(thoughtmark: ThoughtmarkWithBin, options: ShareOptions): void {
    const shareUrl = this.generateShareURL(thoughtmark);
    const subject = `Check out this thoughtmark: ${thoughtmark.title}`;
    const emailBody = `I wanted to share this thoughtmark with you:\n\n"${thoughtmark.title}"\n\n${thoughtmark.content}\n\n${thoughtmark.tags && thoughtmark.tags.length > 0 ? `Tags: ${thoughtmark.tags.join(', ')}\n\n` : ''}View the full thoughtmark here: ${shareUrl}\n\nCreated with Thoughtmarks - bookmarks for your brain\n\n#MarkMyThoughts #DontForgetThisApp #Thoughtmark`;
    
    const emailUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
    window.location.href = emailUrl;
  }

  generateMarkdownForThoughtmark(thoughtmark: ThoughtmarkWithBin, options: ShareOptions): string {
    let markdown = `# ${thoughtmark.title}\n\n`;
    markdown += `${thoughtmark.content}\n\n`;
    
    if (options.includeTags && thoughtmark.tags?.length) {
      markdown += `**Tags:** ${thoughtmark.tags.map(tag => `#${tag}`).join(' ')}\n\n`;
    }
    
    if (options.includeBin && thoughtmark.binName) {
      markdown += `**Collection:** ${thoughtmark.binName}\n\n`;
    }
    
    if (options.includeTimestamp) {
      markdown += `*Captured on ${new Date(thoughtmark.createdAt).toLocaleDateString()}*\n\n`;
    }
    
    markdown += `---\n*Shared from **Thoughtmarks***\n`;
    markdown += `*bookmarks for your brain*\n\n`;
    markdown += `#MarkMyThoughts #DontForgetThisApp #Thoughtmark`;
    
    return markdown;
  }

  async exportForCollaboration(thoughtmarks: ThoughtmarkWithBin[], title: string): Promise<string> {
    let collaborationDoc = `# ${title}\n\n`;
    collaborationDoc += `*Shared thoughtmarks collection*\n\n`;
    
    // Group by bin
    const thoughtmarksByBin = thoughtmarks.reduce((acc, tm) => {
      const binName = tm.binName || 'Uncategorized';
      if (!acc[binName]) acc[binName] = [];
      acc[binName].push(tm);
      return acc;
    }, {} as Record<string, ThoughtmarkWithBin[]>);

    for (const [binName, binThoughtmarks] of Object.entries(thoughtmarksByBin)) {
      collaborationDoc += `## ${binName}\n\n`;
      
      binThoughtmarks.forEach((tm, index) => {
        collaborationDoc += `### ${index + 1}. ${tm.title}\n\n`;
        collaborationDoc += `${tm.content}\n\n`;
        
        if (tm.tags?.length) {
          collaborationDoc += `**Tags:** ${tm.tags.join(', ')}\n\n`;
        }
        
        collaborationDoc += `---\n\n`;
      });
    }
    
    collaborationDoc += `\n*Generated from Thoughtmarks on ${new Date().toLocaleDateString()}*`;
    
    return collaborationDoc;
  }

  createShareableLink(thoughtmark: ThoughtmarkWithBin, options: ShareOptions): ShareableThoughtmark {
    return {
      id: thoughtmark.id,
      title: thoughtmark.title,
      content: thoughtmark.content,
      tags: thoughtmark.tags || [],
      binName: options.includeBin ? thoughtmark.binName || undefined : undefined,
      createdAt: options.includeTimestamp ? thoughtmark.createdAt.toString() : '',
      shareUrl: this.generateShareURL(thoughtmark)
    };
  }
}

export const socialSharingManager = new SocialSharingManager();