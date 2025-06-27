import React from 'react';
import { View, ScrollView } from 'react-native';
import { HelpCircle, CheckCircle } from 'lucide-react-native';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';

import { useTheme } from '../../../theme/ThemeProvider';
import { Card } from '../../../components/ui/Card';
import { Text, Heading, Caption } from '../../../components/ui/Text';

const HowToScreen: React.FC = () => {
  

  const categories = [
    {
      title: 'Getting Started',
      description: 'Learn the basics of using Thoughtmarks',
      icon: Ionicons,
      items: [
        'Create your first thoughtmark',
        'Organize with bins',
        'Use tags for better organization',
        'Search and find content quickly',
      ],
    },
    {
      title: 'Advanced Features',
      description: 'Master advanced functionality',
      icon: MaterialCommunityIcons,
      items: [
        'Voice recording',
        'AI-powered search',
        'Export and backup',
        'Customize your experience',
      ],
    },
  ];

  const localFaqs = [
    {
      question: 'How do I create a thoughtmark?',
      answer: 'Tap the + button and start typing or use voice recording.',
      category: 'Basics',
      icon: Feather,
    },
    {
      question: 'Can I organize my thoughtmarks?',
      answer: 'Yes! Use bins to group related thoughtmarks together.',
      category: 'Organization',
      icon: Feather,
    },
  ];

  const localResources = [
    {
      title: 'Video Tutorials',
      description: 'Step-by-step guides',
      icon: Ionicons,
      onPress: () => {
        // TODO: Implement video tutorials
      },
    },
    {
      title: 'User Guide',
      description: 'Comprehensive documentation',
      icon: MaterialCommunityIcons,
      onPress: () => {
        // TODO: Implement user guide
      },
    },
  ];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: tokens.colors.background }} contentContainerStyle={{ padding: tokens.spacing.lg }}>
      <Heading><Text>How to Use Thoughtmarks</Text></Heading>
      
      <Caption><Text>Get the most out of your thoughtmarking experience with these helpful guides and tips.</Text></Caption>

      {/* Categories */}
      <Heading><Text>Quick Start Guide</Text></Heading>
      
      <View style={{ gap: tokens.spacing.md, marginBottom: tokens.spacing.xl }}>
        {categories.map((cat) => (
          <Card key={cat.title} style={{ padding: tokens.spacing.md }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: tokens.spacing.sm }}>
              <cat.icon size={28} color={tokens.colors.accent} style={{ marginRight: tokens.spacing.md }} />
              <View style={{ flex: 1 }}>
                <Text style={{ color: tokens.colors.text, fontWeight: 'bold', fontSize: tokens.typography.fontSize.sm }}>{cat.title}</Text>
                <Caption><Text>{cat.description}</Text></Caption>
              </View>
            </View>
            <View style={{ gap: tokens.spacing.xs }}>
              {cat.items.map((item, index) => (
                <View key={index} style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <CheckCircle size={14} color={tokens.colors.success} style={{ marginRight: 6 }} />
                  <Text style={{ color: tokens.colors.textSecondary, fontSize: tokens.typography.fontSize.sm }}>{item}</Text>
                </View>
              ))}
            </View>
          </Card>
        ))}
      </View>

      {/* FAQs */}
      <Heading><Text>Frequently Asked Questions</Text></Heading>
      
      <View style={{ gap: tokens.spacing.md, marginBottom: tokens.spacing.xl }}>
        {localFaqs.map((faq) => (
          <Card key={faq.question} style={{ padding: tokens.spacing.md }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: tokens.spacing.sm }}>
              <faq.icon size={22} color={tokens.colors.accent} style={{ marginRight: tokens.spacing.md }} />
              <View style={{ flex: 1 }}>
                <Text style={{ color: tokens.colors.text, fontWeight: 'bold', fontSize: tokens.typography.fontSize.sm }}>{faq.question}</Text>
                <Text style={{ color: tokens.colors.textSecondary, marginBottom: tokens.spacing.xs }}>{faq.answer}</Text>
                <Caption><Text>{faq.category}</Text></Caption>
              </View>
            </View>
          </Card>
        ))}
      </View>

      {/* Resources */}
      <Heading><Text>Additional Resources</Text></Heading>
      
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: tokens.spacing.md, marginBottom: tokens.spacing.xl }}>
        {localResources.map((res) => (
          <Card key={res.title} style={{ flex: 1, minWidth: 140, alignItems: 'center', padding: tokens.spacing.md }} onPress={res.onPress}>
            <res.icon size={32} color={tokens.colors.accent} style={{ marginBottom: tokens.spacing.sm }} />
            <Text style={{ color: tokens.colors.text, fontWeight: 'bold', textAlign: 'center' }}>{res.title}</Text>
            <Caption><Text>{res.description}</Text></Caption>
          </Card>
        ))}
      </View>

      {/* Support Info */}
      <Card style={{ backgroundColor: tokens.colors.accentMuted, borderColor: tokens.colors.accent, padding: tokens.spacing.md }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <HelpCircle size={20} color={tokens.colors.accent} style={{ marginRight: tokens.spacing.md }} />
          <View style={{ flex: 1 }}>
            <Text style={{ color: tokens.colors.text, fontWeight: 'bold' }}>Support Response Times</Text>
            <Caption><Text>We typically respond to support requests within 24 hours during business days.</Text></Caption>
          </View>
        </View>
      </Card>
    </ScrollView>
  );
};

export default HowToScreen; 