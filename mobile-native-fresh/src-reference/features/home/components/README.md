# ThoughtmarkCard Component

A comprehensive React Native card component for displaying thoughtmarks, converted from the web version with full mobile-optimized functionality.

## Features

- **Responsive Design**: Adapts to different screen sizes and orientations
- **Interactive Actions**: Tap to view, long press for context menu
- **Selection Mode**: Checkbox selection for bulk operations
- **Pin Support**: Visual indicators for pinned thoughtmarks
- **Tag Display**: Shows tags with custom styling
- **Similarity Scoring**: Optional similarity percentage display
- **Context Menu**: Action sheet with edit, pin, share, archive options
- **Theme Integration**: Uses the app's theme system for consistent styling

## Props

```typescript
interface ThoughtmarkCardProps {
  thoughtmark: ThoughtmarkWithBin;           // Required: The thoughtmark data
  onEdit?: () => void;                       // Optional: Edit callback
  onDelete?: () => void;                     // Optional: Delete callback
  onArchive?: () => void;                    // Optional: Archive callback
  onClick?: () => void;                      // Optional: Card press callback
  enableSwipeDelete?: boolean;               // Optional: Enable swipe-to-delete (future)
  showSimilarity?: boolean;                  // Optional: Show similarity score
  similarity?: number;                       // Optional: Similarity percentage (0-1)
  isSelectable?: boolean;                    // Optional: Enable selection mode
  isSelected?: boolean;                      // Optional: Selection state
  onSelectionToggle?: (id: number) => void;  // Optional: Selection toggle callback
}
```

## Usage Examples

### Basic Usage
```tsx
import { ThoughtmarkCard } from './ThoughtmarkCard';

<ThoughtmarkCard
  thoughtmark={thoughtmarkData}
  onClick={() => navigation.navigate('ThoughtmarkDetail', { id: thoughtmarkData.id })}
/>
```

### With All Actions
```tsx
<ThoughtmarkCard
  thoughtmark={thoughtmarkData}
  onClick={() => handleView(thoughtmarkData)}
  onEdit={() => handleEdit(thoughtmarkData)}
  onArchive={() => handleArchive(thoughtmarkData)}
  onDelete={() => handleDelete(thoughtmarkData)}
/>
```

### Selection Mode
```tsx
<ThoughtmarkCard
  thoughtmark={thoughtmarkData}
  isSelectable={true}
  isSelected={selectedIds.includes(thoughtmarkData.id)}
  onSelectionToggle={(id) => handleSelectionToggle(id)}
  onClick={() => handleView(thoughtmarkData)}
/>
```

### With Similarity Score
```tsx
<ThoughtmarkCard
  thoughtmark={thoughtmarkData}
  showSimilarity={true}
  similarity={0.85}
  onClick={() => handleView(thoughtmarkData)}
/>
```

## Data Structure

The component expects a `ThoughtmarkWithBin` object:

```typescript
interface ThoughtmarkWithBin extends Thoughtmark {
  binName?: string;
}

interface Thoughtmark {
  id: number;
  title: string;
  content: string;
  binId?: number;
  userId: number;
  tags: string[];
  aiSummary?: string;
  aiCategorySuggestions: string[];
  voiceNoteUrl?: string;
  voiceTranscription?: string;
  isArchived: boolean;
  isPinned: boolean;
  isDeleted: boolean;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}
```

## Interactions

### Tap
- If in selection mode: toggles selection
- Otherwise: calls `onClick` callback

### Long Press
- Shows context menu with available actions
- Provides haptic feedback

### Context Menu Actions
- **View**: Opens the thoughtmark detail view
- **Edit**: Opens edit mode
- **Pin/Unpin**: Toggles pin status
- **Share**: Opens share dialog (TODO: implement)
- **Archive**: Archives the thoughtmark

## Styling

The component uses the app's theme system:

- **Colors**: `colors.card`, `colors.text`, `colors.subtext`, `colors.border`
- **Spacing**: `spacing.xs`, `spacing.sm`, `spacing.md`, `spacing.lg`
- **Typography**: `typography.heading`, `typography.body`

## Dependencies

- `@expo/vector-icons` - For icons
- `react-native` - Core React Native components
- Theme system (`../../../theme/theme`)
- Supporting components:
  - `TagChip` - For tag display
  - `ActionSheet` - For context menu

## Future Enhancements

- [ ] Swipe-to-delete functionality
- [ ] Share dialog implementation
- [ ] Voice note playback
- [ ] AI insights display
- [ ] Drag and drop reordering
- [ ] Custom animations
- [ ] Accessibility improvements

## Testing

Use the `ThoughtmarkCardExample` component to test different states and configurations:

```tsx
import { ThoughtmarkCardExample } from './ThoughtmarkCardExample';

// In your test screen
<ThoughtmarkCardExample />
``` 