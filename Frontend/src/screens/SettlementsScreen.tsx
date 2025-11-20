// src/screens/SettlementsScreen.tsx
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
} from 'react-native';
import api from '../api';
import {StyledInput, Card} from '../components/StyledComponents';
import StyledButton from '../components/StyledButton';
import {theme} from '../theme/Index';

export default function SettlementsScreen() {
  const [toEmail, setToEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  interface Settlement {
    _id: string;
    from: {name: string};
    to: {name: string};
    amount: number;
    date: string | number;
    note?: string;
  }

  const [list, setList] = useState<Settlement[]>([]);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const res = await api.get('/settlements');
      setList(res.data);
    } catch (error) {
      console.error('Failed to load settlements', error);
    }
  }

  async function onRefresh() {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }

  async function record() {
    // local validation
    const emailTrim = toEmail.trim();
    const amt = parseFloat(amount);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailTrim || !emailRegex.test(emailTrim)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }
    if (!isFinite(amt) || amt <= 0) {
      Alert.alert('Error', 'Please enter a valid amount (> 0)');
      return;
    }

    setLoading(true);
    try {
      await api.post('/settlements', {
        toEmail: emailTrim,
        amount: amt,
        note,
      });
      Alert.alert('Success', 'Payment recorded successfully!');
      setToEmail('');
      setAmount('');
      setNote('');
      load();
    } catch (error: any) {
      // surface backend message when available
      const serverMsg = error?.response?.data?.message;
      Alert.alert('Error', serverMsg || 'Failed to record payment');
      console.error('Record settlement error:', error?.response || error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
          />
        }>
        <View style={styles.content}>
          <Card style={styles.formCard}>
            <Text style={styles.formTitle}>Record Payment</Text>
            <Text style={styles.formSubtitle}>Settle up with a friend</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Pay To (Email)</Text>
              <StyledInput
                placeholder="friend@example.com"
                value={toEmail}
                onChangeText={setToEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Amount</Text>
              <StyledInput
                placeholder="0.00"
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Note (Optional)</Text>
              <StyledInput
                placeholder="What's this payment for?"
                value={note}
                onChangeText={setNote}
              />
            </View>

            <StyledButton
              title="Record Payment"
              onPress={record}
              loading={loading}
            />
          </Card>

          <Text style={styles.sectionTitle}>Payment History</Text>

          {list.length === 0 ? (
            <Card style={styles.emptyCard}>
              <Text style={styles.emptyText}>No settlements yet</Text>
            </Card>
          ) : (
            list.map(item => (
              <Card key={item._id} style={styles.settlementCard}>
                <View style={styles.settlementHeader}>
                  <View style={styles.settlementIcon}>
                    <Text style={styles.settlementIconText}>💸</Text>
                  </View>
                  <View style={styles.settlementInfo}>
                    <Text style={styles.settlementAmount}>
                      ₹{item.amount.toFixed(2)}
                    </Text>
                    <Text style={styles.settlementParties}>
                      {item.from?.name || 'Unknown'} →{' '}
                      {item.to?.name || 'Unknown'}
                    </Text>
                  </View>
                </View>
                {item.note && (
                  <Text style={styles.settlementNote}>{item.note}</Text>
                )}
                <Text style={styles.settlementDate}>
                  {new Date(item.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </Text>
              </Card>
            ))
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: theme.spacing.lg,
  },
  formCard: {
    marginBottom: theme.spacing.xl,
  },
  formTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  formSubtitle: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.lg,
  },
  inputGroup: {
    marginBottom: theme.spacing.md,
  },
  label: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  settlementCard: {
    marginBottom: theme.spacing.md,
  },
  settlementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  settlementIcon: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  settlementIconText: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.primary,
  },
  settlementInfo: {
    flex: 1,
  },
  settlementAmount: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.success,
    marginBottom: theme.spacing.xs,
  },
  settlementParties: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text.primary,
  },
  settlementNote: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text.secondary,
    fontStyle: 'italic',
    marginBottom: theme.spacing.sm,
  },
  settlementDate: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.text.light,
  },
  emptyCard: {
    padding: theme.spacing.xxl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text.secondary,
  },
});
