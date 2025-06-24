import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Search, Plus, X } from "lucide-react";

interface TagSelectorProps {
  availableTags: string[];
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
}

export function TagSelector({
  availableTags,
  selectedTags,
  onTagsChange,
  placeholder = "Add tags...",
  maxTags = 10
}: TagSelectorProps) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  // Filter available tags based on search and exclude already selected ones
  const filteredTags = useMemo(() => {
    const unselectedTags = availableTags.filter(tag => !selectedTags.includes(tag));
    
    if (!searchValue) return unselectedTags;
    
    const query = searchValue.toLowerCase();
    return unselectedTags.filter(tag => 
      tag.toLowerCase().includes(query)
    );
  }, [availableTags, selectedTags, searchValue]);

  const hasExactMatch = availableTags.some(tag => 
    tag.toLowerCase() === searchValue.toLowerCase()
  );

  const showCreateOption = searchValue && !hasExactMatch && selectedTags.length < maxTags;

  const handleAddTag = (tag: string) => {
    if (!selectedTags.includes(tag) && selectedTags.length < maxTags) {
      onTagsChange([...selectedTags, tag]);
    }
    setSearchValue("");
    setOpen(false);
  };

  const handleCreateTag = () => {
    if (searchValue && !selectedTags.includes(searchValue) && selectedTags.length < maxTags) {
      onTagsChange([...selectedTags, searchValue]);
      setSearchValue("");
      setOpen(false);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onTagsChange(selectedTags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="space-y-2">
      {/* Selected Tags */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedTags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="bg-[#C6D600]/20 text-[#C6D600] border-[#C6D600]/30 px-2 py-1 text-xs font-medium"
            >
              {tag}
              <button
                onClick={() => handleRemoveTag(tag)}
                className="ml-1 hover:text-[#C6D600]/70"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Add Tag Selector */}
      {selectedTags.length < maxTags && (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between px-4 py-3 bg-gray-800 border-gray-600 rounded-xl text-white hover:bg-gray-700 focus:ring-[#C6D600] focus:border-[#C6D600]"
            >
              <span className="text-gray-400">{placeholder}</span>
              <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[--radix-popover-trigger-width] p-0 bg-gray-800 border-gray-600" align="start" side="bottom" sideOffset={4}>
            <div className="bg-gray-800">
              <div className="flex items-center border-b border-gray-600 px-3">
                <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                <Input
                  placeholder="Search tags or type to create new..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-gray-400 border-none focus:ring-0"
                />
              </div>
              <div className="max-h-64 overflow-y-auto">
                {showCreateOption && (
                  <div className="p-2 border-b border-gray-600">
                    <button
                      onClick={handleCreateTag}
                      className="w-full flex items-center gap-2 text-[#C6D600] cursor-pointer hover:bg-gray-700 p-2 rounded text-left"
                    >
                      <Plus className="h-4 w-4" />
                      Create tag "{searchValue}"
                    </button>
                  </div>
                )}
                
                {filteredTags.length > 0 && (
                  <div className="p-2">
                    <div className="text-xs text-gray-400 mb-2 px-2">Available Tags</div>
                    {filteredTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => handleAddTag(tag)}
                        className="w-full flex items-center justify-between cursor-pointer hover:bg-gray-700 p-2 rounded text-left text-white"
                      >
                        <span>{tag}</span>
                        <Plus className="h-4 w-4 opacity-50" />
                      </button>
                    ))}
                  </div>
                )}

                {filteredTags.length === 0 && !showCreateOption && (
                  <div className="py-6 text-center text-sm text-gray-400">
                    No tags found.
                  </div>
                )}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      )}

      {selectedTags.length >= maxTags && (
        <p className="text-xs text-gray-400">
          Maximum {maxTags} tags reached
        </p>
      )}
    </div>
  );
}