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
import { NativeStackParamList } from '../../../navigation/types';
import { colors, spacing, typography } from '../../../theme/theme';

type ContentPage = {
  title: string;
  description: string;
  route: keyof NativeStackParamList;
  iconName: React.ComponentProps<typeof Feather>['name'];
  iconColor: string;
};

// tell TS what routes we can navigate to
type ContentScreenNavigationProp = NavigationProp<NativeStackParamList>;

export const ContentScreen: React.FC = () => {
  const navigation = useNavigation<ContentScreenNavigationProp>();

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
      route: 'HomeMain',
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
      route: 'Trash',
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
            onPress={() => navigation.navigate(page.route)}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.md,
  },
  screenTitle: {
    ...typography.heading,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  screenSubtitle: {
    ...typography.body,
    color: colors.subtext,
    marginBottom: spacing.lg,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing.md,
    alignItems: 'flex-start',
    marginBottom: spacing.md,
    elevation: 2,
  },
  cardIconContainer: {
    marginRight: spacing.md,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    ...typography.subheading,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  cardDescription: {
    ...typography.body,
    color: colors.subtext,
  },
});
