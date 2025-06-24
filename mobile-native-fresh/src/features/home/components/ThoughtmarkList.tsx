import React from 'react';
import {
  View,
  FlatList,
  StyleSheet,
} from 'react-native';
import { ThoughtmarkCard } from './ThoughtmarkCard';
import type { Thoughtmark } from '../../../types';

interface ThoughtmarkListProps {
  thoughtmarks: Thoughtmark[];
  onThoughtmarkPress: (thoughtmark: Thoughtmark) => void;
  horizontal?: boolean;
  showsScrollIndicator?: boolean;
}

export const ThoughtmarkList: React.FC<ThoughtmarkListProps> = ({
  thoughtmarks,
  onThoughtmarkPress,
  horizontal = false,
  showsScrollIndicator = true,
}) => {
  const renderThoughtmark = ({ item }: { item: Thoughtmark }) => (
    <ThoughtmarkCard
      thoughtmark={item}
      onClick={() => onThoughtmarkPress(item)}
    />
  );

  return (
    <FlatList
      data={thoughtmarks}
      renderItem={renderThoughtmark}
      keyExtractor={(item) => item.id.toString()}
      horizontal={horizontal}
      showsHorizontalScrollIndicator={showsScrollIndicator && horizontal}
      showsVerticalScrollIndicator={showsScrollIndicator && !horizontal}
      contentContainerStyle={horizontal ? styles.horizontalContainer : styles.verticalContainer}
    />
  );
};

const styles = StyleSheet.create({
  horizontalContainer: {
    paddingHorizontal: 16,
  },
  verticalContainer: {
    padding: 16,
  },
  horizontalCard: {
    width: 250,
    marginRight: 12,
  },
  separator: {
    height: 12,
    width: 12,
  },
});