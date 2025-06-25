import React from 'react';
import { View, ScrollView } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { Button } from './Button';
import { Card, CardHeader, CardContent, CardFooter } from './Card';
import { Text, Heading, Subheading, BodyText, Caption } from './Text';
import { Ionicons } from '@expo/vector-icons';

export const DesignSystemDemo: React.FC = () => {
  const { tokens } = useTheme();

  return (
    <ScrollView style={{ flex: 1, backgroundColor: designTokens.colors.background }}>
      <View style={{ padding: designTokens.spacing.lg }}>
        {/* Typography Section */}
        <Card variant="elevated" style={{ marginBottom: designTokens.spacing.xl }}>
          <CardHeader>
            <Heading level={1} style={{ color: designTokens.colors.text, includeFontPadding: false, fontSize: 16, textTransform: 'uppercase' }}>Design System Demo</Heading>
            <Caption style={{ color: designTokens.colors.textMuted, includeFontPadding: false }}>Showcasing our new component variants</Caption>
          </CardHeader>
          
          <CardContent>
            <View style={{ gap: designTokens.spacing.md }}>
              <Heading level={1} style={{ color: designTokens.colors.text, includeFontPadding: false, fontSize: 16, textTransform: 'uppercase' }}>Heading Level 1</Heading>
              <Heading level={2} style={{ color: designTokens.colors.text, includeFontPadding: false, fontSize: 14 }}>Heading Level 2</Heading>
              <Heading level={3} style={{ color: designTokens.colors.text, includeFontPadding: false, fontSize: 12, textTransform: 'uppercase' }}>Heading Level 3</Heading>
              <Subheading style={{ color: designTokens.colors.text, includeFontPadding: false, textTransform: 'lowercase' }}>Subheading Text</Subheading>
              <BodyText style={{ color: designTokens.colors.text, includeFontPadding: false }}>Body text with normal weight and size</BodyText>
              <Caption style={{ color: designTokens.colors.textMuted, includeFontPadding: false }}>Caption text for secondary information</Caption>
              <Text variant="label" style={{ color: designTokens.colors.textSecondary, includeFontPadding: false }}>Label text for form elements</Text>
            </View>
          </CardContent>
        </Card>

        {/* Button Variants */}
        <Card variant="elevated" style={{ marginBottom: designTokens.spacing.xl }}>
          <CardHeader>
            <Heading level={2} style={{ color: designTokens.colors.text, includeFontPadding: false, fontSize: 14 }}>Button Variants</Heading>
            <Caption style={{ color: designTokens.colors.textMuted, includeFontPadding: false }}>Different button styles and states</Caption>
          </CardHeader>
          
          <CardContent>
            <View style={{ gap: designTokens.spacing.md }}>
              <Button variant="primary" onPress={() => console.log('Primary pressed')}>
                Primary Button
              </Button>
              
              <Button variant="secondary" onPress={() => console.log('Secondary pressed')}>
                Secondary Button
              </Button>
              
              <Button variant="outline" onPress={() => console.log('Outline pressed')}>
                Outline Button
              </Button>
              
              <Button variant="ghost" onPress={() => console.log('Ghost pressed')}>
                Ghost Button
              </Button>
              
              <Button variant="destructive" onPress={() => console.log('Destructive pressed')}>
                Destructive Button
              </Button>
              
              <Button variant="brand" onPress={() => console.log('Brand pressed')}>
                Brand Button
              </Button>
            </View>
          </CardContent>
        </Card>

        {/* Button Sizes */}
        <Card variant="elevated" style={{ marginBottom: designTokens.spacing.xl }}>
          <CardHeader>
            <Heading level={2} style={{ color: designTokens.colors.text, includeFontPadding: false, fontSize: 14 }}>Button Sizes</Heading>
            <Caption style={{ color: designTokens.colors.textMuted, includeFontPadding: false }}>Available button size options</Caption>
          </CardHeader>
          
          <CardContent>
            <View style={{ gap: designTokens.spacing.md }}>
              <Button variant="primary" size="sm" onPress={() => console.log('Small pressed')}>
                Small Button
              </Button>
              
              <Button variant="primary" size="md" onPress={() => console.log('Medium pressed')}>
                Medium Button
              </Button>
              
              <Button variant="primary" size="lg" onPress={() => console.log('Large pressed')}>
                Large Button
              </Button>
              
              <Button variant="primary" size="icon" onPress={() => console.log('Icon pressed')}>
                <Ionicons name="flame" size={20} color="#FFFFFF" />
              </Button>
            </View>
          </CardContent>
        </Card>

        {/* Card Variants */}
        <Card variant="elevated" style={{ marginBottom: designTokens.spacing.xl }}>
          <CardHeader>
            <Heading level={2} style={{ color: designTokens.colors.text, includeFontPadding: false, fontSize: 14 }}>Card Variants</Heading>
            <Caption style={{ color: designTokens.colors.textMuted, includeFontPadding: false }}>Different card styles and layouts</Caption>
          </CardHeader>
          
          <CardContent>
            <View style={{ gap: designTokens.spacing.md }}>
              <Card variant="default" onPress={() => console.log('Default card pressed')}>
                <CardContent>
                  <BodyText style={{ color: designTokens.colors.text, includeFontPadding: false }}>Default Card - Tap me!</BodyText>
                </CardContent>
              </Card>
              
              <Card variant="glass" onPress={() => console.log('Glass card pressed')}>
                <CardContent>
                  <BodyText style={{ color: designTokens.colors.text, includeFontPadding: false }}>Glass Card - Tap me!</BodyText>
                </CardContent>
              </Card>
              
              <Card variant="elevated" onPress={() => console.log('Elevated card pressed')}>
                <CardContent>
                  <BodyText style={{ color: designTokens.colors.text, includeFontPadding: false }}>Elevated Card - Tap me!</BodyText>
                </CardContent>
              </Card>
              
              <Card variant="interactive" onPress={() => console.log('Interactive card pressed')}>
                <CardContent>
                  <BodyText style={{ color: designTokens.colors.text, includeFontPadding: false }}>Interactive Card - Tap me!</BodyText>
                </CardContent>
              </Card>
            </View>
          </CardContent>
        </Card>

        {/* Color Palette Section */}
        <Card variant="elevated" style={{ marginBottom: designTokens.spacing.xl }}>
          <CardHeader>
            <Heading level={2} style={{ color: designTokens.colors.text, includeFontPadding: false, fontSize: 14 }}>Color Palette</Heading>
            <Caption style={{ color: designTokens.colors.textMuted, includeFontPadding: false }}>Our refined muted color system</Caption>
          </CardHeader>
          
          <CardContent>
            <View style={{ gap: designTokens.spacing.md }}>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: designTokens.spacing.sm }}>
                <View style={{ alignItems: 'center', gap: designTokens.spacing.xs }}>
                  <View style={{ width: 40, height: 40, borderRadius: 8, backgroundColor: '#3B82F6' }} />
                  <Caption style={{ color: designTokens.colors.textMuted, includeFontPadding: false, fontSize: 10 }}>Accent</Caption>
                </View>
                <View style={{ alignItems: 'center', gap: designTokens.spacing.xs }}>
                  <View style={{ width: 40, height: 40, borderRadius: 8, backgroundColor: '#39675B' }} />
                  <Caption style={{ color: designTokens.colors.textMuted, includeFontPadding: false, fontSize: 10 }}>Success</Caption>
                </View>
                <View style={{ alignItems: 'center', gap: designTokens.spacing.xs }}>
                  <View style={{ width: 40, height: 40, borderRadius: 8, backgroundColor: '#806F4C' }} />
                  <Caption style={{ color: designTokens.colors.textMuted, includeFontPadding: false, fontSize: 10 }}>Warning</Caption>
                </View>
                <View style={{ alignItems: 'center', gap: designTokens.spacing.xs }}>
                  <View style={{ width: 40, height: 40, borderRadius: 8, backgroundColor: '#7A2C3B' }} />
                  <Caption style={{ color: designTokens.colors.textMuted, includeFontPadding: false, fontSize: 10 }}>Danger</Caption>
                </View>
                <View style={{ alignItems: 'center', gap: designTokens.spacing.xs }}>
                  <View style={{ width: 40, height: 40, borderRadius: 8, backgroundColor: '#5C6A24' }} />
                  <Caption style={{ color: designTokens.colors.textMuted, includeFontPadding: false, fontSize: 10 }}>Brand</Caption>
                </View>
              </View>
            </View>
          </CardContent>
        </Card>
      </View>
    </ScrollView>
  );
}; 