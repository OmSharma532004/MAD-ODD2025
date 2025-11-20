// src/screens/ProfileScreen.tsx
import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Card} from '../components/StyledComponents';
import StyledButton from '../components/StyledButton';
import {theme} from '../theme/Index';
import api from '../api';

export default function ProfileScreen({navigation}: {navigation: any}) {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    loadUserInfo();
  }, []);

  async function loadUserInfo() {
    try {
      const res = await api.get('/auth/me');
      setUserName(res.data.name);
      setUserEmail(res.data.email);
    } catch (error) {
      console.error('Failed to load user info', error);
    }
  }

  async function logout() {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.clear();
          navigation.replace('Login');
        },
      },
    ]);
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {userName ? userName.charAt(0).toUpperCase() : '👤'}
          </Text>
        </View>
        <Text style={styles.name}>{userName || 'User'}</Text>
        <Text style={styles.email}>{userEmail || 'email@example.com'}</Text>
      </View>

      <Card style={styles.infoCard}>
        <Text style={styles.sectionTitle}>Account Information</Text>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Name</Text>
          <Text style={styles.infoValue}>{userName}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Email</Text>
          <Text style={styles.infoValue}>{userEmail}</Text>
        </View>
      </Card>

      <Card style={styles.actionsCard}>
        <Text style={styles.sectionTitle}>Settings</Text>
        <StyledButton title="Logout" onPress={logout} variant="secondary" />
      </Card>

      <Text style={styles.version}>Version 1.0.0</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    paddingVertical: theme.spacing.xl,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    ...theme.shadow.medium,
  },
  avatarText: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text.inverse,
  },
  name: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  email: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text.secondary,
  },
  infoCard: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
  },
  infoLabel: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text.secondary,
    fontWeight: theme.fontWeight.medium,
  },
  infoValue: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text.primary,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
  },
  actionsCard: {
    marginBottom: theme.spacing.lg,
  },
  version: {
    textAlign: 'center',
    fontSize: theme.fontSize.sm,
    color: theme.colors.text.light,
    marginTop: 'auto',
  },
});
