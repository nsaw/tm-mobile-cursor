import React from 'react';
import { View, ScrollView, Linking } from 'react-native';
import { Brain, Mic, FileText, Lightbulb, Search, Book, Users, Mail, HelpCircle, CheckCircle } from 'lucide-react-native';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';

import { useTheme } from '../../../theme/ThemeProvider';
import { Card } from '../../../components/ui/Card';
import { Text, Heading, Caption } from '../../../components/ui/Text';
import { AutoRoleView } from '../../../components/ui/AutoRoleView';

const helpCategories = [
{
  title: 'Getting Started',
  description: 'Learn the basics of Thoughtmarks',
  icon: Lightbulb,
  items: [
  'Creating your first thoughtmark',
  'Understanding bins and organization',
  'Setting up voice capture',
  'Navigating the interface']

},
{
  title: 'Voice Features',
  description: 'Master hands-free capture',
  icon: Mic,
  items: [
  'Siri shortcut installation',
  'Voice commands and phrases',
  'Background voice processing',
  'Troubleshooting voice issues']

},
{
  title: 'AI & Smart Features',
  description: 'Leverage intelligent tools',
  icon: Brain,
  items: [
  'Auto-categorization',
  'Semantic search',
  'Pattern recognition',
  'AI insights and tips']

},
{
  title: 'Organization & Workflow',
  description: 'Optimize your knowledge management',
  icon: FileText,
  items: [
  'Creating and managing bins',
  'Tagging strategies',
  'Archive and cleanup',
  'Collaboration features']

}];


const faqs = [
{
  question: 'How do I set up Siri voice capture?',
  answer: "Go to Settings > Voice & Shortcuts and tap 'Quick Siri Setup' to install the shortcut.",
  icon: Mic,
  category: 'Voice'
},
{
  question: 'How does AI categorization work?',
  answer: 'Our AI analyzes your thoughtmarks and automatically sorts them into relevant bins based on content and context.',
  icon: Brain,
  category: 'AI'
},
{
  question: 'Can I organize thoughtmarks into custom bins?',
  answer: 'Yes! Create custom bins from the All Bins page or when creating a new thoughtmark.',
  icon: FileText,
  category: 'Organization'
},
{
  question: 'How do I search for specific thoughtmarks?',
  answer: 'Use the search function to find thoughtmarks by keywords, content, or semantic meaning.',
  icon: Search,
  category: 'Search'
}];


const resources = [
{
  title: 'Documentation',
  description: 'Comprehensive guides and tutorials',
  icon: Book,
  onPress: () => Linking.openURL('https://thoughtmarks.app/docs')
},
{
  title: 'Community',
  description: 'Connect with other users',
  icon: Users,
  onPress: () => Linking.openURL('https://community.thoughtmarks.app')
},
{
  title: 'Direct Email',
  description: 'support@thoughtmarks.app',
  icon: Mail,
  onPress: () => Linking.openURL('mailto:support@thoughtmarks.app')
}];


