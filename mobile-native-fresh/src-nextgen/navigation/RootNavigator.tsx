import React from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AutoRoleView } from '../shell/wrappers/AutoRoleView';

// CODE SPLITTING: Dynamically import screen modules to reduce initial JS load
const ThoughtmarkDetailScreen = React.lazy(() => import('../screens/ThoughtmarkDetailScreen'));

const Stack = createStackNavigator();

export const RootNavigator: React.FC = () => {
  return (
    <AutoRoleView layoutRole="navigation">
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{ title: 'Home' }}
          />
          <Stack.Screen 
            name="ThoughtmarkDetail" 
            component={ThoughtmarkDetailScreenWrapper}
            options={{ title: 'Thoughtmark Details' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AutoRoleView>
  );
};

// Wrapper component to handle lazy loading and props
const ThoughtmarkDetailScreenWrapper: React.FC = () => {
  return (
    <React.Suspense fallback={<Text>Loading...</Text>}>
      <ThoughtmarkDetailScreen thoughtmarkId="default" />
    </React.Suspense>
  );
};

// Placeholder HomeScreen component
const HomeScreen: React.FC = () => {
  return (
    <AutoRoleView layoutRole="container-main" style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home Screen</Text>
    </AutoRoleView>
  );
};

export default RootNavigator; 