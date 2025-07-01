import type { ThoughtmarkWithBin } from "@shared/schema";
import type { ShareOptions } from "./social-sharing";

export interface RenderOptions {
  width: number;
  height: number;
  theme: 'dark' | 'light';
  format: 'instagram-story' | 'instagram-post' | 'facebook' | 'reddit' | 'general';
}

export class ThoughtmarkRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d')!;
    this.ctx.textBaseline = 'top';
    this.ctx.imageSmoothingEnabled = true;
  }

  async renderThoughtmark(
    thoughtmark: ThoughtmarkWithBin, 
    shareOptions: ShareOptions,
    renderOptions: RenderOptions
  ): Promise<Blob> {
    const { width, height } = renderOptions;
    
    this.canvas.width = width;
    this.canvas.height = height;
    
    // Modern card-style design with proper aspect ratios
    await this.drawModernCard(thoughtmark, shareOptions, renderOptions);
    
    return new Promise((resolve) => {
      this.canvas.toBlob((blob) => {
        resolve(blob!);
      }, 'image/png');
    });
  }

  private async drawModernCard(
    thoughtmark: ThoughtmarkWithBin,
    shareOptions: ShareOptions,
    renderOptions: RenderOptions
  ) {
    const { width, height, format } = renderOptions;
    const ctx = this.ctx;
    
    // Background - #202020
    ctx.fillStyle = '#202020';
    ctx.fillRect(0, 0, width, height);
    
    // Calculate card dimensions and padding
    const cardPadding = Math.min(width, height) * 0.08;
    const cardWidth = width - (cardPadding * 2);
    const cardHeight = height - (cardPadding * 2);
    
    // Draw main card with shadow
    this.drawCardWithShadow(cardPadding, cardPadding, cardWidth, cardHeight);
    
    // Content area with proper padding
    const contentPadding = cardPadding * 0.8;
    const contentX = cardPadding + contentPadding;
    const contentY = cardPadding + contentPadding;
    const contentWidth = cardWidth - (contentPadding * 2);
    const contentHeight = cardHeight - (contentPadding * 2);
    
    // Draw branding header (matching app style)
    const headerHeight = await this.drawBrandingHeader(contentX, contentY, contentWidth);
    
    // Draw thoughtmark content
    const titleHeight = this.drawThoughtmarkTitle(
      thoughtmark.title, 
      contentX, 
      contentY + headerHeight + 40, 
      contentWidth
    );
    
    const contentTextHeight = this.drawThoughtmarkContent(
      thoughtmark.content,
      contentX,
      contentY + headerHeight + titleHeight + 60,
      contentWidth,
      contentHeight - headerHeight - titleHeight - 150
    );
    
    // Draw tags if enabled
    if (shareOptions.includeTags && thoughtmark.tags.length > 0) {
      this.drawTags(
        thoughtmark.tags,
        contentX,
        contentY + headerHeight + titleHeight + contentTextHeight + 80,
        contentWidth
      );
    }
    
    // Draw footer with date and attribution
    this.drawFooter(
      thoughtmark,
      shareOptions,
      contentX,
      contentY + contentHeight - 60,
      contentWidth
    );
  }

  private drawCardWithShadow(x: number, y: number, width: number, height: number) {
    const ctx = this.ctx;
    
    // Draw shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 8;
    
    // Draw card background - #052c43
    ctx.fillStyle = '#052c43';
    ctx.roundRect(x, y, width, height, 16);
    ctx.fill();
    
    // Reset shadow
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    
    // Add black stroke
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.roundRect(x, y, width, height, 16);
    ctx.stroke();
  }

  private async drawBrandingHeader(x: number, y: number, width: number): Promise<number> {
    const ctx = this.ctx;
    
    // Load the actual app icon from GitHub
    const iconSize = 80;
    const iconX = x;
    const iconY = y;
    
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = 'https://raw.githubusercontent.com/nsaw/thoughtmarks-landing/main/public/Assets/AppIcon.png';
      });
      
      // Draw the actual app icon
      ctx.drawImage(img, iconX, iconY, iconSize, iconSize);
    } catch (error) {
      // Fallback to simplified icon if loading fails
      ctx.fillStyle = '#1F4B4B';
      ctx.roundRect(iconX, iconY, iconSize, iconSize, 16);
      ctx.fill();
      
      ctx.fillStyle = '#C6D600';
      ctx.beginPath();
      ctx.arc(iconX + iconSize/2, iconY + iconSize/2, iconSize/3, 0, 2 * Math.PI);
      ctx.fill();
    }
    
    // THOUGHTMARKS - exactly like in image: white, all caps, bold, half size from before
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '700 48px Ubuntu, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText('THOUGHTMARKS', iconX + iconSize + 20, iconY + 8);
    
    // Tagline: green like in image, lowercase, half size from before
    ctx.fillStyle = '#C6D600';
    ctx.font = '400 24px Ubuntu, sans-serif';
    ctx.fillText('bookmarks for your brain', iconX + iconSize + 20, iconY + 60);
    
    return 100;
  }

  private drawThoughtmarkTitle(title: string, x: number, y: number, width: number): number {
    const ctx = this.ctx;
    
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    
    const uppercaseTitle = title.toUpperCase();
    const availableWidth = width - 40; // Leave some padding
    
    // Start with a large font size and scale down to fit
    let fontSize = 56;
    let font = `700 ${fontSize}px Ubuntu, sans-serif`;
    ctx.font = font;
    
    // Reduce font size until text fits in one line
    while (ctx.measureText(uppercaseTitle).width > availableWidth && fontSize > 20) {
      fontSize -= 2;
      font = `700 ${fontSize}px Ubuntu, sans-serif`;
      ctx.font = font;
    }
    
    // Draw the title in one line
    ctx.fillText(uppercaseTitle, x, y);
    
    return fontSize + 20; // Return height based on font size
  }

  private drawThoughtmarkContent(
    content: string, 
    x: number, 
    y: number, 
    width: number,
    maxHeight: number
  ): number {
    const ctx = this.ctx;
    
    ctx.fillStyle = '#e5e5e5';
    ctx.font = `300 36px Ubuntu, sans-serif`; // 10% smaller (40px -> 36px), 100pts less weight (400 -> 300), Ubuntu font
    
    const lines = this.wrapText(content, width - 20, 36);
    const lineHeight = 43; // Adjusted line height for smaller text
    const maxLines = Math.floor(maxHeight / lineHeight);
    const displayLines = lines.slice(0, maxLines);
    
    // If content is truncated, add ellipsis
    if (lines.length > maxLines && displayLines.length > 0) {
      const lastLine = displayLines[displayLines.length - 1];
      displayLines[displayLines.length - 1] = lastLine.slice(0, -3) + '...';
    }
    
    displayLines.forEach((line, index) => {
      ctx.fillText(line, x, y + (index * lineHeight));
    });
    
    return displayLines.length * lineHeight + 20;
  }

  private drawTags(tags: string[], x: number, y: number, width: number) {
    const ctx = this.ctx;
    
    ctx.fillStyle = '#C6D600';
    ctx.font = `500 16px Ubuntu, sans-serif`; // 100pts less weight (600 -> 500), Ubuntu font
    
    const tagText = tags.slice(0, 5).map(tag => `#${tag}`).join(' ');
    const lines = this.wrapText(tagText, width - 20, 16);
    
    lines.slice(0, 2).forEach((line, index) => {
      ctx.fillText(line, x, y + (index * 24));
    });
  }

  private drawFooter(
    thoughtmark: ThoughtmarkWithBin,
    shareOptions: ShareOptions,
    x: number,
    y: number,
    width: number
  ) {
    const ctx = this.ctx;
    
    // Date on left
    if (shareOptions.includeTimestamp) {
      ctx.fillStyle = '#888888';
      ctx.font = `300 14px Ubuntu, sans-serif`; // 100pts less weight (400 -> 300), Ubuntu font
      const date = new Date(thoughtmark.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
      ctx.fillText(date, x, y);
    }
    
    // Attribution on right
    ctx.fillStyle = '#C6D600';
    ctx.font = `500 14px Ubuntu, sans-serif`; // 100pts less weight (600 -> 500), Ubuntu font
    const attribution = 'Thoughtmarks';
    const attributionWidth = ctx.measureText(attribution).width;
    ctx.fillText(attribution, x + width - attributionWidth, y);
    
    // Social handle
    ctx.fillStyle = '#888888';
    ctx.font = `300 12px Ubuntu, sans-serif`; // 100pts less weight (400 -> 300), Ubuntu font
    const handle = '@ThoughtmarksApp';
    const handleWidth = ctx.measureText(handle).width;
    ctx.fillText(handle, x + width - handleWidth, y + 20);
    
    // Hashtags
    ctx.fillStyle = '#888888';
    ctx.font = `300 12px Ubuntu, sans-serif`; // 100pts less weight (400 -> 300), Ubuntu font
    const hashtags = '#MarkMyThoughts #DontForgetThisApp #Thoughtmark';
    const hashtagsWidth = ctx.measureText(hashtags).width;
    ctx.fillText(hashtags, x + width - hashtagsWidth, y + 36);
  }

  private wrapText(text: string, maxWidth: number, fontSize: number): string[] {
    const ctx = this.ctx;
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine + (currentLine ? ' ' : '') + word;
      const metrics = ctx.measureText(testLine);
      
      if (metrics.width > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    
    if (currentLine) {
      lines.push(currentLine);
    }
    
    return lines;
  }

  static getPresetConfig(platform: string): RenderOptions {
    const configs: Record<string, RenderOptions> = {
      'instagram-story': {
        width: 1080,
        height: 1920,
        theme: 'dark',
        format: 'instagram-story'
      },
      'instagram-post': {
        width: 1080,
        height: 1080,
        theme: 'dark',
        format: 'instagram-post'
      },
      'facebook': {
        width: 1200,
        height: 630,
        theme: 'dark',
        format: 'facebook'
      },
      'reddit': {
        width: 1200,
        height: 800,
        theme: 'dark',
        format: 'reddit'
      },
      'snapchat': {
        width: 1080,
        height: 1920,
        theme: 'dark',
        format: 'instagram-story'
      }
    };
    
    return configs[platform] || configs['general'] || {
      width: 1200,
      height: 800,
      theme: 'dark',
      format: 'general'
    };
  }
}

export const thoughtmarkRenderer = new ThoughtmarkRenderer();