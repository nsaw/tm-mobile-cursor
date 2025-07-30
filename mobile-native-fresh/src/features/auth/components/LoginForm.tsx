import React from 'react';
import { View, Text, TextInput, Button } from 'react-native';

export default function LoginForm() {
  return (
    <View>
      <Text>Email</Text>
      <TextInput />
      <Text>Password</Text>
      <TextInput secureTextEntry />
      <Button title="Login" onPress={() => console.log('Login pressed')} />
    </View>
  );
}
