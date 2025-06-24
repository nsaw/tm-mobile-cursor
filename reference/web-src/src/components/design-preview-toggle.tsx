import { useState, useEffect } from "react";
import { Palette, Sparkles, Square, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Theme = 'fluid' | 'solid';

export function DesignPreviewToggle() {
  const [currentTheme, setCurrentTheme] = useState<Theme>('fluid');

  useEffect(() => {
    // Check for saved theme preference, default to fluid
    const saved = localStorage.getItem('thoughtmarks-theme') as Theme;
    const theme = saved || 'fluid';
    setCurrentTheme(theme);
    applyTheme(theme);
  }, []);

  const applyTheme = (theme: Theme) => {
    // Remove all theme classes
    document.documentElement.classList.remove('fluid-theme', 'solid-theme');
    
    if (theme === 'fluid') {
      document.documentElement.classList.add('fluid-theme');
      document.documentElement.setAttribute('data-theme', 'fluid');
    } else {
      document.documentElement.classList.add('solid-theme');
      document.documentElement.setAttribute('data-theme', 'solid');
    }
  };

  const changeTheme = (theme: Theme) => {
    setCurrentTheme(theme);
    localStorage.setItem('thoughtmarks-theme', theme);
    applyTheme(theme);
  };

  const getThemeIcon = (theme: Theme) => {
    switch (theme) {
      case 'fluid':
        return <Sparkles className="w-4 h-4" />;
      case 'solid':
        return <Square className="w-4 h-4" />;
    }
  };

  const getThemeLabel = (theme: Theme) => {
    switch (theme) {
      case 'fluid':
        return 'Fluid';
      case 'solid':
        return 'Solid';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={`
              flex items-center gap-2 backdrop-blur-xl border transition-all duration-300
              ${currentTheme === 'fluid'
                ? 'bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20' 
                : 'bg-gray-900/80 border-gray-700/50 text-gray-300 hover:bg-gray-800/80'
              }
            `}
          >
            <Palette className="w-4 h-4" />
            {getThemeIcon(currentTheme)}
            <span className="text-xs">{getThemeLabel(currentTheme)}</span>
            <ChevronDown className="w-3 h-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-gray-900/95 backdrop-blur-xl border-gray-700/50">
          <DropdownMenuItem
            onClick={() => changeTheme('fluid')}
            className={`flex items-center gap-2 cursor-pointer ${
              currentTheme === 'fluid' ? 'text-blue-400 bg-blue-500/10' : 'text-gray-300 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Fluid Theme</span>
            {currentTheme === 'fluid' && <span className="text-xs opacity-60">Default</span>}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => changeTheme('solid')}
            className={`flex items-center gap-2 cursor-pointer ${
              currentTheme === 'solid' ? 'text-blue-400 bg-blue-500/10' : 'text-gray-300 hover:text-white'
            }`}
          >
            <Square className="w-4 h-4" />
            <span>Solid Theme</span>
            {currentTheme === 'solid' && <span className="text-xs opacity-60">Classic</span>}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}