import { useEffect } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  action: () => void;
  description: string;
  scope?: 'global' | 'thoughtmark' | 'dashboard';
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[] = []) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Default global shortcuts
  const globalShortcuts: KeyboardShortcut[] = [
    {
      key: 'k',
      ctrlKey: true,
      action: () => {
        const searchInput = document.querySelector('.search-input') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
          searchInput.select();
        } else {
          setLocation('/search');
        }
      },
      description: 'Quick search'
    },
    {
      key: 'n',
      ctrlKey: true,
      action: () => setLocation('/thoughtmarks/create'),
      description: 'New thoughtmark'
    },
    {
      key: 'h',
      ctrlKey: true,
      action: () => setLocation('/'),
      description: 'Home dashboard'
    },
    {
      key: 'b',
      ctrlKey: true,
      action: () => setLocation('/all-bins'),
      description: 'View all bins'
    },
    {
      key: 't',
      ctrlKey: true,
      action: () => setLocation('/tasks'),
      description: 'View tasks'
    },
    {
      key: '/',
      action: () => {
        toast({
          title: "Keyboard Shortcuts",
          description: (
            <div className="space-y-1 text-sm">
              <div>⌘K - Quick search</div>
              <div>⌘N - New thoughtmark</div>
              <div>⌘H - Home dashboard</div>
              <div>⌘B - View all bins</div>
              <div>⌘T - View tasks</div>
              <div>? - Show shortcuts</div>
              <div>Esc - Close dialogs</div>
            </div>
          ),
        });
      },
      description: 'Show keyboard shortcuts'
    },
    {
      key: 'Escape',
      action: () => {
        // Close any open dialogs or modals
        const closeButtons = document.querySelectorAll('[data-dialog-close], [aria-label="Close"]');
        const lastButton = closeButtons[closeButtons.length - 1] as HTMLElement;
        if (lastButton) {
          lastButton.click();
        }
        
        // Clear any focused search inputs
        const searchInput = document.querySelector('.search-input') as HTMLInputElement;
        if (searchInput && document.activeElement === searchInput) {
          searchInput.blur();
        }
      },
      description: 'Close dialogs/clear focus'
    }
  ];

  const allShortcuts = [...globalShortcuts, ...shortcuts];

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      // Don't trigger shortcuts when typing in inputs (except Escape)
      if (event.target instanceof HTMLInputElement || 
          event.target instanceof HTMLTextAreaElement) {
        if (event.key !== 'Escape') return;
      }

      const shortcut = allShortcuts.find(s => {
        const keyMatch = s.key.toLowerCase() === event.key.toLowerCase();
        const ctrlMatch = s.ctrlKey ? (event.ctrlKey || event.metaKey) : !event.ctrlKey && !event.metaKey;
        const shiftMatch = s.shiftKey ? event.shiftKey : !event.shiftKey;
        
        return keyMatch && ctrlMatch && shiftMatch;
      });

      if (shortcut) {
        event.preventDefault();
        event.stopPropagation();
        shortcut.action();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [allShortcuts]);

  return allShortcuts;
}

// Hook for thoughtmark-specific shortcuts
export function useThoughtmarkShortcuts(
  onSave?: () => void,
  onDelete?: () => void,
  onEdit?: () => void
) {
  const thoughtmarkShortcuts: KeyboardShortcut[] = [
    ...(onSave ? [{
      key: 's',
      ctrlKey: true,
      action: onSave,
      description: 'Save thoughtmark',
      scope: 'thoughtmark' as const
    }] : []),
    ...(onEdit ? [{
      key: 'e',
      ctrlKey: true,
      action: onEdit,
      description: 'Edit thoughtmark',
      scope: 'thoughtmark' as const
    }] : []),
    ...(onDelete ? [{
      key: 'Delete',
      shiftKey: true,
      action: onDelete,
      description: 'Delete thoughtmark',
      scope: 'thoughtmark' as const
    }] : [])
  ];

  return useKeyboardShortcuts(thoughtmarkShortcuts);
}