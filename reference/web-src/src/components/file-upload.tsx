import { useState, useRef } from "react";
import { Upload, X, File, Image, FileText, Music, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export interface FileAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: string;
}

interface FileUploadProps {
  attachments: FileAttachment[];
  onAttachmentsChange: (attachments: FileAttachment[]) => void;
  maxFiles?: number;
  maxSizeInMB?: number;
  acceptedTypes?: string[];
}

export function FileUpload({ 
  attachments, 
  onAttachmentsChange, 
  maxFiles = 5, 
  maxSizeInMB = 10,
  acceptedTypes = ['image/*', 'application/pdf', 'text/*', 'audio/*', 'video/*']
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

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

  const validateFile = (file: File): string | null => {
    if (file.size > maxSizeInMB * 1024 * 1024) {
      return `File size must be less than ${maxSizeInMB}MB`;
    }
    
    const isValidType = acceptedTypes.some(type => {
      if (type.endsWith('/*')) {
        return file.type.startsWith(type.slice(0, -1));
      }
      return file.type === type;
    });
    
    if (!isValidType) {
      return 'File type not supported';
    }
    
    return null;
  };

  const uploadFile = async (file: File): Promise<FileAttachment> => {
    // Create a local URL for preview instead of uploading immediately
    const url = URL.createObjectURL(file);
    
    return {
      id: crypto.randomUUID(),
      name: file.name,
      size: file.size,
      type: file.type,
      url: url,
      uploadedAt: new Date().toISOString()
    };
  };

  const handleFiles = async (files: FileList) => {
    if (attachments.length + files.length > maxFiles) {
      toast({
        title: "Too many files",
        description: `Maximum ${maxFiles} files allowed`,
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    const newAttachments: FileAttachment[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const error = validateFile(file);
        
        if (error) {
          toast({
            title: "Invalid file",
            description: `${file.name}: ${error}`,
            variant: "destructive"
          });
          continue;
        }

        const attachment = await uploadFile(file);
        newAttachments.push(attachment);
      }

      onAttachmentsChange([...attachments, ...newAttachments]);
      
      if (newAttachments.length > 0) {
        toast({
          title: "Files uploaded",
          description: `${newAttachments.length} file(s) attached successfully`
        });
      }
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload files. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const removeAttachment = (id: string) => {
    onAttachmentsChange(attachments.filter(att => att.id !== id));
  };

  return (
    <div className="space-y-3">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-4 transition-colors ${
          isDragging
            ? 'border-[#C6D600] bg-[#C6D600]/10'
            : 'border-gray-600 hover:border-gray-500'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="flex flex-col items-center space-y-2">
          <Upload className={`w-8 h-8 ${isDragging ? 'text-[#C6D600]' : 'text-gray-400'}`} />
          <div className="text-center">
            <p className="text-sm text-gray-300">
              Drop files here or{' '}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-[#C6D600] hover:underline"
                disabled={uploading}
              >
                browse
              </button>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Max {maxFiles} files, {maxSizeInMB}MB each
            </p>
          </div>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={acceptedTypes.join(',')}
        onChange={handleFileSelect}
        className="hidden"
        disabled={uploading}
      />

      {/* Uploading State */}
      {uploading && (
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <div className="w-4 h-4 border-2 border-[#C6D600] border-t-transparent rounded-full animate-spin" />
          <span>Uploading files...</span>
        </div>
      )}

      {/* Attachments List */}
      {attachments.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-300">
            Attachments ({attachments.length})
          </h4>
          <div className="space-y-2">
            {attachments.map((attachment) => (
              <div
                key={attachment.id}
                className="flex items-center justify-between bg-gray-800 rounded-lg p-3"
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className="text-gray-400">
                    {getFileIcon(attachment.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {attachment.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatFileSize(attachment.size)}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeAttachment(attachment.id)}
                  className="h-8 w-8 text-gray-400 hover:text-red-400"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}