import { cn } from "@/lib/utils";

interface TagChipProps {
  tag: string;
  className?: string;
  variant?: "default" | "primary" | "secondary";
  onClick?: () => void;
}

// Function to generate consistent colors based on tag name
function getTagColor(tag: string): string {
  // Hue values for different color families
  const hueRanges = [
    { name: "blue", hue: 220, binCategories: ["ideas", "thoughts", "notes"] },
    { name: "green", hue: 120, binCategories: ["growth", "nature", "health", "positive"] },
    { name: "purple", hue: 280, binCategories: ["creative", "inspiration", "magic"] },
    { name: "pink", hue: 320, binCategories: ["personal", "love", "relationships"] },
    { name: "orange", hue: 30, binCategories: ["energy", "work", "productivity"] },
    { name: "red", hue: 0, binCategories: ["urgent", "important", "critical"] },
    { name: "indigo", hue: 240, binCategories: ["deep", "philosophy", "wisdom"] },
    { name: "teal", hue: 180, binCategories: ["calm", "balance", "zen"] },
    { name: "yellow", hue: 60, binCategories: ["bright", "happy", "sunny"] },
    { name: "cyan", hue: 190, binCategories: ["cool", "tech", "digital"] },
    { name: "lime", hue: 90, binCategories: ["fresh", "new", "vibrant"] },
    { name: "amber", hue: 45, binCategories: ["warm", "cozy", "comfort"] },
    { name: "emerald", hue: 140, binCategories: ["precious", "valuable", "gems"] },
    { name: "violet", hue: 260, binCategories: ["mystical", "spiritual", "ethereal"] },
    { name: "rose", hue: 340, binCategories: ["gentle", "soft", "tender"] },
    { name: "sky", hue: 200, binCategories: ["open", "free", "limitless"] },
    { name: "slate", hue: 210, binCategories: ["neutral", "stable", "foundation"] }
  ];

  // Check if tag matches any bin category for semantic color mapping
  const tagLower = tag.toLowerCase();
  let selectedHue = 220; // default blue
  
  for (const hueRange of hueRanges) {
    if (hueRange.binCategories.some(category => 
      tagLower.includes(category) || category.includes(tagLower)
    )) {
      selectedHue = hueRange.hue;
      break;
    }
  }
  
  // If no semantic match, use hash-based selection
  if (selectedHue === 220) {
    let hash = 0;
    for (let i = 0; i < tag.length; i++) {
      hash = ((hash << 5) - hash + tag.charCodeAt(i)) & 0xffffffff;
    }
    const colorIndex = Math.abs(hash) % hueRanges.length;
    selectedHue = hueRanges[colorIndex].hue;
  }
  
  // Create vibrant colors with 50% transparency
  const lightness = selectedHue === 60 || selectedHue === 45 || selectedHue === 90 ? 40 : 55; // darker for yellow-based colors
  
  // Use predefined color classes with reduced saturation
  const colorMap: { [key: number]: string } = {
    0: 'bg-red-400',      // red
    30: 'bg-orange-400',  // orange
    45: 'bg-amber-400',   // amber
    60: 'bg-yellow-400',  // yellow
    90: 'bg-lime-400',    // lime
    120: 'bg-green-400',  // green
    180: 'bg-cyan-400',   // cyan
    210: 'bg-blue-400',   // blue
    240: 'bg-indigo-400', // indigo
    270: 'bg-purple-400', // purple
    300: 'bg-pink-400',   // pink
    330: 'bg-rose-400'    // rose
  };
  
  const baseColor = colorMap[selectedHue] || 'bg-gray-400';
  return `text-white ${baseColor} bg-opacity-50`;
}

export function TagChip({ tag, className, variant = "default", onClick }: TagChipProps) {
  const isSelected = variant === "primary";
  
  return (
    <span
      className={cn(
        "tag-chip inline-flex items-center px-3 py-2 rounded-full text-xs font-medium cursor-pointer transition-all duration-200",
        isSelected ? "selected" : "hover:bg-white/12 hover:border-white/20",
        className
      )}
      style={{
        backgroundColor: isSelected ? '#1e293b' : 'rgba(255, 255, 255, 0.08)',
        borderColor: isSelected ? '#3b82f6' : 'rgba(255, 255, 255, 0.12)',
        color: isSelected ? '#60a5fa' : '#f0f0f5',
        border: '1px solid',
        fontWeight: isSelected ? 600 : 400,
        boxShadow: 'none'
      }}
      onClick={onClick}
    >
      {tag}
    </span>
  );
}
