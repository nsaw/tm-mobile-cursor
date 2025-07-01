import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/contexts/AuthContext';
import { ThoughtmarkProvider } from './src/contexts/ThoughtmarkContext';
import { AppNavigator } from './src/navigation/AppNavigator';

const App = () => {
  return (
    <AuthProvider>
      <ThoughtmarkProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </ThoughtmarkProvider>
    </AuthProvider>
  );
};

export default App;