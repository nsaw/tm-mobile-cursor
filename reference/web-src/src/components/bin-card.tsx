import { Card, CardContent } from "@/components/ui/card";
import { Folder } from "lucide-react";
import type { BinWithCount } from "@shared/schema";

interface BinCardProps {
  bin: BinWithCount;
  onClick: () => void;
  compact?: boolean;
}

export function BinCard({ bin, onClick, compact = false }: BinCardProps) {
  if (compact) {
    return (
      <Card 
        className="tm-card bin-card cursor-pointer overflow-hidden"
        onClick={onClick}
        role="button"
        aria-label={`Open ${bin.name} bin with ${bin.thoughtmarkCount} thoughtmarks`}
        tabIndex={0}
      >
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div 
                className="w-6 h-6 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: bin.color || '#374151' }}
              >
                <Folder className="w-3 h-3 text-white" />
              </div>
              <div>
                <h3 className="font-medium text-white text-sm">
                  {bin.name}
                </h3>
                {bin.description && (
                  <p className="text-xs text-gray-400 truncate max-w-48">
                    {bin.description}
                  </p>
                )}
              </div>
            </div>
            <span className="text-xs bg-gray-800 px-2 py-1 rounded text-gray-300">
              {bin.thoughtmarkCount}
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      className="border border-gray-700 hover:border-gray-600 transition-all duration-200 cursor-pointer rounded-lg overflow-hidden bg-gray-900/50"
      onClick={onClick}
      role="button"
      aria-label={`Open ${bin.name} bin with ${bin.thoughtmarkCount} thoughtmarks`}
      tabIndex={0}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div 
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: bin.color || '#374151' }}
          >
            <Folder className="w-4 h-4 text-white" />
          </div>
          <span className="text-xs bg-gray-800 px-2 py-1 rounded text-gray-300">
            {bin.thoughtmarkCount}
          </span>
        </div>
        
        <h3 className="font-medium text-white mb-1">
          {bin.name}
        </h3>
        
        {bin.description && (
          <p className="text-xs text-gray-400">
            {bin.description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
