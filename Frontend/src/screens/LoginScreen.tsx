// src/screens/LoginScreen.tsx
import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import api from '../api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {StyledInput} from '../components/StyledComponents';
import StyledButton from '../components/StyledButton';
import {theme} from '../theme/Index';

export default function LoginScreen({navigation}: {navigation: any}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/login', {email, password});
      await AsyncStorage.setItem('token', res.data.token);
      navigation.replace('MainTabs');
    } catch (err: any) {
      const message =
        err?.response?.data?.message ?? err?.message ?? 'Login failed';
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>SplitWise</Text>
          <Text style={styles.subtitle}>Split expenses with friends</Text>
        </View>

        <View style={styles.form}>
          <StyledInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <StyledInput
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <StyledButton title="Login" onPress={handleLogin} loading={loading} />

          <StyledButton
            title="Create Account"
            onPress={() => navigation.navigate('Register')}
            variant="outline"
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xxl * 2,
  },
  title: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text.secondary,
  },
  form: {
    width: '100%',
  },
});
