import { View, ScrollView } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../../theme/ThemeProvider';

import { Text , Heading, Subheading, BodyText, Caption } from './Text';
import { Button } from './Button';
import { Card, CardHeader, CardContent } from './Card';

export const DesignSystemDemo: React.FC = () => {
  const { tokens: designTokens } = useTheme();

  return (
    <ScrollView style={{ flex: 1, backgroundColor: designTokens.colors.background }}>
      <View style={{ padding: designTokens.spacing.lg }}>
        {/* Typography Section */}
        <Card variant="elevated" style={{ marginBottom: designTokens.spacing.xl }}>
          <CardHeader>
            <Heading><Text>Design System Demo</Text></Heading>
            <Caption><Text>Showcasing our new component variants</Text></Caption>
          </CardHeader>
          
          <CardContent>
            <View style={{ gap: designTokens.spacing.md }}>
              <Heading><Text>Heading Level 1</Text></Heading>
              <Heading><Text>Heading Level 2</Text></Heading>
              <Heading><Text>Heading Level 3</Text></Heading>
              <Subheading><Text>Subheading Text</Text></Subheading>
              <BodyText><Text>Body text with normal weight and size</Text></BodyText>
              <Caption><Text>Caption text for secondary information</Text></Caption>
              <Text variant="label" style={{ color: designTokens.colors.textSecondary, includeFontPadding: false }}>Label text for form elements</Text>
            </View>
          </CardContent>
        </Card>

        {/* Button Variants */}
        <Card variant="elevated" style={{ marginBottom: designTokens.spacing.xl }}>
          <CardHeader>
            <Heading><Text>Button Variants</Text></Heading>
            <Caption><Text>Different button styles and states</Text></Caption>
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
            <Heading><Text>Button Sizes</Text></Heading>
            <Caption><Text>Available button size options</Text></Caption>
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
            <Heading><Text>Card Variants</Text></Heading>
            <Caption><Text>Different card styles and layouts</Text></Caption>
          </CardHeader>
          
          <CardContent>
            <View style={{ gap: designTokens.spacing.md }}>
              <Card variant="default" onPress={() => console.log('Default card pressed')}>
                <CardContent>
                  <BodyText><Text>Default Card - Tap me!</Text></BodyText>
                </CardContent>
              </Card>
              
              <Card variant="glass" onPress={() => console.log('Glass card pressed')}>
                <CardContent>
                  <BodyText><Text>Glass Card - Tap me!</Text></BodyText>
                </CardContent>
              </Card>
              
              <Card variant="elevated" onPress={() => console.log('Elevated card pressed')}>
                <CardContent>
                  <BodyText><Text>Elevated Card - Tap me!</Text></BodyText>
                </CardContent>
              </Card>
              
              <Card variant="interactive" onPress={() => console.log('Interactive card pressed')}>
                <CardContent>
                  <BodyText><Text>Interactive Card - Tap me!</Text></BodyText>
                </CardContent>
              </Card>
            </View>
          </CardContent>
        </Card>

        {/* Color Palette Section */}
        <Card variant="elevated" style={{ marginBottom: designTokens.spacing.xl }}>
          <CardHeader>
            <Heading><Text>Color Palette</Text></Heading>
            <Caption><Text>Our refined muted color system</Text></Caption>
          </CardHeader>
          
          <CardContent>
            <View style={{ gap: designTokens.spacing.md }}>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: designTokens.spacing.sm }}>
                <View style={{ alignItems: 'center', gap: designTokens.spacing.xs }}>
                  <View style={{ width: 40, height: 40, borderRadius: 8, backgroundColor: designTokens.colors.background }} />
                  <Caption><Text>Accent</Text></Caption>
                </View>
                <View style={{ alignItems: 'center', gap: designTokens.spacing.xs }}>
                  <View style={{ width: 40, height: 40, borderRadius: 8, backgroundColor: designTokens.colors.background }} />
                  <Caption><Text>Success</Text></Caption>
                </View>
                <View style={{ alignItems: 'center', gap: designTokens.spacing.xs }}>
                  <View style={{ width: 40, height: 40, borderRadius: 8, backgroundColor: designTokens.colors.background }} />
                  <Caption><Text>Warning</Text></Caption>
                </View>
                <View style={{ alignItems: 'center', gap: designTokens.spacing.xs }}>
                  <View style={{ width: 40, height: 40, borderRadius: 8, backgroundColor: designTokens.colors.background }} />
                  <Caption><Text>Danger</Text></Caption>
                </View>
                <View style={{ alignItems: 'center', gap: designTokens.spacing.xs }}>
                  <View style={{ width: 40, height: 40, borderRadius: 8, backgroundColor: designTokens.colors.background }} />
                  <Caption><Text>Brand</Text></Caption>
                </View>
              </View>
            </View>
          </CardContent>
        </Card>
      </View>
    </ScrollView>
  );
}; 