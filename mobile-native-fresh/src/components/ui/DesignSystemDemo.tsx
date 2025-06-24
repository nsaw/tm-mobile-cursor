import React from 'react';
import { View, ScrollView } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { Button } from './Button';
import { Card, CardHeader, CardContent, CardFooter } from './Card';
import { Text, Heading, Subheading, BodyText, Caption } from './Text';

export const DesignSystemDemo: React.FC = () => {
  const { tokens } = useTheme();

  return (
    <ScrollView style={{ flex: 1, backgroundColor: tokens.colors.background }}>
      <View style={{ padding: tokens.spacing.lg }}>
        {/* Typography Section */}
        <Card variant="elevated" style={{ marginBottom: tokens.spacing.xl }}>
          <CardHeader>
            <Heading level={1}>Design System Demo</Heading>
            <Caption>Showcasing our new component variants</Caption>
          </CardHeader>
          
          <CardContent>
            <View style={{ gap: tokens.spacing.md }}>
              <Heading level={1}>Heading Level 1</Heading>
              <Heading level={2}>Heading Level 2</Heading>
              <Heading level={3}>Heading Level 3</Heading>
              <Subheading>Subheading Text</Subheading>
              <BodyText>Body text with normal weight and size</BodyText>
              <Caption>Caption text for secondary information</Caption>
              <Text variant="label">Label text for form elements</Text>
            </View>
          </CardContent>
        </Card>

        {/* Button Variants */}
        <Card variant="elevated" style={{ marginBottom: tokens.spacing.xl }}>
          <CardHeader>
            <Heading level={2}>Button Variants</Heading>
          </CardHeader>
          
          <CardContent>
            <View style={{ gap: tokens.spacing.md }}>
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
        <Card variant="elevated" style={{ marginBottom: tokens.spacing.xl }}>
          <CardHeader>
            <Heading level={2}>Button Sizes</Heading>
          </CardHeader>
          
          <CardContent>
            <View style={{ gap: tokens.spacing.md }}>
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
                🔥
              </Button>
            </View>
          </CardContent>
        </Card>

        {/* Card Variants */}
        <Card variant="elevated" style={{ marginBottom: tokens.spacing.xl }}>
          <CardHeader>
            <Heading level={2}>Card Variants</Heading>
          </CardHeader>
          
          <CardContent>
            <View style={{ gap: tokens.spacing.md }}>
              <Card variant="default" onPress={() => console.log('Default card pressed')}>
                <CardContent>
                  <BodyText>Default Card - Tap me!</BodyText>
                </CardContent>
              </Card>
              
              <Card variant="glass" onPress={() => console.log('Glass card pressed')}>
                <CardContent>
                  <BodyText>Glass Card - Tap me!</BodyText>
                </CardContent>
              </Card>
              
              <Card variant="elevated" onPress={() => console.log('Elevated card pressed')}>
                <CardContent>
                  <BodyText>Elevated Card - Tap me!</BodyText>
                </CardContent>
              </Card>
              
              <Card variant="interactive" onPress={() => console.log('Interactive card pressed')}>
                <CardContent>
                  <BodyText>Interactive Card - Tap me!</BodyText>
                </CardContent>
              </Card>
            </View>
          </CardContent>
        </Card>

        {/* Color Palette */}
        <Card variant="elevated" style={{ marginBottom: tokens.spacing.xl }}>
          <CardHeader>
            <Heading level={2}>Color Palette</Heading>
          </CardHeader>
          
          <CardContent>
            <View style={{ gap: tokens.spacing.sm }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: tokens.spacing.sm }}>
                <View style={{ width: 20, height: 20, backgroundColor: tokens.colors.accent, borderRadius: 4 }} />
                <Text>Accent: {tokens.colors.accent}</Text>
              </View>
              
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: tokens.spacing.sm }}>
                <View style={{ width: 20, height: 20, backgroundColor: tokens.colors.success, borderRadius: 4 }} />
                <Text>Success: {tokens.colors.success}</Text>
              </View>
              
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: tokens.spacing.sm }}>
                <View style={{ width: 20, height: 20, backgroundColor: tokens.colors.warning, borderRadius: 4 }} />
                <Text>Warning: {tokens.colors.warning}</Text>
              </View>
              
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: tokens.spacing.sm }}>
                <View style={{ width: 20, height: 20, backgroundColor: tokens.colors.danger, borderRadius: 4 }} />
                <Text>Danger: {tokens.colors.danger}</Text>
              </View>
              
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: tokens.spacing.sm }}>
                <View style={{ width: 20, height: 20, backgroundColor: tokens.colors.brand, borderRadius: 4 }} />
                <Text>Brand: {tokens.colors.brand}</Text>
              </View>
            </View>
          </CardContent>
        </Card>
      </View>
    </ScrollView>
  );
}; 