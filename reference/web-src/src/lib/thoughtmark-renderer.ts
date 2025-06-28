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
    // Enable better text rendering
    this.ctx.textBaseline = 'top';
    this.ctx.imageSmoothingEnabled = true;
  }

  async renderThoughtmark(
    thoughtmark: ThoughtmarkWithBin, 
    shareOptions: ShareOptions,
    renderOptions: RenderOptions
  ): Promise<Blob> {
    const { width, height, theme, format } = renderOptions;
    
    // Set canvas dimensions
    this.canvas.width = width;
    this.canvas.height = height;
    
    // Clear canvas
    this.ctx.clearRect(0, 0, width, height);
    
    // Set theme colors
    const colors = this.getThemeColors(theme);
    
    // Draw background
    this.drawBackground(colors, format);
    
    // Draw content
    await this.drawContent(thoughtmark, shareOptions, colors, format);
    
    // Convert to blob
    return new Promise((resolve) => {
      this.canvas.toBlob((blob) => {
        resolve(blob!);
      }, 'image/png', 0.9);
    });
  }

  private getThemeColors(theme: 'dark' | 'light') {
    if (theme === 'dark') {
      return {
        background: '#000000',
        surface: '#1a1a1a',
        primary: '#C6D600',
        secondary: '#00D9FF',
        text: '#ffffff',
        textSecondary: '#a0a0a0',
        accent: '#yellow',
        border: '#333333'
      };
    } else {
      return {
        background: '#ffffff',
        surface: '#f5f5f5',
        primary: '#8B9900',
        secondary: '#0099CC',
        text: '#000000',
        textSecondary: '#666666',
        accent: '#orange',
        border: '#cccccc'
      };
    }
  }

  private drawBackground(colors: any, format: string) {
    const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
    
    if (format === 'instagram-story') {
      // Vertical gradient for stories
      gradient.addColorStop(0, colors.background);
      gradient.addColorStop(0.3, colors.surface);
      gradient.addColorStop(1, colors.background);
    } else {
      // Standard gradient
      gradient.addColorStop(0, colors.background);
      gradient.addColorStop(1, colors.surface);
    }
    
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Add subtle pattern
    this.addBackgroundPattern(colors);
  }

  private addBackgroundPattern(colors: any) {
    const pattern = this.ctx.createRadialGradient(
      this.canvas.width * 0.8, 
      this.canvas.height * 0.2, 
      0,
      this.canvas.width * 0.8, 
      this.canvas.height * 0.2, 
      this.canvas.width * 0.6
    );
    pattern.addColorStop(0, colors.primary + '10');
    pattern.addColorStop(1, 'transparent');
    
    this.ctx.fillStyle = pattern;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  private async drawContent(
    thoughtmark: ThoughtmarkWithBin, 
    shareOptions: ShareOptions, 
    colors: any, 
    format: string
  ) {
    const padding = format === 'instagram-story' ? 60 : 40;
    const contentWidth = this.canvas.width - (padding * 2);
    let yPos = padding;

    // Draw Thoughtmarks branding
    yPos = this.drawBranding(colors, padding, yPos);
    yPos += 40;

    // Draw title
    if (thoughtmark.title?.trim()) {
      yPos = this.drawTitle(thoughtmark.title, colors, padding, yPos, contentWidth);
      yPos += 30;
    }

    // Draw content
    yPos = this.drawTextContent(thoughtmark.content, colors, padding, yPos, contentWidth);
    yPos += 30;

    // Draw tags if enabled
    if (shareOptions.includeTags && thoughtmark.tags?.length > 0) {
      yPos = this.drawTags(thoughtmark.tags, colors, padding, yPos, contentWidth);
      yPos += 20;
    }

    // Draw bin if enabled
    if (shareOptions.includeBin && thoughtmark.binName) {
      yPos = this.drawBin(thoughtmark.binName, colors, padding, yPos);
      yPos += 20;
    }

    // Draw timestamp if enabled
    if (shareOptions.includeTimestamp) {
      this.drawTimestamp(thoughtmark.createdAt, colors, padding);
    }

    // Draw bottom branding with hashtags
    this.drawBottomBranding(colors);
  }

  private drawBranding(colors: any, padding: number, yPos: number): number {
    // Draw logo placeholder (simplified T icon)
    this.ctx.fillStyle = colors.primary;
    this.ctx.fillRect(padding, yPos - 20, 6, 30);
    this.ctx.fillRect(padding - 8, yPos - 20, 22, 6);
    
    // Draw Thoughtmarks text
    this.ctx.font = 'bold 36px system-ui, -apple-system, sans-serif';
    this.ctx.fillStyle = colors.primary;
    this.ctx.fillText('Thoughtmarks', padding + 35, yPos);
    
    return yPos + 40;
  }

  private drawTitle(title: string, colors: any, padding: number, yPos: number, contentWidth: number): number {
    this.ctx.font = 'bold 48px system-ui, -apple-system, sans-serif';
    this.ctx.fillStyle = colors.text;
    
    const lines = this.wrapText(title, contentWidth, 48);
    lines.forEach((line, index) => {
      this.ctx.fillText(line, padding, yPos + (index * 60));
    });
    
    return yPos + (lines.length * 60);
  }

  private drawTextContent(content: string, colors: any, padding: number, yPos: number, contentWidth: number): number {
    this.ctx.font = '32px system-ui, -apple-system, sans-serif';
    this.ctx.fillStyle = colors.text;
    
    const lines = this.wrapText(content, contentWidth, 32);
    const maxLines = Math.floor((this.canvas.height - yPos - 200) / 45);
    const displayLines = lines.slice(0, maxLines);
    
    if (lines.length > maxLines) {
      displayLines[displayLines.length - 1] = displayLines[displayLines.length - 1] + '...';
    }
    
    displayLines.forEach((line, index) => {
      this.ctx.fillText(line, padding, yPos + (index * 45));
    });
    
    return yPos + (displayLines.length * 45);
  }

  private drawTags(tags: string[], colors: any, padding: number, yPos: number, contentWidth: number): number {
    this.ctx.font = '16px system-ui, -apple-system, sans-serif';
    
    let currentX = padding;
    let currentY = yPos;
    const tagHeight = 30;
    const tagSpacing = 10;
    
    tags.forEach(tag => {
      const tagText = `#${tag}`;
      const tagWidth = this.ctx.measureText(tagText).width + 20;
      
      if (currentX + tagWidth > padding + contentWidth) {
        currentX = padding;
        currentY += tagHeight + tagSpacing;
      }
      
      // Draw tag background
      this.ctx.fillStyle = colors.primary + '40';
      this.ctx.fillRect(currentX, currentY - 20, tagWidth, tagHeight);
      
      // Draw tag text
      this.ctx.fillStyle = colors.primary;
      this.ctx.fillText(tagText, currentX + 10, currentY);
      
      currentX += tagWidth + tagSpacing;
    });
    
    return currentY + tagHeight;
  }

  private drawBin(binName: string, colors: any, padding: number, yPos: number): number {
    this.ctx.font = '16px system-ui, -apple-system, sans-serif';
    this.ctx.fillStyle = colors.textSecondary;
    this.ctx.fillText(`📁 ${binName}`, padding, yPos);
    
    return yPos + 20;
  }

  private drawTimestamp(date: Date, colors: any, padding: number) {
    this.ctx.font = '14px system-ui, -apple-system, sans-serif';
    this.ctx.fillStyle = colors.textSecondary;
    
    const timestamp = new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    
    this.ctx.fillText(timestamp, padding, this.canvas.height - 60);
  }

  private drawBottomBranding(colors: any) {
    const padding = 20;
    const cornerX = this.canvas.width - 300;
    const cornerY = this.canvas.height - 100;
    
    // Draw subtle background for branding area
    this.ctx.fillStyle = colors.background + '80';
    this.ctx.fillRect(cornerX - 10, cornerY - 10, 290, 90);
    
    // Draw Thoughtmarks logo/text
    this.ctx.font = 'bold 18px system-ui, -apple-system, sans-serif';
    this.ctx.fillStyle = colors.primary;
    this.ctx.fillText('Thoughtmarks', cornerX, cornerY + 20);
    
    // Draw handle
    this.ctx.font = '14px system-ui, -apple-system, sans-serif';
    this.ctx.fillStyle = colors.textSecondary;
    this.ctx.fillText('@ThoughtmarksApp', cornerX, cornerY + 40);
    
    // Draw hashtags
    this.ctx.font = '12px system-ui, -apple-system, sans-serif';
    this.ctx.fillStyle = colors.accent;
    const hashtags = '#MarkMyThoughts #DontForgetThisApp #Thoughtmark';
    this.ctx.fillText(hashtags, cornerX, cornerY + 60);
  }

  private wrapText(text: string, maxWidth: number, fontSize: number): string[] {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    this.ctx.font = `${fontSize}px system-ui, -apple-system, sans-serif`;

    for (const word of words) {
      const testLine = currentLine + (currentLine ? ' ' : '') + word;
      const metrics = this.ctx.measureText(testLine);
      
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

  // Preset render configurations for different platforms
  static getPresetConfig(platform: string): RenderOptions {
    switch (platform) {
      case 'instagram-story':
        return {
          width: 1080,
          height: 1920,
          theme: 'dark',
          format: 'instagram-story'
        };
      case 'instagram-post':
        return {
          width: 1080,
          height: 1080,
          theme: 'dark',
          format: 'instagram-post'
        };
      case 'facebook':
        return {
          width: 1200,
          height: 630,
          theme: 'dark',
          format: 'facebook'
        };
      case 'reddit':
        return {
          width: 800,
          height: 600,
          theme: 'dark',
          format: 'reddit'
        };
      default:
        return {
          width: 1080,
          height: 1080,
          theme: 'dark',
          format: 'general'
        };
    }
  }
}

export const thoughtmarkRenderer = new ThoughtmarkRenderer();