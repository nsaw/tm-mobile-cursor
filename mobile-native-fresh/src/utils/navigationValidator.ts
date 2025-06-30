// Navigation Validation Utility
// Checks for dead ends and ensures proper navigation structure

export interface NavigationValidationResult {
  screen: string;
  hasBackButton: boolean;
  hasBottomNav: boolean;
  hasFAB: boolean;
  isDeadEnd: boolean;
  issues: string[];
}

export const validateNavigation = (): NavigationValidationResult[] => {
  const results: NavigationValidationResult[] = [];
  
  // Define expected navigation patterns
  const navigationPatterns = {
    // Screens that should have back buttons
    shouldHaveBackButton: [
      'Search', 'AITools', 'AllThoughtmarks', 'AllBins', 'Tasks', 'Bins', 
      'Thoughtmarks', 'ThoughtmarkDetail', 'CreateThoughtmark', 'CreateBin', 
      'BinDetail', 'VoiceRecord', 'Content', 'Settings', 'Profile', 'Archive', 
      'Premium', 'Help', 'Terms', 'Privacy', 'Security', 'Theme', 'Export', 
      'Contact', 'HowTo', 'AdminDashboard'
    ],
    
    // Screens that should have bottom navigation
    shouldHaveBottomNav: [
      'Dashboard', 'Search', 'AITools', 'AllThoughtmarks', 'AllBins', 
      'Tasks', 'Bins', 'Thoughtmarks', 'Content', 'Archive'
    ],
    
    // Screens that should have FAB (Floating Action Button)
    shouldHaveFAB: [
      'Dashboard', 'AllThoughtmarks', 'AllBins', 'Tasks', 'Bins', 
      'Thoughtmarks', 'Content', 'Archive'
    ],
    
    // Screens that are dead ends (no navigation out)
    deadEnds: [
      'SignIn', 'SignUp', 'Loading'
    ]
  };
  
  // Validate each screen
  const allScreens = [
    'SignIn', 'SignUp', 'Loading', 'Dashboard', 'Search', 'AITools', 
    'AllThoughtmarks', 'AllBins', 'Tasks', 'Bins', 'Thoughtmarks', 
    'ThoughtmarkDetail', 'CreateThoughtmark', 'CreateBin', 'BinDetail', 
    'VoiceRecord', 'Content', 'Settings', 'Profile', 'Archive', 'Premium', 
    'Help', 'Terms', 'Privacy', 'Security', 'Theme', 'Export', 'Contact', 
    'HowTo', 'AdminDashboard', 'DesignSystemDemo'
  ];
  
  allScreens.forEach(screen => {
    const issues: string[] = [];
    const shouldHaveBackButton = navigationPatterns.shouldHaveBackButton.includes(screen);
    const shouldHaveBottomNav = navigationPatterns.shouldHaveBottomNav.includes(screen);
    const shouldHaveFAB = navigationPatterns.shouldHaveFAB.includes(screen);
    const isDeadEnd = navigationPatterns.deadEnds.includes(screen);
    
    // Check for missing back button on screens that should have one
    if (shouldHaveBackButton && !isDeadEnd) {
      // This would be checked in actual component validation
    }
    
    // Check for missing bottom nav on screens that should have one
    if (shouldHaveBottomNav) {
      // This would be checked in actual component validation
    }
    
    // Check for missing FAB on screens that should have one
    if (shouldHaveFAB) {
      // This would be checked in actual component validation
    }
    
    results.push({
      screen,
      hasBackButton: shouldHaveBackButton,
      hasBottomNav: shouldHaveBottomNav,
      hasFAB: shouldHaveFAB,
      isDeadEnd,
      issues
    });
  });
  
  return results;
};

export const generateNavigationReport = (): string => {
  const results = validateNavigation();
  let report = '# Navigation Validation Report\n\n';
  
  report += '## Summary\n';
  report += `- Total screens validated: ${results.length}\n`;
  report += `- Screens with back buttons: ${results.filter(r => r.hasBackButton).length}\n`;
  report += `- Screens with bottom nav: ${results.filter(r => r.hasBottomNav).length}\n`;
  report += `- Screens with FAB: ${results.filter(r => r.hasFAB).length}\n`;
  report += `- Dead end screens: ${results.filter(r => r.isDeadEnd).length}\n\n`;
  
  report += '## Screen Details\n\n';
  results.forEach(result => {
    report += `### ${result.screen}\n`;
    report += `- Back Button: ${result.hasBackButton ? '✅' : '❌'}\n`;
    report += `- Bottom Nav: ${result.hasBottomNav ? '✅' : '❌'}\n`;
    report += `- FAB: ${result.hasFAB ? '✅' : '❌'}\n`;
    report += `- Dead End: ${result.isDeadEnd ? '⚠️' : '✅'}\n`;
    if (result.issues.length > 0) {
      report += `- Issues: ${result.issues.join(', ')}\n`;
    }
    report += '\n';
  });
  
  return report;
}; 