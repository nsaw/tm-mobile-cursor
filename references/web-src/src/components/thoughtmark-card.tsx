import { Card, CardContent } from "@/components/ui/card";
import { TagChip } from "@/components/ui/tag-chip";
import { SwipeToDelete } from "@/components/ui/swipe-to-delete";
import { ShareDialog } from "@/components/share-dialog";
import { Edit2, Pin, MoreVertical, Archive, Eye, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import type { ThoughtmarkWithBin } from "@shared/schema";
import { formatDistanceToNow, isWithinInterval, subDays } from "date-fns";
import { AiTooltip } from "@/components/ai-tooltip";

interface ThoughtmarkCardProps {
  thoughtmark: ThoughtmarkWithBin;
  onEdit?: () => void;
  onDelete?: () => void;
  onArchive?: () => void;
  onClick?: () => void;
  enableSwipeDelete?: boolean;
  showSimilarity?: boolean;
  similarity?: number;
  isSelectable?: boolean;
  isSelected?: boolean;
  onSelectionToggle?: (id: number) => void;
}

export function ThoughtmarkCard({ 
  thoughtmark, 
  onEdit, 
  onDelete, 
  onArchive,
  onClick, 
  enableSwipeDelete = false,
  showSimilarity = false,
  similarity,
  isSelectable = false,
  isSelected = false,
  onSelectionToggle
}: ThoughtmarkCardProps) {
  const [isLongPressing, setIsLongPressing] = useState(false);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleLongPressStart = () => {
    setIsLongPressing(true);
    setTimeout(() => {
      if (isLongPressing) {
        setShowContextMenu(true);
      }
    }, 500);
  };

  const handleLongPressEnd = () => {
    setIsLongPressing(false);
  };

  const handleTogglePin = async () => {
    try {
      await apiRequest("POST", `/api/thoughtmarks/${thoughtmark.id}/toggle-pin`);
      queryClient.invalidateQueries({ queryKey: ["/api/thoughtmarks"] });
      toast({
        title: thoughtmark.isPinned ? "Unpinned" : "Pinned",
        description: `Thoughtmark ${thoughtmark.isPinned ? "unpinned from" : "pinned to"} top`,
      });
      setShowContextMenu(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update pin status",
        variant: "destructive",
      });
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if (isSelectable && onSelectionToggle) {
      e.preventDefault();
      onSelectionToggle(thoughtmark.id);
    } else if (onClick) {
      onClick();
    }
  };

  const handleQuickEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit();
    }
  };

  const cardContent = (
    <div 
      className={`tm-card thoughtmark-card cursor-pointer ${
        thoughtmark.isPinned ? "pinned" : ""
      } ${isSelected ? "selected" : ""}`}
      onClick={handleCardClick}
      onTouchStart={handleLongPressStart}
      onTouchEnd={handleLongPressEnd}
      onMouseDown={handleLongPressStart}
      onMouseUp={handleLongPressEnd}
      onMouseLeave={handleLongPressEnd}
      role="article"
      aria-label={`Thoughtmark: ${thoughtmark.title}${thoughtmark.isPinned ? ', pinned' : ''}${thoughtmark.binName ? `, in ${thoughtmark.binName}` : ''}`}
    >
      <div className="inner-content p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center space-x-2">
            {isSelectable && (
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => onSelectionToggle?.(thoughtmark.id)}
                  className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            )}
            <DropdownMenu open={showContextMenu} onOpenChange={setShowContextMenu}>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 w-6 p-0 text-gray-400 hover:text-white hover:bg-gray-700/50"
                  aria-label="Thoughtmark options menu"
                  onPointerDown={(e) => e.stopPropagation()}
                >
                  <MoreVertical className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onClick?.(); setShowContextMenu(false); }}>
                  <Eye className="w-4 h-4 mr-2" />
                  View
                </DropdownMenuItem>
                {onEdit && (
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(); setShowContextMenu(false); }}>
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleTogglePin(); }}>
                  <Pin className="w-4 h-4 mr-2" />
                  {thoughtmark.isPinned ? "Unpin" : "Pin to top"}
                </DropdownMenuItem>
                <ShareDialog 
                  thoughtmark={thoughtmark}
                  trigger={
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); }}>
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </DropdownMenuItem>
                  }
                />
                {onArchive && (
                  <DropdownMenuItem 
                    onClick={(e) => { e.stopPropagation(); onArchive(); setShowContextMenu(false); }}
                    className="text-blue-400 hover:text-blue-300 focus:text-blue-300"
                  >
                    <Archive className="w-4 h-4 mr-2" />
                    Archive
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <h3 className="font-medium text-white text-sm line-clamp-1 flex-1 mx-3">
            {thoughtmark.title}
          </h3>
          <div className="flex items-center space-x-2 flex-shrink-0">
            {showSimilarity && similarity !== undefined && (
              <div className="bg-[#C6D600]/20 text-[#C6D600] px-2 py-1 rounded-full text-xs font-medium">
                {Math.round(similarity * 100)}% match
              </div>
            )}
            <span className="text-xs text-gray-400 whitespace-nowrap">
              {(() => {
                if (!thoughtmark.createdAt || isNaN(new Date(thoughtmark.createdAt).getTime())) {
                  return new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                }
                
                const createdDate = new Date(thoughtmark.createdAt);
                const now = new Date();
                const sevenDaysAgo = subDays(now, 7);
                
                // Show day of the week for items created within the last 7 days
                if (isWithinInterval(createdDate, { start: sevenDaysAgo, end: now })) {
                  return createdDate.toLocaleDateString('en-US', { 
                    weekday: 'short'
                  });
                }
                
                // Show date for older items
                return createdDate.toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric',
                  year: createdDate.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
                });
              })()}
            </span>
            <div className="flex space-x-1">
              {thoughtmark.isPinned && (
                <Pin className="w-3 h-3 text-blue-400" />
              )}
            </div>
          </div>
        </div>
        
        <p className="text-sm text-gray-300 mb-3 line-clamp-3">
          {thoughtmark.content}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {thoughtmark.tags.map((tag) => (
              <TagChip key={tag} tag={tag} />
            ))}
          </div>
          {thoughtmark.binName && (
            <span className="text-xs text-gray-400">
              {thoughtmark.binName}
            </span>
          )}
        </div>
      </div>
    </div>
  );

  if (enableSwipeDelete && onArchive) {
    return (
      <SwipeToDelete onDelete={onArchive}>
        {cardContent}
      </SwipeToDelete>
    );
  }

  return cardContent;
}
