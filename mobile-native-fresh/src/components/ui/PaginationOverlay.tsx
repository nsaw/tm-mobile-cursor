import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeProvider';

interface PaginationOverlayProps {
  currentPage: number;
  totalPages: number;
  onNext: () => void;
  onPrev: () => void;
  style?: any;
}

export const PaginationOverlay: React.FC<PaginationOverlayProps> = ({
  currentPage,
  totalPages,
  onNext,
  onPrev,
  style,
}) => {
  const { tokens, spacing } = useTheme();

  return (
    <View style={[styles.container, style, { backgroundColor: tokens.colors.backgroundSecondary }]}
      accessible={true}
      accessibilityRole="adjustable"
      accessibilityLabel={`Page ${currentPage + 1} of ${totalPages}`}
    >
      <TouchableOpacity
        onPress={onPrev}
        disabled={currentPage === 0}
        style={styles.button}
        accessibilityRole="button"
        accessibilityLabel="Previous page"
        accessible={true}
      >
        <Ionicons name="chevron-back" size={24} color={currentPage === 0 ? tokens.colors.textSecondary : tokens.colors.accent} />
      </TouchableOpacity>
      <Text style={[styles.pageText, { color: tokens.colors.text }]}>{`${currentPage + 1} / ${totalPages}`}</Text>
      <TouchableOpacity
        onPress={onNext}
        disabled={currentPage === totalPages - 1}
        style={styles.button}
        accessibilityRole="button"
        accessibilityLabel="Next page"
        accessible={true}
      >
        <Ionicons name="chevron-forward" size={24} color={currentPage === totalPages - 1 ? tokens.colors.textSecondary : tokens.colors.accent} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  button: {
    padding: 8,
  },
  pageText: {
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 16,
  },
}); 