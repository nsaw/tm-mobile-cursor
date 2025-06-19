import { useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { Trash2, Brain } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ExampleDeletionPopupProps {
  isOpen: boolean;
  onClose: () => void;
  exampleCount: number;
}

export function ExampleDeletionPopup({ isOpen, onClose, exampleCount }: ExampleDeletionPopupProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const deleteExamplesMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("DELETE", "/api/thoughtmarks/examples/bulk");
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/thoughtmarks'] });
      queryClient.invalidateQueries({ queryKey: ['/api/bins'] });
      toast({
        title: "Examples Deleted",
        description: `Successfully removed ${data.deletedCount} example thoughtmarks`,
      });
      onClose();
    },
    onError: () => {
      toast({
        title: "Deletion Failed",
        description: "Could not delete example thoughtmarks. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteExamplesMutation.mutateAsync();
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(8px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        margin: 0
      }}
      onClick={onClose}
    >
      <div 
        className="bg-gray-900 rounded-2xl p-6 max-w-sm w-full border border-gray-800 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-center mb-6">
          <div className="w-12 h-12 bg-[#C6D600] rounded-full flex items-center justify-center mb-4">
            <Brain className="w-6 h-6 text-black" />
          </div>
        </div>

        {/* Content */}
        <div className="text-center mb-8">
          <h2 className="text-xl font-title text-white mb-3">
            Clean Up Example Data?
          </h2>
          <p className="text-sm font-body text-gray-300 mb-4 leading-relaxed">
            I found {exampleCount} example thoughtmarks in your collection. Would you like to delete them all at once to start fresh?
          </p>
          <div className="text-xs text-gray-400 bg-gray-800/50 rounded-lg p-3">
            This will permanently remove all example thoughtmarks and content. Your personal thoughtmarks will remain untouched.
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
            disabled={isDeleting}
          >
            Keep Examples
          </Button>
          <Button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex-1 bg-red-600 text-white hover:bg-red-700 font-subtitle"
          >
            {isDeleting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete All
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}