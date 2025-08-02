export interface AccessibilityConfig {
  isScreenReaderEnabled: boolean;
  isReduceMotionEnabled: boolean;
  isReduceTransparencyEnabled: boolean;
  isInvertColorsEnabled: boolean;
  isBoldTextEnabled: boolean;
  isGrayscaleEnabled: boolean;
  isLargeTextEnabled: boolean;
  fontSizeScale: number;
  contrastLevel: 'normal' | 'high' | 'inverted';
}

export interface AccessibilityProps {
  accessible?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityRole?: string;
  accessibilityState?: Record<string, boolean | string | number>;
  accessibilityActions?: Array<{ name: string; label?: string }>;
  accessibilityViewIsModal?: boolean;
  accessibilityElementsHidden?: boolean;
  accessibilityIgnoresInvertColors?: boolean;
}

export interface AccessibilityEvent {
  type: 'focus' | 'blur' | 'announcement' | 'action';
  target: string;
  data?: Record<string, unknown>;
  timestamp: number;
}

export interface AccessibilityAnnouncement {
  message: string;
  priority: 'low' | 'normal' | 'high';
  delay?: number;
} 