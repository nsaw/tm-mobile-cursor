// GHOST 2.x Unified Directory Paths
// Updated routing for BRAUN autopilot and summary systems

export const PATCH_WATCH_DIR = '/Users/sawyer/gitSync/.cursor-cache/MAIN/patches/';
export const PATCH_COMPLETED_DIR = '/Users/sawyer/gitSync/.cursor-cache/MAIN/patches/.completed/';
export const SUMMARY_WRITE_DIR = '/Users/sawyer/gitSync/.cursor-cache/MAIN/summaries/';
export const SUMMARY_ARCHIVE_DIR = '/Users/sawyer/gitSync/.cursor-cache/MAIN/summaries/.archive/';

// Legacy paths for backward compatibility (deprecated)
export const LEGACY_PATCH_DIR = '/Users/sawyer/gitSync/tm-mobile-cursor/mobile-native-fresh/tasks/patches/';
export const LEGACY_SUMMARY_DIR = '/Users/sawyer/gitSync/tm-mobile-cursor/mobile-native-fresh/tasks/summaries/';

// Validation paths
export const VALIDATION_PATHS = {
  PATCH_WATCH_DIR,
  PATCH_COMPLETED_DIR,
  SUMMARY_WRITE_DIR,
  SUMMARY_ARCHIVE_DIR
};

// Migration status
export const MIGRATION_STATUS = {
  GHOST_2X_ENABLED: true,
  LEGACY_FALLBACK: false,
  UNIFIED_ROUTING: true
}; 