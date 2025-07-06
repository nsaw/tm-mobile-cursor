import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Crown, RefreshCw } from 'lucide-react-native';

import { useTheme } from '../../../theme/ThemeProvider';
import { Heading, Caption } from '../../../components/ui/Text';
import { Button } from '../../../components/ui/Button';
import { useStoreKit } from '../hooks/useStoreKit';
import { AutoRoleView } from '../../../components/AutoRoleView';

export const PremiumScreen: React.FC = () => {
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

  useEffect(() => {
    if (isAvailable && !isPremium) {
      loadProducts();
    }
  }, [isAvailable, isPremium, loadProducts]);

  const handlePurchase = async (productId: string) => {
    try {
      await purchaseProduct(productId);
    } catch (error) {
      console.error('Purchase failed:', error);
    }
  };

  const handleRestore = async () => {
    try {
      await restorePurchases();
    } catch (error) {
      console.error('Restore failed:', error);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: designTokens.colors.background,
      padding: designTokens.spacing.xl,
    },
    iconContainer: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: designTokens.colors.accentMuted,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: designTokens.spacing.lg,
    },
    title: {
      color: designTokens.colors.text,
      marginBottom: designTokens.spacing.sm,
    },
    subtitle: {
      color: designTokens.colors.textMuted,
      textAlign: 'center',
      marginBottom: designTokens.spacing.lg,
    },
    button: {
      width: 180,
      backgroundColor: designTokens.colors.accent,
      marginBottom: designTokens.spacing.md,
    },
    restoreButton: {
      width: 180,
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: designTokens.colors.border,
    },
    productContainer: {
      width: '100%',
      marginBottom: designTokens.spacing.lg,
    },
    productCard: {
      backgroundColor: designTokens.colors.surface,
      borderRadius: 12,
      padding: designTokens.spacing.lg,
      marginBottom: designTokens.spacing.md,
      borderWidth: 1,
      borderColor: designTokens.colors.border,
    },
    productTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: designTokens.colors.text,
      marginBottom: designTokens.spacing.xs,
    },
    productDescription: {
      fontSize: 14,
      color: designTokens.colors.textSecondary,
      marginBottom: designTokens.spacing.sm,
    },
    productPrice: {
      fontSize: 24,
      fontWeight: '700',
      color: designTokens.colors.accent,
      marginBottom: designTokens.spacing.md,
    },
  });

  // If user is already premium, show success message
  if (isPremium) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: designTokens.colors.background }}>
        <AutoRoleView layoutRole="section" style={styles.container}>
          <View style={styles.iconContainer}>
            <Crown size={32} color={designTokens.colors.background} />
          </View>
          
          <Heading><Text>Premium Active!</Text></Heading>
          <Caption><Text>You have access to all premium features. Enjoy your enhanced experience!</Text></Caption>
        </AutoRoleView>
      </SafeAreaView>
    );
  }

  // If StoreKit is not available, show fallback
  if (!isAvailable) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: designTokens.colors.background }}>
        <AutoRoleView layoutRole="section" style={styles.container}>
          <View style={styles.iconContainer}>
            <Crown size={32} color={designTokens.colors.background} />
          </View>
          
          <Heading><Text>Premium Features</Text></Heading>
          <Caption><Text>Premium features are not available on this device. Please try on iOS or Android.</Text></Caption>
        </AutoRoleView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: designTokens.colors.background }}>
      <AutoRoleView layoutRole="section" style={styles.container}>
        <View style={styles.iconContainer}>
          <Crown size={32} color={designTokens.colors.background} />
        </View>
        
        <Heading><Text>Upgrade to Premium</Text></Heading>
        <Caption><Text>Unlock all premium features including AI insights, smart reminders, and advanced search.</Text></Caption>
        
        <View style={styles.productContainer}>
          {products.map((product) => (
            <View key={product.id} style={styles.productCard}>
              <Text style={styles.productTitle}>{product.title}</Text>
              <Text style={styles.productDescription}>{product.description}</Text>
              <Text style={styles.productPrice}>{product.localizedPrice}</Text>
              <Button 
                style={styles.button}
                onPress={() => handlePurchase(product.id)}
                disabled={loading}
              >
                <Text style={{ color: designTokens.colors.background, fontWeight: '700', textAlign: 'center' }}>
                  {loading ? 'Processing...' : 'Upgrade Now'}
                </Text>
              </Button>
            </View>
          ))}
        </View>

        <Button 
          style={styles.restoreButton}
          onPress={handleRestore}
          disabled={loading}
        >
          <RefreshCw size={16} color={designTokens.colors.text} style={{ marginRight: 8 }} />
          <Text style={{ color: designTokens.colors.text, fontWeight: '600', textAlign: 'center' }}>
            Restore Purchases
          </Text>
        </Button>
      </AutoRoleView>
    </SafeAreaView>
  );
}; 