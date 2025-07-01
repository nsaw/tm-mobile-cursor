import { useLocation } from "wouter";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThoughtmarkCard } from "@/components/thoughtmark-card";
import { BottomNav } from "@/components/ui/bottom-nav";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { ThoughtmarkWithBin } from "@shared/schema";

export default function RecentlyDeleted() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: deletedThoughtmarks = [], isLoading } = useQuery<ThoughtmarkWithBin[]>({
    queryKey: ["/api/thoughtmarks/deleted"],
  });

  const restoreMutation = useMutation({
    mutationFn: async (thoughtmarkId: number) => {
      const response = await apiRequest("POST", `/api/thoughtmarks/${thoughtmarkId}/restore`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/thoughtmarks/deleted"] });
      queryClient.invalidateQueries({ queryKey: ["/api/thoughtmarks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/bins"] });
      toast({
        title: "Success",
        description: "Thoughtmark restored successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to restore thoughtmark. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleRestore = (thoughtmarkId: number) => {
    restoreMutation.mutate(thoughtmarkId);
  };

  return (
    <div className="max-w-md mx-auto bg-black full-height relative">
      <div className="p-6 pb-24">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation("/")}
            className="p-2 hover:bg-gray-800 rounded-lg mr-3"
          >
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-white">Recently Deleted</h1>
            <p className="text-sm text-gray-400">
              {deletedThoughtmarks.length} deleted thoughtmarks
            </p>
          </div>
        </div>

        {/* Deleted Thoughtmarks */}
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-gray-800 p-4 rounded-xl h-32 animate-pulse" />
            ))}
          </div>
        ) : deletedThoughtmarks.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400 mb-4">No deleted thoughtmarks</p>
            <Button
              onClick={() => setLocation("/")}
              className="bg-[#C6D600] hover:bg-[#B5C100] text-black"
            >
              Go Home
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {deletedThoughtmarks.map((thoughtmark) => (
              <div key={thoughtmark.id} className="relative">
                <ThoughtmarkCard thoughtmark={thoughtmark} />
                <div className="absolute top-2 right-2">
                  <Button
                    size="sm"
                    onClick={() => handleRestore(thoughtmark.id)}
                    disabled={restoreMutation.isPending}
                    className="bg-[#C6D600] hover:bg-[#B5C100] text-black"
                  >
                    <RotateCcw className="w-4 h-4 mr-1" />
                    Restore
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav onNavigate={setLocation} />
    </div>
  );
}
