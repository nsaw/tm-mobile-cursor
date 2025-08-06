import React, { memo } from 'react';
import { View, Text } from 'react-native';

interface Thoughtmark {
  id: string;
  title: string;
  content: string;
  author: string;
  tags: string[];
  binId: string;
  createdAt: string;
  updatedAt: string;
  isArchived: boolean;
  isPinned: boolean;
  isPublic: boolean;
  likes: number;
  comments: number;
  shares: number;
}

interface ThoughtmarkCardProps {
  thoughtmark: Thoughtmark;
  _slotType: string;
}

const ThoughtmarkCard = memo(({ thoughtmark, _slotType }: ThoughtmarkCardProps) => {
  return (
    <View style={{ padding: 16, backgroundColor: '#1a1a1a', borderRadius: 8, marginBottom: 8 }}>
      <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>
        {thoughtmark.title}
      </Text>
      <Text style={{ color: '#ccc', fontSize: 14, lineHeight: 20 }}>
        {thoughtmark.content}
      </Text>
      <Text style={{ color: '#666', fontSize: 12, marginTop: 8 }}>
        Slot: {_slotType}
      </Text>
    </View>
  );
});

ThoughtmarkCard.displayName = 'ThoughtmarkCard';

export default ThoughtmarkCard;