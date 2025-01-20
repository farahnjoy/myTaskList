import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';

export default function SignupScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [error, setError] = useState('');

  const handleSignup = async () => {
    // Check if all fields are filled
    if (!email || !username || !password || !passwordConfirm) {
      setError('All fields are required');
      return;
    }

    // Check if passwords match
    if (password !== passwordConfirm) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, password }),
      });

      const data = await response.json();
      if (response.ok) {
        navigation.navigate('Login'); // Navigate to Login screen after successful signup
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Network error, please try again');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        secureTextEntry
        value={passwordConfirm}
        onChangeText={setPasswordConfirm}
      />
      <Button title="Sign Up" onPress={handleSignup} color="#F5D9DE" />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <Button title="Back to Login" onPress={() => navigation.navigate('Login')} color="#F5D9DE" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    padding: 20 
  },
  input: { 
    borderWidth: 1, 
    marginBottom: 10, 
    padding: 10, 
    borderRadius: 5 
  },
  errorText: { 
    color: '#991044', 
    margin: 10 
  },
});
