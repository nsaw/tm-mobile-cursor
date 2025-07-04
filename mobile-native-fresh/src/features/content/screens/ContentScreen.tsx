import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';

import { useTheme } from '../../../theme/ThemeProvider';
import { Text } from '../../../components/ui/Text';
import { RootStackParamList } from '../../../navigation/types';

type ContentPage = {
  title: string;
  description: string;
  route: keyof RootStackParamList;
  iconName: React.ComponentProps<typeof Feather>['name'];
  iconColor: string;
};

// tell TS what routes we can navigate to
type ContentScreenNavigationProp = NavigationProp<RootStackParamList, 'Content'>;

export const ContentScreen: React.FC = () => {
  const navigation = useNavigation<ContentScreenNavigationProp>();
  const { tokens } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: tokens.colors.background,
    },
    content: {
      padding: tokens.spacing.md,
    },
    title: {
      fontFamily: tokens.typography.fontFamily.heading,
      fontSize: tokens.typography.fontSize.heading,
      fontWeight: tokens.typography.fontWeight.bold,
      marginBottom: tokens.spacing.sm,
    },
    description: {
      fontFamily: tokens.typography.fontFamily.body,
      fontSize: tokens.typography.fontSize.body,
      marginBottom: tokens.spacing.lg,
      color: tokens.colors.textSecondary,
    },
    card: {
      flexDirection: 'row',
      backgroundColor: tokens.colors.surface,
      borderRadius: 12,
      padding: tokens.spacing.md,
      alignItems: 'flex-start',
      marginBottom: tokens.spacing.md,
      elevation: 2,
    },
    tag: {
      marginRight: tokens.spacing.md,
    },
    cardTextContainer: {
      flex: 1,
    },
    subtitle: {
      fontFamily: tokens.typography.fontFamily.heading,
      fontSize: tokens.typography.fontSize.lg,
      fontWeight: tokens.typography.fontWeight.semibold,
      marginBottom: tokens.spacing.xs,
      color: tokens.colors.text,
    },
    body: {
      fontFamily: tokens.typography.fontFamily.body,
      fontSize: tokens.typography.fontSize.body,
      color: tokens.colors.textSecondary,
    },
  });

  const contentPages: ContentPage[] = [
    {
      title: 'Create Thoughtmark',
      description: 'Create a new thoughtmark to capture your ideas',
      route: 'CreateThoughtmark',
      iconName: 'plus',
      iconColor: '#22c55e',
    },
    {
      title: 'All Thoughtmarks',
      description: 'Browse and manage all your thoughtmarks',
      route: 'Dashboard',
      iconName: 'list',
      iconColor: '#3b82f6',
    },
    {
      title: 'Archive',
      description: 'View archived thoughtmarks and bins',
      route: 'Archive',
      iconName: 'archive',
      iconColor: '#eab308',
    },
    {
      title: 'Recently Deleted',
      description: 'Recover deleted thoughtmarks and bins',
      route: 'Archive',
      iconName: 'rotate-ccw',
      iconColor: '#ef4444',
    },
    {
      title: 'Search',
      description: 'Search through your thoughtmarks',
      route: 'Search',
      iconName: 'search',
      iconColor: '#a855f7',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Content Management</Text>
        <Text style={styles.description}>
          Create, organize, and manage your thoughtmarks and bins. Archive and trash are shared spaces for both content types.
        </Text>

        {contentPages.map((page) => (
        <TouchableOpacity
          key={page.route}
          style={styles.card}
          onPress={() => navigation.navigate(page.route as any)}
          accessibilityRole="button"
          accessible={true}
          accessibilityLabel={page.title}
        >
          <View style={styles.tag}>
            <Feather name={page.iconName} size={24} color={page.iconColor} />
          </View>
          <View style={styles.cardTextContainer}>
            <Text style={styles.subtitle}>{page.title}</Text>
            <Text style={styles.body}>{page.description}</Text>
          </View>
        </TouchableOpacity>
      ))}

      </ScrollView>
    </SafeAreaView>
  );
};
