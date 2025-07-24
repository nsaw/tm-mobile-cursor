import { auditViews } from './roleScanner';

/**
 * Enforce Wrapper roles on all layout-only Views
 * This prevents layout-only Views from being interpreted as visual UI roles
 */
export function enforceWrapperTags(): void {
  console.log('🔍 Auditing Views for Wrapper role enforcement...');
  
  const results = auditViews({ 
    enforceRole: 'Wrapper',
    dryRun: false,
    fixAutomatically: true 
  });
  
  let totalViewsFound = 0;
  let totalViewsWithRoles = 0;
  let totalViewsWithoutRoles = 0;
  let totalWrapperRolesAdded = 0;
  let totalIssues = 0;
  
  console.log('\n📊 Audit Results:');
  console.log('================');
  
  results.forEach(result => {
    if (result.viewsFound > 0) {
      console.log(`\n📁 ${result.componentName}:`);
      console.log(`   Views found: ${result.viewsFound}`);
      console.log(`   Views with roles: ${result.viewsWithRoles}`);
      console.log(`   Views without roles: ${result.viewsWithoutRoles}`);
      console.log(`   Layout-only Views: ${result.layoutOnlyViews}`);
      console.log(`   Wrapper roles added: ${result.wrapperRolesAdded}`);
      
      if (result.issues.length > 0) {
        console.log(`   Issues: ${result.issues.join(', ')}`);
        totalIssues += result.issues.length;
      }
      
      totalViewsFound += result.viewsFound;
      totalViewsWithRoles += result.viewsWithRoles;
      totalViewsWithoutRoles += result.viewsWithoutRoles;
      totalWrapperRolesAdded += result.wrapperRolesAdded;
    }
  });
  
  console.log('\n📈 Summary:');
  console.log('===========');
  console.log(`Total Views found: ${totalViewsFound}`);
  console.log(`Total Views with roles: ${totalViewsWithRoles}`);
  console.log(`Total Views without roles: ${totalViewsWithoutRoles}`);
  console.log(`Total Wrapper roles added: ${totalWrapperRolesAdded}`);
  console.log(`Total issues: ${totalIssues}`);
  
  if (totalWrapperRolesAdded > 0) {
    console.log(`\n✅ Successfully added ${totalWrapperRolesAdded} Wrapper roles to layout-only Views`);
  } else {
    console.log('\n✅ All Views already have appropriate roles');
  }
  
  if (totalIssues > 0) {
    console.log(`\n⚠️  ${totalIssues} issues found - review component structure`);
  }
}

// Execute if run directly
if (require.main === module) {
  enforceWrapperTags();
} 