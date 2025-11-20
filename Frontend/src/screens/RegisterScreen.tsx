// src/screens/RegisterScreen.tsx
import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import api from '../api';
import {StyledInput} from '../components/StyledComponents';
import StyledButton from '../components/StyledButton';
import {theme} from '../theme/Index';

export default function RegisterScreen({navigation}: {navigation: any}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/register', {name, email, password});
      Alert.alert('Success', 'Registration complete! Please login.');
      navigation.goBack();
    } catch (err: any) {
      const message =
        err?.response?.data?.message ??
        (err instanceof Error ? err.message : 'Failed');
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
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join and start splitting expenses</Text>
        </View>

        <View style={styles.form}>
          <StyledInput
            placeholder="Full Name"
            value={name}
            onChangeText={setName}
          />
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

          <StyledButton
            title="Register"
            onPress={handleRegister}
            loading={loading}
          />

          <TouchableOpacity
            style={styles.loginLink}
            onPress={() => navigation.goBack()}>
            <Text style={styles.loginText}>
              Already have an account?{' '}
              <Text style={styles.loginTextBold}>Login</Text>
            </Text>
          </TouchableOpacity>
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
  loginLink: {
    alignItems: 'center',
    marginTop: theme.spacing.lg,
  },
  loginText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text.secondary,
  },
  loginTextBold: {
    color: theme.colors.primary,
    fontWeight: theme.fontWeight.semibold,
  },
});
