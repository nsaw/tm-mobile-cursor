import { useState } from "react";
import { X, Download, Eye, File, Image, FileText, Music, Video, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { FileAttachment } from "./file-upload";

interface AttachmentViewerProps {
  attachments: FileAttachment[];
  onRemove?: (id: string) => void;
  readOnly?: boolean;
}

export function AttachmentViewer({ attachments, onRemove, readOnly = false }: AttachmentViewerProps) {
  const [selectedAttachment, setSelectedAttachment] = useState<FileAttachment | null>(null);

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="w-4 h-4" />;
    if (type.startsWith('audio/')) return <Music className="w-4 h-4" />;
    if (type.startsWith('video/')) return <Video className="w-4 h-4" />;
    if (type.includes('pdf') || type.startsWith('text/')) return <FileText className="w-4 h-4" />;
    return <File className="w-4 h-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const canPreview = (type: string) => {
    return type.startsWith('image/') || type.startsWith('text/') || type.includes('pdf');
  };

  const renderPreview = (attachment: FileAttachment) => {
    if (attachment.type.startsWith('image/')) {
      return (
        <img
          src={attachment.url}
          alt={attachment.name}
          className="max-w-full max-h-96 rounded-lg"
        />
      );
    }
    
    if (attachment.type.includes('pdf')) {
      return (
        <iframe
          src={attachment.url}
          className="w-full h-96 rounded-lg"
          title={attachment.name}
        />
      );
    }
    
    if (attachment.type.startsWith('text/')) {
      return (
        <div className="bg-gray-900 p-4 rounded-lg max-h-96 overflow-auto">
          <pre className="text-sm text-gray-300 whitespace-pre-wrap">
            Loading text content...
          </pre>
        </div>
      );
    }
    
    return (
      <div className="flex items-center justify-center h-48 bg-gray-900 rounded-lg">
        <div className="text-center">
          {getFileIcon(attachment.type)}
          <p className="mt-2 text-sm text-gray-400">Preview not available</p>
          <Button
            onClick={() => window.open(attachment.url, '_blank')}
            variant="outline"
            size="sm"
            className="mt-2"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Open File
          </Button>
        </div>
      </div>
    );
  };

  if (attachments.length === 0) {
    return null;
  }

  return (
    <>
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-300">
          Attachments ({attachments.length})
        </h4>
        <div className="grid grid-cols-1 gap-2">
          {attachments.map((attachment) => (
            <div
              key={attachment.id}
              className="flex items-center justify-between bg-gray-800/50 rounded-lg p-2"
            >
              <div className="flex items-center space-x-2 flex-1 min-w-0">
                <div className="text-gray-400">
                  {getFileIcon(attachment.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-white truncate">
                    {attachment.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {formatFileSize(attachment.size)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-1">
                {canPreview(attachment.type) && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedAttachment(attachment)}
                    className="h-6 w-6 text-gray-400 hover:text-white"
                  >
                    <Eye className="w-3 h-3" />
                  </Button>
                )}
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => window.open(attachment.url, '_blank')}
                  className="h-6 w-6 text-gray-400 hover:text-white"
                >
                  <Download className="w-3 h-3" />
                </Button>
                
                {!readOnly && onRemove && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemove(attachment.id)}
                    className="h-6 w-6 text-gray-400 hover:text-red-400"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Preview Dialog */}
      {selectedAttachment && (
        <Dialog open={true} onOpenChange={() => setSelectedAttachment(null)}>
          <DialogContent className="max-w-4xl max-h-screen overflow-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                {getFileIcon(selectedAttachment.type)}
                <span>{selectedAttachment.name}</span>
                <span className="text-sm text-gray-400">
                  ({formatFileSize(selectedAttachment.size)})
                </span>
              </DialogTitle>
            </DialogHeader>
            
            <div className="mt-4">
              {renderPreview(selectedAttachment)}
            </div>
            
            <div className="flex justify-end space-x-2 mt-4">
              <Button
                onClick={() => window.open(selectedAttachment.url, '_blank')}
                variant="outline"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button onClick={() => setSelectedAttachment(null)}>
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}