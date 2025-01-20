import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Switch } from 'react-native';

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [staySignedIn, setStaySignedIn] = useState(false);  // State for Stay Signed In
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, staySignedIn }),  // Include staySignedIn in the request
      });

      const data = await response.json();
      if (response.ok) {
        navigation.navigate('Tasks'); // Navigate to Tasks screen on success
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
      
      {/* Stay Signed In Checkbox */}
      <View style={styles.checkboxContainer}>
        <Text style={styles.checkboxLabel}>Stay Signed In</Text>
        <Switch
          value={staySignedIn}
          onValueChange={setStaySignedIn}
        />
      </View>

      <Button title="Login" onPress={handleLogin} color="#F5D9DE" />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <Button title="Sign Up" onPress={() => navigation.navigate('Signup')} color="#F5D9DE" />
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
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  checkboxLabel: {
    marginRight: 10,
  }
});
