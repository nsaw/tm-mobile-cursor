import { useState, useMemo } from "react";
import { Check, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { BinWithCount } from "@shared/schema";
import { cn } from "@/lib/utils";

interface BinSelectorProps {
  bins: BinWithCount[];
  selectedBinId?: number;
  onBinSelect: (binId: number) => void;
  onCreateBin?: (name: string) => void;
  placeholder?: string;
}

export function BinSelector({
  bins,
  selectedBinId,
  onBinSelect,
  onCreateBin,
  placeholder = "Select a bin..."
}: BinSelectorProps) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const selectedBin = bins.find(bin => bin.id === selectedBinId);

  const filteredBins = useMemo(() => {
    const searchTerm = searchValue.toLowerCase();
    const filtered = bins.filter(bin => 
      bin.name.toLowerCase().includes(searchTerm)
    );

    // Sort bins by thoughtmarkCount for frequent bins
    const sortedBins = [...filtered].sort((a, b) => b.thoughtmarkCount - a.thoughtmarkCount);
    
    // Frequent bins are those with 3+ thoughtmarks
    const frequentBins = sortedBins.filter(bin => bin.thoughtmarkCount >= 3);
    const otherBins = sortedBins.filter(bin => bin.thoughtmarkCount < 3);

    return { frequentBins, otherBins };
  }, [bins, searchValue]);

  const showCreateOption = searchValue.trim() && 
    !bins.some(bin => bin.name.toLowerCase() === searchValue.toLowerCase()) &&
    onCreateBin;

  return (
    <div className="w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between px-4 py-3 bg-gray-800 border-gray-600 rounded-xl text-white hover:bg-gray-700 focus:ring-[#C6D600] focus:border-[#C6D600]"
          >
            {selectedBin ? (
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: selectedBin.color }}
                />
                <span>{selectedBin.name}</span>
              </div>
            ) : (
              <span className="text-gray-400">{placeholder}</span>
            )}
            <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0 bg-gray-800 border-gray-600" align="start">
          <div className="bg-gray-800">
            <div className="flex items-center border-b border-gray-600 px-3">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <Input
                placeholder="Search bins or type to create new..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-gray-400 border-none focus:ring-0"
              />
            </div>
            <div className="max-h-64 overflow-y-auto">
              {showCreateOption && (
                <div className="p-2 border-b border-gray-600">
                  <button
                    onClick={() => {
                      if (onCreateBin && searchValue.trim()) {
                        onCreateBin(searchValue.trim());
                        setSearchValue("");
                        setOpen(false);
                      }
                    }}
                    className="w-full flex items-center gap-2 text-[#C6D600] cursor-pointer hover:bg-gray-700 p-2 rounded text-left"
                  >
                    <Plus className="h-4 w-4" />
                    Create bin "{searchValue}"
                  </button>
                </div>
              )}
              
              {filteredBins.frequentBins.length > 0 && (
                <div className="p-2 border-b border-gray-600">
                  <div className="text-xs text-gray-400 mb-2 px-2">Frequently Used</div>
                  {filteredBins.frequentBins.map((bin) => (
                    <button
                      key={bin.id}
                      onClick={() => {
                        onBinSelect(bin.id);
                        setOpen(false);
                        setSearchValue("");
                      }}
                      className="w-full flex items-center justify-between cursor-pointer hover:bg-gray-700 p-2 rounded text-left text-white"
                    >
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: bin.color }}
                        />
                        <span>{bin.name}</span>
                        <span className="text-xs text-gray-400">
                          ({bin.thoughtmarkCount})
                        </span>
                      </div>
                      <Check
                        className={cn(
                          "h-4 w-4",
                          selectedBinId === bin.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </button>
                  ))}
                </div>
              )}

              {filteredBins.otherBins.length > 0 && (
                <div className="p-2">
                  <div className="text-xs text-gray-400 mb-2 px-2">{filteredBins.frequentBins.length > 0 ? "All Bins" : "Bins"}</div>
                  {filteredBins.otherBins.map((bin) => (
                    <button
                      key={bin.id}
                      onClick={() => {
                        onBinSelect(bin.id);
                        setOpen(false);
                        setSearchValue("");
                      }}
                      className="w-full flex items-center justify-between cursor-pointer hover:bg-gray-700 p-2 rounded text-left text-white"
                    >
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: bin.color }}
                        />
                        <span>{bin.name}</span>
                      </div>
                      <Check
                        className={cn(
                          "h-4 w-4",
                          selectedBinId === bin.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </button>
                  ))}
                </div>
              )}

              {filteredBins.frequentBins.length === 0 && filteredBins.otherBins.length === 0 && !showCreateOption && (
                <div className="py-6 text-center text-sm text-gray-400">
                  No bins found.
                </div>
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}