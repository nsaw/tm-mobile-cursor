import React from 'react';
import { View, Text, TextInput, Button } from 'react-native';

export default function RegistrationForm() {
  return (
    <View>
      <Text>Username</Text>
      <TextInput />
      <Text>Email</Text>
      <TextInput />
      <Text>Password</Text>
      <TextInput secureTextEntry />
      <Button title="Register" onPress={() => console.log('Register pressed')} />
    </View>
  );
}
