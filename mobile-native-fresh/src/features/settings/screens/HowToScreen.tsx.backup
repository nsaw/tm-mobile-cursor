import React from 'react';
import { View, ScrollView, Linking } from 'react-native';
import { Brain, Mic, FileText, Lightbulb, Search, Book, Users, Mail, HelpCircle, CheckCircle } from 'lucide-react-native';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';

import { useTheme } from '../../../theme/ThemeProvider';
import { Card } from '../../../components/ui/Card';
import { Text, Heading, Caption } from '../../../components/ui/Text';

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

const { tokens } = useTheme();

const { tokens } = useTheme();

const { tokens } = useTheme();

const { tokens } = useTheme();

const { tokens } = useTheme();

const { tokens } = useTheme();

const { tokens } = useTheme();

const { tokens } = useTheme();

const { tokens } = useTheme();

const { tokens } = useTheme();

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

  const faqs = [
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

  const resources = [
    {
      title: 'Video Tutorials',
      description: 'Step-by-step guides',
      icon: Ionicons,
      onPress: () => {},
    },
    {
      title: 'User Guide',
      description: 'Comprehensive documentation',
      icon: MaterialCommunityIcons,
      onPress: () => {},
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
        {faqs.map((faq) => (
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
        {resources.map((res) => (
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