const HowToScreen: React.FC = () => {
  const { tokens: designTokens } = useTheme();

  const categories = [
  {
    title: 'Getting Started',
    description: 'Learn the basics of using Thoughtmarks',
    icon: Ionicons,
    items: [
    'Create your first thoughtmark',
    'Organize with bins',
    'Use tags for better organization',
    'Search and find content quickly']

  },
  {
    title: 'Advanced Features',
    description: 'Master advanced functionality',
    icon: MaterialCommunityIcons,
    items: [
    'Voice recording',
    'AI-powered search',
    'Export and backup',
    'Customize your experience']

  }];


  const faqs = [
  {
    question: 'How do I create a thoughtmark?',
    answer: 'Tap the + button and start typing or use voice recording.',
    category: 'Basics',
    icon: Feather
  },
  {
    question: 'Can I organize my thoughtmarks?',
    answer: 'Yes! Use bins to group related thoughtmarks together.',
    category: 'Organization',
    icon: Feather
  }];


  const resources = [
  {
    title: 'Video Tutorials',
    description: 'Step-by-step guides',
    icon: Ionicons,
    onPress: () => {
      // TODO: Implement video tutorials navigation
      console.log('Video tutorials pressed');
    }
  },
  {
    title: 'User Guide',
    description: 'Comprehensive documentation',
    icon: MaterialCommunityIcons,
    onPress: () => {
      // TODO: Implement user guide navigation
      console.log('User guide pressed');
    }
  }];


  return (
    <ScrollView style={{ flex: 1, backgroundColor: designTokens.colors.background }} contentContainerStyle={{ padding: designTokens.spacing.lg }}>
      <Heading><Text>How to Use Thoughtmarks</Text></Heading>
      
      <Caption><Text>Get the most out of your thoughtmarking experience with these helpful guides and tips.</Text></Caption>

      {/* Categories */}
      <Heading><Text>Quick Start Guide</Text></Heading>
      
      <ScrollView style={{}} contentContainerStyle={{ gap: designTokens.spacing.md, marginBottom: designTokens.spacing.xl }}>
        {categories.map((cat) =>
        <Card key={cat.title} style={{ padding: designTokens.spacing.md }}>
            <ScrollView style={{}} contentContainerStyle={{ flexDirection: 'row', alignItems: 'center', marginBottom: designTokens.spacing.sm }}>
              <cat.icon size={28} color={designTokens.colors.accent} style={{ marginRight: designTokens.spacing.md }} />
              <ScrollView style={{ flex: 1 }}>
                <Text style={{ color: designTokens.colors.text, fontWeight: 'bold', fontSize: designTokens.typography.fontSize.sm }}>{cat.title}</Text>
                <Caption><Text>{cat.description}</Text></Caption>
              </ScrollView>
            </ScrollView>
            <ScrollView style={{}} contentContainerStyle={{ gap: designTokens.spacing.xs }}>
              {cat.items.map((item, index) =>
            <ScrollView key={index} style={{}} contentContainerStyle={{ flexDirection: 'row', alignItems: 'center' }}>
                  <CheckCircle size={14} color={designTokens.colors.success} style={{ marginRight: 6 }} />
                  <Text style={{ color: designTokens.colors.textSecondary, fontSize: designTokens.typography.fontSize.sm }}>{item}</Text>
                </ScrollView>
            )}
            </ScrollView>
          </Card>
        )}
      </ScrollView>

      {/* FAQs */}
      <Heading><Text>Frequently Asked Questions</Text></Heading>
      
      <ScrollView style={{}} contentContainerStyle={{ gap: designTokens.spacing.md, marginBottom: designTokens.spacing.xl }}>
        {faqs.map((faq) =>
        <Card key={faq.question} style={{ padding: designTokens.spacing.md }}>
            <ScrollView style={{}} contentContainerStyle={{ flexDirection: 'row', alignItems: 'center', marginBottom: designTokens.spacing.sm }}>
              <faq.icon size={22} color={designTokens.colors.accent} style={{ marginRight: designTokens.spacing.md }} />
              <ScrollView style={{ flex: 1 }}>
                <Text style={{ color: designTokens.colors.text, fontWeight: 'bold', fontSize: designTokens.typography.fontSize.sm }}>{faq.question}</Text>
                <Text style={{ color: designTokens.colors.textSecondary, marginBottom: designTokens.spacing.xs }}>{faq.answer}</Text>
                <Caption><Text>{faq.category}</Text></Caption>
              </ScrollView>
            </ScrollView>
          </Card>
        )}
      </ScrollView>

      {/* Resources */}
      <Heading><Text>Additional Resources</Text></Heading>
      
      <ScrollView style={{ flexWrap: 'wrap' }} contentContainerStyle={{ flexDirection: 'row', gap: designTokens.spacing.md, marginBottom: designTokens.spacing.xl }}>
        {resources.map((res) =>
        <Card key={res.title} style={{ flex: 1, minWidth: 140, alignItems: 'center', padding: designTokens.spacing.md }} onPress={res.onPress}>
            <res.icon size={32} color={designTokens.colors.accent} style={{ marginBottom: designTokens.spacing.sm }} />
            <Text style={{ color: designTokens.colors.text, fontWeight: 'bold', textAlign: 'center' }}>{res.title}</Text>
            <Caption><Text>{res.description}</Text></Caption>
          </Card>
        )}
      </ScrollView>

      {/* Support Info */}
      <Card style={{ backgroundColor: designTokens.colors.accentMuted, borderColor: designTokens.colors.accent, padding: designTokens.spacing.md }}>
        <ScrollView style={{}} contentContainerStyle={{ flexDirection: 'row', alignItems: 'center' }}>
          <HelpCircle size={20} color={designTokens.colors.accent} style={{ marginRight: designTokens.spacing.md }} />
          <ScrollView style={{ flex: 1 }}>
            <Text style={{ color: designTokens.colors.text, fontWeight: 'bold' }}>Support Response Times</Text>
            <Caption><Text>We typically respond to support requests within 24 hours during business days.</Text></Caption>
          </ScrollView>
        </ScrollView>
      </Card>
    </ScrollView>);

};

export default HowToScreen;