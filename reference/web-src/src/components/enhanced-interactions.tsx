import React, { useState, useRef, useCallback, useEffect } from "react";
import { createPortal } from 'react-dom';
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { TagChip } from "@/components/ui/tag-chip";
import { getTagColor } from "@/lib/user-template";

// Enhanced button with press feedback and proper touch targets
interface EnhancedButtonProps extends React.ComponentProps<typeof Button> {
  children: React.ReactNode;
  hapticFeedback?: boolean;
  pressAnimation?: boolean;
}

export function EnhancedButton({ 
  children, 
  className = "", 
  hapticFeedback = true, 
  pressAnimation = true,
  onClick,
  ...props 
}: EnhancedButtonProps) {
  const [isPressed, setIsPressed] = useState(false);
  const pressTimer = useRef<NodeJS.Timeout>();

  const handlePress = useCallback(() => {
    if (pressAnimation) {
      setIsPressed(true);
      clearTimeout(pressTimer.current);
      pressTimer.current = setTimeout(() => setIsPressed(false), 150);
    }
    
    // Haptic feedback for mobile
    if (hapticFeedback && 'vibrate' in navigator) {
      navigator.vibrate(10);
    }
  }, [pressAnimation, hapticFeedback]);

  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    handlePress();
    onClick?.(e);
  }, [onClick, handlePress]);

  return (
    <Button
      {...props}
      className={`
        touch-target transition-all duration-200 ease-out
        ${isPressed ? 'animate-press' : ''}
        ${className}
      `}
      onClick={handleClick}
      onTouchStart={handlePress}
    >
      {children}
    </Button>
  );
}

// Enhanced card with hover and press states
interface InteractiveCardProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  isOptimistic?: boolean;
  showSuccessState?: boolean;
}

export function InteractiveCard({ 
  children, 
  onClick, 
  className = "", 
  isOptimistic = false,
  showSuccessState = false 
}: InteractiveCardProps) {
  const [isPressed, setIsPressed] = useState(false);
  const [showSuccess, setShowSuccess] = useState(showSuccessState);

  const handlePress = useCallback(() => {
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 150);
    
    if (showSuccessState) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 1000);
    }
    
    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
    
    onClick?.();
  }, [onClick, showSuccessState]);

  return (
    <div 
      className={`
        interactive-card relative
        ${isPressed ? 'scale-[0.98]' : 'scale-100'}
        ${isOptimistic ? 'opacity-70' : 'opacity-100'}
        ${showSuccess ? 'ring-2 ring-green-400/50' : ''}
        transition-all duration-200 ease-out
        ${className}
      `}
      onClick={handlePress}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handlePress();
        }
      }}
    >
      {children}
      
      {/* Success overlay */}
      {showSuccess && (
        <div className="absolute inset-0 flex items-center justify-center bg-green-500/20 rounded-lg backdrop-blur-sm animate-fade-in">
          <div className="flex items-center gap-2 text-green-400 font-medium">
            <svg className="w-5 h-5 animate-bounce" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
            <span className="text-sm">Updated!</span>
          </div>
        </div>
      )}
      
      {/* Optimistic update indicator */}
      {isOptimistic && (
        <div className="absolute top-2 right-2 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
      )}
    </div>
  );
}

// Smart tag input with suggestions
interface SmartTagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  suggestions?: string[];
  placeholder?: string;
}

