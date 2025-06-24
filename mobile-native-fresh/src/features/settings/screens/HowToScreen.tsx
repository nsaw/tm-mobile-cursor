import React from 'react';
import { View, ScrollView, StyleSheet, Linking } from 'react-native';
import { useTheme } from '../../../theme/ThemeProvider';
import { Card } from '../../../components/ui/Card';
import { Text, Heading, Caption } from '../../../components/ui/Text';
import { Button } from '../../../components/ui/Button';
import { Brain, Mic, FileText, Lightbulb, Search, Book, Users, Mail, HelpCircle, CheckCircle } from 'lucide-react-native';

const helpCategories = [
  {
    title: 'Getting Started',
    description: 'Learn the basics of Thoughtmarks',
    icon: Lightbulb,
    items: [
      'Creating your first thoughtmark',
      'Understanding bins and organization',
      'Setting up voice capture',
      'Navigating the interface',
    ],
  },
  {
    title: 'Voice Features',
    description: 'Master hands-free capture',
    icon: Mic,
    items: [
      'Siri shortcut installation',
      'Voice commands and phrases',
      'Background voice processing',
      'Troubleshooting voice issues',
    ],
  },
  {
    title: 'AI & Smart Features',
    description: 'Leverage intelligent tools',
    icon: Brain,
    items: [
      'Auto-categorization',
      'Semantic search',
      'Pattern recognition',
      'AI insights and tips',
    ],
  },
  {
    title: 'Organization & Workflow',
    description: 'Optimize your knowledge management',
    icon: FileText,
    items: [
      'Creating and managing bins',
      'Tagging strategies',
      'Archive and cleanup',
      'Collaboration features',
    ],
  },
];

const faqs = [
  {
    question: 'How do I set up Siri voice capture?',
    answer: "Go to Settings > Voice & Shortcuts and tap 'Quick Siri Setup' to install the shortcut.",
    icon: Mic,
    category: 'Voice',
  },
  {
    question: 'How does AI categorization work?',
    answer: 'Our AI analyzes your thoughtmarks and automatically sorts them into relevant bins based on content and context.',
    icon: Brain,
    category: 'AI',
  },
  {
    question: 'Can I organize thoughtmarks into custom bins?',
    answer: 'Yes! Create custom bins from the All Bins page or when creating a new thoughtmark.',
    icon: FileText,
    category: 'Organization',
  },
  {
    question: 'How do I search for specific thoughtmarks?',
    answer: 'Use the search function to find thoughtmarks by keywords, content, or semantic meaning.',
    icon: Search,
    category: 'Search',
  },
];

const resources = [
  {
    title: 'Documentation',
    description: 'Comprehensive guides and tutorials',
    icon: Book,
    onPress: () => Linking.openURL('https://thoughtmarks.app/docs'),
  },
  {
    title: 'Community',
    description: 'Connect with other users',
    icon: Users,
    onPress: () => Linking.openURL('https://community.thoughtmarks.app'),
  },
  {
    title: 'Direct Email',
    description: 'support@thoughtmarks.app',
    icon: Mail,
    onPress: () => Linking.openURL('mailto:support@thoughtmarks.app'),
  },
];

const HowToScreen: React.FC = () => {
  const { tokens } = useTheme();
  return (
    <ScrollView style={{ flex: 1, backgroundColor: tokens.colors.background }} contentContainerStyle={{ padding: tokens.spacing.lg }}>
      <Heading level={1} style={{ color: tokens.colors.text, textAlign: 'center', marginBottom: tokens.spacing.lg }}>
        Help & Support
      </Heading>
      <Caption style={{ color: tokens.colors.textMuted, textAlign: 'center', marginBottom: tokens.spacing.xl }}>
        Get assistance and find answers to make the most of Thoughtmarks
      </Caption>

      {/* Help Categories */}
      <Heading level={2} style={{ color: tokens.colors.text, marginBottom: tokens.spacing.md }}>
        Quick Help
      </Heading>
      <View style={{ gap: tokens.spacing.md, marginBottom: tokens.spacing.xl }}>
        {helpCategories.map((cat, idx) => (
          <Card key={cat.title} style={{ padding: tokens.spacing.md }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: tokens.spacing.sm }}>
              <cat.icon size={28} color={tokens.colors.accent} style={{ marginRight: tokens.spacing.md }} />
              <View>
                <Text style={{ color: tokens.colors.text, fontWeight: 'bold', fontSize: tokens.typography.fontSize.sm }}>{cat.title}</Text>
                <Caption style={{ color: tokens.colors.textMuted }}>{cat.description}</Caption>
              </View>
            </View>
            <View style={{ marginLeft: 36 }}>
              {cat.items.map((item, i) => (
                <View key={item} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
                  <CheckCircle size={14} color={tokens.colors.success} style={{ marginRight: 6 }} />
                  <Text style={{ color: tokens.colors.textSecondary, fontSize: tokens.typography.fontSize.sm }}>{item}</Text>
                </View>
              ))}
            </View>
          </Card>
        ))}
      </View>

      {/* FAQ */}
      <Heading level={2} style={{ color: tokens.colors.text, marginBottom: tokens.spacing.md }}>
        Frequently Asked Questions
      </Heading>
      <View style={{ gap: tokens.spacing.md, marginBottom: tokens.spacing.xl }}>
        {faqs.map((faq, idx) => (
          <Card key={faq.question} style={{ padding: tokens.spacing.md }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: tokens.spacing.sm }}>
              <faq.icon size={22} color={tokens.colors.accent} style={{ marginRight: tokens.spacing.md }} />
              <Text style={{ color: tokens.colors.text, fontWeight: 'bold', fontSize: tokens.typography.fontSize.sm }}>{faq.question}</Text>
            </View>
            <Text style={{ color: tokens.colors.textSecondary, marginBottom: tokens.spacing.xs }}>{faq.answer}</Text>
            <Caption style={{ color: tokens.colors.textMuted }}>{faq.category}</Caption>
          </Card>
        ))}
      </View>

      {/* Resources */}
      <Heading level={2} style={{ color: tokens.colors.text, marginBottom: tokens.spacing.md }}>
        Additional Resources
      </Heading>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: tokens.spacing.md, marginBottom: tokens.spacing.xl }}>
        {resources.map((res) => (
          <Card key={res.title} style={{ flex: 1, minWidth: 140, alignItems: 'center', padding: tokens.spacing.md }} onPress={res.onPress}>
            <res.icon size={32} color={tokens.colors.accent} style={{ marginBottom: tokens.spacing.sm }} />
            <Text style={{ color: tokens.colors.text, fontWeight: 'bold', textAlign: 'center' }}>{res.title}</Text>
            <Caption style={{ color: tokens.colors.textMuted, textAlign: 'center' }}>{res.description}</Caption>
          </Card>
        ))}
      </View>

      {/* Support Response Notice */}
      <Card style={{ backgroundColor: tokens.colors.accentMuted, borderColor: tokens.colors.accent, padding: tokens.spacing.md }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <HelpCircle size={20} color={tokens.colors.accent} style={{ marginRight: tokens.spacing.md }} />
          <View>
            <Text style={{ color: tokens.colors.text, fontWeight: 'bold' }}>Support Response Times</Text>
            <Caption style={{ color: tokens.colors.textMuted }}>
              We typically respond to support requests within 24 hours. For urgent issues, please email us directly.
            </Caption>
          </View>
        </View>
      </Card>
    </ScrollView>
  );
};

export default HowToScreen; 