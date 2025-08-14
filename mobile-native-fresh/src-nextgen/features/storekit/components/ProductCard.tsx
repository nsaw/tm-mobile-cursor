import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StoreKitProduct } from '../types/storekit';

interface ProductCardProps {
  product: StoreKitProduct;
  isSelected: boolean;
  onSelect: (product: StoreKitProduct) => void;
  disabled?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isSelected,
  onSelect,
  disabled = false,
}) => {
  const getProductIcon = () => {
    switch (product.type) {
      case 'auto_renewable':
        return 'refresh';
      case 'non_consumable':
        return 'star';
      case 'consumable':
        return 'cart';
      default:
        return 'card';
    }
  };

  const getPeriodText = () => {
    if (product.subscriptionPeriod) {
      if (product.subscriptionPeriod === 'P1M') return '/month';
      if (product.subscriptionPeriod === 'P1Y') return '/year';
      if (product.subscriptionPeriod === 'P1W') return '/week';
    }
    return '';
  };

  return (
    <TouchableOpacity
      style={[
        styles.card,
        isSelected && styles.selectedCard,
        disabled && styles.disabledCard,
      ]}
      onPress={() = accessibilityRole="button" accessible={true} accessibilityLabel="Button"> !disabled && onSelect(product)}
      disabled={disabled}
    >
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons name={getProductIcon()} size={24} color='#007AFF' />
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{product.title}</Text>
          <Text style={styles.description} numberOfLines={2}>
            {product.description}
          </Text>
        </View>
      </View>

      <View style={styles.priceContainer}>
        <Text style={styles.price}>
          {product.localizedPrice}
          <Text style={styles.period}>{getPeriodText()}</Text>
        </Text>
        {product.introductoryPrice && (
          <View style={styles.introPriceContainer}>
            <Text style={styles.introPrice}>
              {product.introductoryPrice.localizedPrice}
              <Text style={styles.introPeriod}> for {product.introductoryPrice.numberOfPeriods} {product.introductoryPrice.period}</Text>
            </Text>
          </View>
        )}
      </View>

      {!product.isAvailable && (
        <View style={styles.unavailableContainer}>
          <Text style={styles.unavailableText}>Currently Unavailable</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    borderWidth: 2,
    borderColor: '#e1e5e9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedCard: {
    borderColor: '#007AFF',
    backgroundColor: '#f0f8ff',
  },
  disabledCard: {
    opacity: 0.6,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f0f8ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  period: {
    fontSize: 16,
    fontWeight: '400',
    color: '#666',
  },
  introPriceContainer: {
    marginTop: 4,
  },
  introPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#34C759',
  },
  introPeriod: {
    fontSize: 12,
    color: '#666',
  },
  unavailableContainer: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#f8f9fa',
    borderRadius: 6,
    alignItems: 'center',
  },
  unavailableText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
});
