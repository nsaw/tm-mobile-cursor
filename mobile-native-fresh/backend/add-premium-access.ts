import { eq, or, like } from 'drizzle-orm';

import { db } from './src/db/index';
import { users } from './src/db/schema';

async function addPremiumAccess() {
  try {
    console.log('Adding premium access for special users...');

    // Define the special user patterns that should have premium access
    const specialUserPatterns = [
      // Demo users
      { pattern: 'demo', description: 'Demo users' },
      // Test users  
      { pattern: 'test', description: 'Test users' },
      // Admin users
      { pattern: 'admin', description: 'Admin users' },
      // Friends and family
      { pattern: 'family', description: 'Friends and family' },
      { pattern: 'friend', description: 'Friends and family' },
      // Superuser
      { pattern: 'superuser', description: 'Superuser' },
      { pattern: 'super', description: 'Superuser' },
    ];

    // Find users matching these patterns
    const conditions = specialUserPatterns.map(pattern => 
      or(
        like(users.email, `%${pattern.pattern}%`),
        like(users.displayName, `%${pattern.pattern}%`),
        like(users.firstName, `%${pattern.pattern}%`),
        like(users.lastName, `%${pattern.pattern}%`)
      )
    );

    const specialUsers = await db
      .select()
      .from(users)
      .where(or(...conditions));

    console.log(`Found ${specialUsers.length} special users to update:`);
    specialUsers.forEach(user => {
      console.log(`- ${user.email} (${user.displayName || 'No display name'})`);
    });

    // Update these users with premium access
    const updatePromises = specialUsers.map(user => 
      db
        .update(users)
        .set({
          isPremium: true,
          subscriptionTier: 'lifetime',
          subscriptionStatus: 'active',
          billingCycle: 'lifetime',
          subscriptionExpiresAt: null, // Never expires
          nextBillingDate: null, // No billing for lifetime
          isFriendsFamily: true, // Mark as friends & family for tracking
          updatedAt: new Date()
        })
        .where(eq(users.id, user.id))
    );

    await Promise.all(updatePromises);

    console.log('✅ Successfully updated all special users with premium access');
    
    // Verify the updates
    const updatedUsers = await db
      .select()
      .from(users)
      .where(or(...conditions));

    console.log('\nVerification - Updated users with premium access:');
    updatedUsers.forEach(user => {
      console.log(`✅ ${user.email}: Premium=${user.isPremium}, Tier=${user.subscriptionTier}, Status=${user.subscriptionStatus}`);
    });

  } catch (error) {
    console.error('❌ Error adding premium access:', error);
    throw error;
  }
}

// Run the script
addPremiumAccess()
  .then(() => {
    console.log('🎉 Premium access setup complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Script failed:', error);
    process.exit(1);
  }); 