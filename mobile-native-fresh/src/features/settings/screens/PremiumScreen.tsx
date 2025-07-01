import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Crown, Check, RefreshCw } from 'lucide-react-native';

import { useTheme } from '../../../theme/ThemeProvider';
import { Heading, Caption } from '../../../components/ui/Text';
import { Button } from '../../../components/ui/Button';
import { useStoreKit } from '../hooks/useStoreKit';
import { useAuth } from '../../auth/hooks/useAuth';

export const PremiumScreen: React.FC = () => {
  const { designTokens } = useTheme();
  const { products, loading, error, purchaseProduct, restorePurchases } = useStoreKit();
  const { user } = useAuth();
  const [purchasing, setPurchasing] = useState<string | null>(null);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: designTokens.colors.background,
    },
    content: {
      flex: 1,
      padding: designTokens.spacing.xl,
    },
    header: {
      alignItems: 'center',
      marginBottom: designTokens.spacing.xl,
    },
    iconContainer: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: designTokens.colors.accentMuted,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: designTokens.spacing.lg,
    },
    title: {
      color: designTokens.colors.text,
      marginBottom: designTokens.spacing.sm,
      textAlign: 'center',
    },
    subtitle: {
      color: designTokens.colors.textMuted,
      textAlign: 'center',
      marginBottom: designTokens.spacing.lg,
    },
    featuresList: {
      marginBottom: designTokens.spacing.xl,
    },
    featureItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: designTokens.spacing.md,
    },
    featureIcon: {
      marginRight: designTokens.spacing.sm,
    },
    productsContainer: {
      marginBottom: designTokens.spacing.xl,
    },
    productCard: {
      backgroundColor: designTokens.colors.surface,
      borderRadius: designTokens.radius.lg,
      padding: designTokens.spacing.lg,
      marginBottom: designTokens.spacing.md,
      borderWidth: 1,
      borderColor: designTokens.colors.border,
    },
    productHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: designTokens.spacing.sm,
    },
    productTitle: {
      color: designTokens.colors.text,
      fontWeight: '600',
    },
    productPrice: {
      color: designTokens.colors.accent,
      fontWeight: '700',
      fontSize: 18,
    },
    productDescription: {
      color: designTokens.colors.textMuted,
      marginBottom: designTokens.spacing.md,
    },
    button: {
      backgroundColor: designTokens.colors.accent,
    },
    restoreButton: {
      backgroundColor: designTokens.colors.surface,
      borderWidth: 1,
      borderColor: designTokens.colors.border,
    },
    errorText: {
      color: designTokens.colors.danger,
      textAlign: 'center',
      marginBottom: designTokens.spacing.md,
    },
    premiumStatus: {
      backgroundColor: designTokens.colors.surface,
      padding: designTokens.spacing.md,
      borderRadius: designTokens.radius.md,
      marginBottom: designTokens.spacing.lg,
      alignItems: 'center',
    },
  });

  const handlePurchase = async (productId: string) => {
    setPurchasing(productId);
    
    try {
      const result = await purchaseProduct(productId);
      
      if (result.success) {
        Alert.alert(
          'Purchase Successful!',
          'Thank you for upgrading to Premium! Your features are now unlocked.',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert(
          'Purchase Failed',
          result.error || 'Something went wrong with your purchase. Please try again.',
          [{ text: 'OK' }]
        );
      }
    } catch (err) {
      Alert.alert(
        'Purchase Error',
        'An unexpected error occurred. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setPurchasing(null);
    }
  };

  const handleRestore = async () => {
    try {
      const results = await restorePurchases();
      
      if (results.length > 0 && results.some(r => r.success)) {
        Alert.alert(
          'Purchases Restored!',
          'Your previous purchases have been restored successfully.',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert(
          'No Purchases Found',
          'No previous purchases were found to restore.',
          [{ text: 'OK' }]
        );
      }
    } catch (err) {
      Alert.alert(
        'Restore Failed',
        'Failed to restore purchases. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const premiumFeatures = [
    'AI-powered insights and recommendations',
    'Smart sorting and categorization',
    'Advanced search with AI suggestions',
    'Unlimited voice recordings',
    'Priority support',
    'Early access to new features',
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Crown size={40} color={designTokens.colors.background} />
          </View>
          
          <Heading><Text>Premium Features</Text></Heading>
          <Caption><Text>Unlock the full potential of Thoughtmarks with premium features</Text></Caption>
        </View>

        {user?.isPremium && (
          <View style={styles.premiumStatus}>
            <Check size={24} color={designTokens.colors.success} />
            <Text style={{ color: designTokens.colors.success, marginTop: designTokens.spacing.xs }}>
              You are currently a Premium user!
            </Text>
          </View>
        )}

        <View style={styles.featuresList}>
          <Heading><Text>What's Included:</Text></Heading>
          {premiumFeatures.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <Check size={20} color={designTokens.colors.accent} style={styles.featureIcon} />
              <Text>{feature}</Text>
            </View>
          ))}
        </View>

        {error && (
          <Text style={styles.errorText}>{error}</Text>
        )}

        <View style={styles.productsContainer}>
          <Heading><Text>Choose Your Plan:</Text></Heading>
          {products.map((product) => (
            <View key={product.productId} style={styles.productCard}>
              <View style={styles.productHeader}>
                <Text style={styles.productTitle}>{product.title}</Text>
                <Text style={styles.productPrice}>{product.price}</Text>
              </View>
              <Text style={styles.productDescription}>{product.description}</Text>
              <Button
                style={styles.button}
                onPress={() => handlePurchase(product.productId)}
                disabled={loading || purchasing === product.productId}
              >
                <Text style={{ color: designTokens.colors.background, fontWeight: '600' }}>
                  {purchasing === product.productId ? 'Processing...' : 'Upgrade Now'}
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
                        <RefreshCw size={16} color={designTokens.colors.text} style={{ marginRight: designTokens.spacing.sm }} />
              <Text style={{ color: designTokens.colors.text, fontWeight: '600' }}>
            Restore Purchases
          </Text>
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}; 