import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import {
  useNavigation,
  NavigationProp,
} from '@react-navigation/native';
import { RootStackParamList } from '../../../navigation/types';
import { useTheme } from '../../../theme/ThemeProvider';

type ContentPage = {
  title: string;
  description: string;
  route: keyof RootStackParamList;
  iconName: React.ComponentProps<typeof Feather>['name'];
  iconColor: string;
};

// tell TS what routes we can navigate to
type ContentScreenNavigationProp = NavigationProp<RootStackParamList>;

export const ContentScreen: React.FC = () => {
  const navigation = useNavigation<ContentScreenNavigationProp>();
  const { tokens } = useTheme();
  const styles = getStyles(tokens);

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
        <Text style={styles.screenTitle}>Content Management</Text>
        <Text style={styles.screenSubtitle}>
          Create, organize, and manage your thoughtmarks and bins. Archive and trash are shared spaces for both content types.
        </Text>

        {contentPages.map((page) => (
          <TouchableOpacity
            key={page.route}
            style={styles.card}
            onPress={() => navigation.navigate(page.route as any)}
          >
            <View style={styles.cardIconContainer}>
              <Feather name={page.iconName} size={24} color={page.iconColor} />
            </View>
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardTitle}>{page.title}</Text>
              <Text style={styles.cardDescription}>{page.description}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const getStyles = (tokens: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: designTokens.colors.background,
  },
  content: {
    padding: designTokens.spacing.md,
  },
  screenTitle: {
    ...designTokens.typography.heading,
    marginBottom: designTokens.spacing.sm,
  },
  screenSubtitle: {
    ...designTokens.typography.body,
    marginBottom: designTokens.spacing.lg,
    color: designTokens.colors.textSecondary,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: designTokens.colors.card,
    borderRadius: 12,
    padding: designTokens.spacing.md,
    alignItems: 'flex-start',
    marginBottom: designTokens.spacing.md,
    elevation: 2,
  },
  cardIconContainer: {
    marginRight: designTokens.spacing.md,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    ...designTokens.typography.subheading,
    marginBottom: designTokens.spacing.xs,
    color: designTokens.colors.text,
  },
  cardDescription: {
    ...designTokens.typography.body,
    color: designTokens.colors.textSecondary,
  },
});
