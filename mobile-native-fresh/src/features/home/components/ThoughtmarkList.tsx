import React from 'react';
import {
  FlatList,
  StyleSheet,
} from 'react-native';

import type { Thoughtmark } from '../../../types';

import { ThoughtmarkCard } from './ThoughtmarkCard';
import { AutoRoleView } from '../../../components/ui/AutoRoleView';

interface ThoughtmarkListProps {
  thoughtmarks: Thoughtmark[];
  onThoughtmarkPress: (thoughtmark: Thoughtmark) => void;
  onPinToggle?: (thoughtmarkId: string, pinned: boolean) => void;
  horizontal?: boolean;
  showsScrollIndicator?: boolean;
}

export const ThoughtmarkList: React.FC<ThoughtmarkListProps> = ({
  thoughtmarks,
  onThoughtmarkPress,
  onPinToggle,
  horizontal = false,
  showsScrollIndicator = true,
}) => {
  const renderThoughtmark = ({ item }: { item: Thoughtmark }) => (
    <ThoughtmarkCard
      thoughtmark={item}
      onClick={() => onThoughtmarkPress(item)}
      onPinToggle={onPinToggle}
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