export function SmartTagInput({ value, onChange, suggestions = [], placeholder = "Add tags..." }: SmartTagInputProps) {
  const [existingTags, setExistingTags] = useState<string[]>([]);
  const [recentTags, setRecentTags] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch existing tags from all thoughtmarks
  useEffect(() => {
    const fetchExistingTags = async () => {
      try {
        const response = await apiRequest("GET", "/api/thoughtmarks");
        if (response.ok) {
          const thoughtmarks = await response.json();
          const allTags = thoughtmarks.flatMap((tm: any) => tm.tags || []) as string[];
          const uniqueTags = Array.from(new Set(allTags));
          
          // Sort by frequency (most used first)
          const tagFrequency = allTags.reduce((acc, tag) => {
            acc[tag] = (acc[tag] || 0) + 1;
            return acc;
          }, {} as Record<string, number>);
          
          const sortedTags = uniqueTags.sort((a, b) => tagFrequency[b] - tagFrequency[a]);
          setExistingTags(sortedTags);
          setRecentTags(sortedTags.slice(0, 6)); // Top 6 most used
        }
      } catch (error) {
        console.warn("Failed to fetch existing tags:", error);
      }
    };
    
    fetchExistingTags();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update dropdown position when opening
  const updateDropdownPosition = useCallback(() => {
    if (inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        width: rect.width
      });
    }
  }, []);

  // Update position when opening dropdown
  useEffect(() => {
    if (isOpen) {
      updateDropdownPosition();
      const handleResize = () => updateDropdownPosition();
      window.addEventListener('resize', handleResize);
      window.addEventListener('scroll', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('scroll', handleResize);
      };
    }
  }, [isOpen, updateDropdownPosition]);

  const addTag = useCallback((tag: string) => {
    if (tag && !value.includes(tag)) {
      onChange([...value, tag]);
      setSearchTerm("");
      setIsOpen(false);
    }
  }, [value, onChange]);

  const removeTag = useCallback((tagToRemove: string) => {
    onChange(value.filter(tag => tag !== tagToRemove));
  }, [value, onChange]);

  // Filter tags based on search term
  const filteredTags = existingTags.filter(tag => 
    !value.includes(tag) && 
    tag.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredRecentTags = recentTags.filter(tag => 
    !value.includes(tag) && 
    tag.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-3" ref={containerRef}>
      {/* Tag display - Match dashboard styling exactly */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 animate-fade-in">
          {value.map(tag => {
            const tagColor = getTagColor(tag);
            return (
              <div key={tag} className="inline-flex items-center gap-1.5">
                <div
                  className="cursor-pointer transition-all duration-200 whitespace-nowrap flex-shrink-0 px-3 py-2 rounded-sm touch-target flex items-center justify-center border text-black"
                  style={{ 
                    fontFamily: 'Ubuntu', 
                    fontWeight: 400, 
                    fontSize: '8pt', 
                    textTransform: 'lowercase',
                    height: '75%',
                    minHeight: '75%',
                    textAlign: 'center',
                    backgroundColor: tagColor,
                    borderColor: tagColor
                  }}
                >
                  {tag}
                </div>
                <button
                  onClick={() => removeTag(tag)}
                  className="w-4 h-4 flex items-center justify-center rounded-full hover:bg-red-400/20 hover:text-red-400 transition-colors touch-target text-gray-400"
                  aria-label={`Remove tag ${tag}`}
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Searchable dropdown */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && searchTerm.trim()) {
              e.preventDefault();
              addTag(searchTerm.trim());
            } else if (e.key === 'Escape') {
              setIsOpen(false);
              setSearchTerm("");
            }
          }}
          placeholder={placeholder}
          className="w-full px-3 py-2 bg-[#202124] border border-[#404145] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C6D600]/50 focus:border-[#C6D600]/50 transition-all duration-200"
        />

      </div>

      {/* Portal-based dropdown */}
      {isOpen && typeof window !== 'undefined' && createPortal(
        <div 
          className="fixed bg-[#202124] border border-[#404145] rounded-lg shadow-xl max-h-64 overflow-y-auto z-[9999]"
          style={{
            top: dropdownPosition.top,
            left: dropdownPosition.left,
            width: dropdownPosition.width,
            minWidth: '200px'
          }}
        >
          {/* Recent tags section */}
          {!searchTerm && filteredRecentTags.length > 0 && (
            <>
              <div className="px-3 py-2 text-xs text-gray-400 font-medium border-b border-[#404145]/50">
                Recent
              </div>
              {filteredRecentTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => addTag(tag)}
                  className="w-full px-3 py-2 text-left hover:bg-[#303134] transition-colors text-white text-sm border-b border-[#404145]/30 last:border-b-0"
                >
                  #{tag}
                </button>
              ))}
            </>
          )}

          {/* All tags section */}
          {filteredTags.length > 0 && (
            <>
              {!searchTerm && filteredRecentTags.length > 0 && (
                <div className="px-3 py-2 text-xs text-gray-400 font-medium border-b border-[#404145]/50">
                  All Tags
                </div>
              )}
              {filteredTags.slice(0, 15).map(tag => (
                <button
                  key={tag}
                  onClick={() => addTag(tag)}
                  className="w-full px-3 py-2 text-left hover:bg-[#303134] transition-colors text-white text-sm border-b border-[#404145]/30 last:border-b-0"
                >
                  #{tag}
                </button>
              ))}
            </>
          )}

          {/* Create new tag option */}
          {searchTerm.trim() && !existingTags.includes(searchTerm.trim()) && (
            <button
              onClick={() => addTag(searchTerm.trim())}
              className="w-full px-3 py-2 text-left hover:bg-[#303134] transition-colors text-[#C6D600] text-sm border-t border-[#404145]"
            >
              Create "{searchTerm.trim()}"
            </button>
          )}

          {/* No results */}
          {filteredTags.length === 0 && !searchTerm.trim() && (
            <div className="px-3 py-2 text-gray-400 text-sm">
              No tags available
            </div>
          )}
        </div>,
        document.body
      )}
    </div>
  );
}

