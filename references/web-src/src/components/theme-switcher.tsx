import { useVisualTheme } from "@/components/visual-theme-provider";
import { Sparkles, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type VisualTheme = 'fluid' | 'solid';

export function ThemeSwitcher() {
  const { visualTheme, setVisualTheme } = useVisualTheme();

  const getThemeIcon = (theme: VisualTheme) => {
    switch (theme) {
      case 'fluid':
        return <Sparkles className="w-4 h-4" />;
      case 'solid':
        return <Square className="w-4 h-4" />;
    }
  };

  const getThemeLabel = (theme: VisualTheme) => {
    switch (theme) {
      case 'fluid':
        return 'Fluid Glass';
      case 'solid':
        return 'Classic Solid';
    }
  };

  return (
    <div className="theme-selector">
      <Select value={visualTheme} onValueChange={setVisualTheme}>
        <SelectTrigger className="w-48">
          <SelectValue>
            <div className="flex items-center gap-2">
              {getThemeIcon(visualTheme)}
              <span>{getThemeLabel(visualTheme)}</span>
              {visualTheme === 'fluid' && (
                <span className="text-xs opacity-60 ml-auto">Default</span>
              )}
              {visualTheme === 'solid' && (
                <span className="text-xs opacity-60 ml-auto">Classic</span>
              )}
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="fluid">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>Fluid Glass</span>
              <span className="text-xs opacity-60 ml-auto">Default</span>
            </div>
          </SelectItem>
          <SelectItem value="solid">
            <div className="flex items-center gap-2">
              <Square className="w-4 h-4" />
              <span>Classic Solid</span>
              <span className="text-xs opacity-60 ml-auto">Classic</span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}