import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { useTheme } from '../../../theme/ThemeProvider';
import { useStoreKit } from '../../settings/hooks/useStoreKit';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { AutoRoleView } from '../../../components/ui/AutoRoleView';

export const StoreKitTestCard: React.FC = () => {
  const { tokens: designTokens } = useTheme();
  const { 
    loading, 
    products, 
    isPremium, 
    isAvailable, 
    loadProducts, 
    purchaseProduct, 
    restorePurchases 
  } = useStoreKit();

  const handleTestPurchase = async () => {
    if (products.length > 0) {
      try {
        await purchaseProduct(products[0].id);
      } catch (error) {
        console.error('Test purchase failed:', error);
      }
    }
  };

  const styles = StyleSheet.create({
    container: {
      marginBottom: designTokens.spacing.lg,
    },
    title: {
      fontSize: 16,
      fontWeight: '600',
      color: designTokens.colors.text,
      marginBottom: designTokens.spacing.sm,
    },
    status: {
      fontSize: 14,
      color: designTokens.colors.textSecondary,
      marginBottom: designTokens.spacing.md,
    },
    buttonContainer: {
      flexDirection: 'row',
      gap: designTokens.spacing.sm,
    },
    button: {
      flex: 1,
    },
  });

  return (
    <Card style={styles.container}>
      <Text style={styles.title}>StoreKit Test</Text>
      <Text style={styles.status}>
        Status: {isPremium ? 'Premium' : 'Free'} | Available: {isAvailable ? 'Yes' : 'No'}
      </Text>
      <Text style={styles.status}>
        Products: {products.length} | Loading: {loading ? 'Yes' : 'No'}
      </Text>
      
      <AutoRoleView role="group" accessibilityRole="none" style={styles.buttonContainer}>
        <Button 
          style={styles.button}
          onPress={loadProducts}
          disabled={loading}
        >
          <Text style={{ color: designTokens.colors.background, textAlign: 'center' }}>
            Load Products
          </Text>
        </Button>
        
        <Button 
          style={styles.button}
          onPress={handleTestPurchase}
          disabled={loading || products.length === 0}
        >
          <Text style={{ color: designTokens.colors.background, textAlign: 'center' }}>
            Test Purchase
          </Text>
        </Button>
        
        <Button 
          style={styles.button}
          onPress={restorePurchases}
          disabled={loading}
        >
          <Text style={{ color: designTokens.colors.background, textAlign: 'center' }}>
            Restore
          </Text>
        </Button>
      </AutoRoleView>
    </Card>
  );
}; 