// Searchable Bin Selector
interface SearchableBinSelectorProps {
  value: number | undefined;
  onChange: (binId: number | undefined) => void;
  bins: any[];
  placeholder?: string;
}

export function SearchableBinSelector({ value, onChange, bins, placeholder = "Choose collection..." }: SearchableBinSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter bins based on search term
  const filteredBins = bins.filter(bin => 
    bin && bin.name && bin.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get selected bin name
  const selectedBin = bins.find(bin => bin && bin.id === value);
  const displayValue = selectedBin ? selectedBin.name : "";

  const selectBin = useCallback((binId: number | undefined) => {
    onChange(binId);
    setSearchTerm("");
    setIsOpen(false);
  }, [onChange]);

  return (
    <div className="relative" ref={containerRef}>
      <input
        type="text"
        value={isOpen ? searchTerm : displayValue}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => {
          setIsOpen(true);
          setSearchTerm("");
        }}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            setIsOpen(false);
            setSearchTerm("");
          }
        }}
        placeholder={placeholder}
        className="w-full px-3 py-2 bg-[#202124] border border-[#404145] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C6D600]/50 focus:border-[#C6D600]/50 transition-all duration-200"
      />

      {/* Dropdown list */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-[#202124] border border-[#404145] rounded-lg shadow-xl max-h-64 overflow-y-auto z-[999]">
          {/* Default option */}
          <button
            onClick={() => selectBin(undefined)}
            className="w-full px-3 py-2 text-left hover:bg-[#303134] transition-colors text-gray-300 text-sm border-b border-[#404145]/30"
          >
            Sort Later (default)
          </button>

          {/* Filtered bins */}
          {filteredBins.length > 0 ? (
            filteredBins.map(bin => (
              <button
                key={bin.id}
                onClick={() => selectBin(bin.id)}
                className="w-full px-3 py-2 text-left hover:bg-[#303134] transition-colors text-white text-sm border-b border-[#404145]/30 last:border-b-0"
              >
                {bin.name}
              </button>
            ))
          ) : searchTerm && (
            <div className="px-3 py-2 text-gray-400 text-sm">
              No collections found
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Enhanced form validation with inline feedback
interface ValidatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: boolean;
  validation?: (value: string) => string | null;
}

export function ValidatedInput({ 
  label, 
  error, 
  success = false, 
  validation, 
  className = "",
  onChange,
  ...props 
}: ValidatedInputProps) {
  const [localError, setLocalError] = useState<string | null>(null);
  const [isTouched, setIsTouched] = useState(false);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    if (validation && isTouched) {
      const validationError = validation(value);
      setLocalError(validationError);
    }
    
    onChange?.(e);
  }, [validation, isTouched, onChange]);

  const displayError = error || localError;

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-300">
          {label}
        </label>
      )}
      
      <div className="relative">
        <input
          {...props}
          onChange={handleChange}
          onBlur={() => setIsTouched(true)}
          className={`
            w-full px-3 py-2 bg-[#202124] border rounded-lg text-white placeholder-gray-400 
            transition-all duration-200 focus:outline-none focus:ring-2
            ${displayError 
              ? 'border-red-500 focus:ring-red-500/50' 
              : success 
                ? 'border-green-500 focus:ring-green-500/50'
                : 'border-border focus:ring-[#C6D600]/50'
            }
            ${className}
          `}
        />
        
        {/* Success indicator */}
        {success && !displayError && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-400">
            ✓
          </div>
        )}
        
        {/* Error indicator */}
        {displayError && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-400">
            !
          </div>
        )}
      </div>
      
      {/* Error message */}
      {displayError && (
        <p className="text-red-400 text-xs animate-fade-in">
          {displayError}
        </p>
      )}
    </div>
  );
}