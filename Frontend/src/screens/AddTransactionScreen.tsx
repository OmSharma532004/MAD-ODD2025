// src/screens/AddTransactionScreen.tsx
import React, {useState} from 'react';
import {
  View,
  Text,
  Alert,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import api from '../api';
import {StyledInput} from '../components/StyledComponents';
import StyledButton from '../components/StyledButton';
import {theme} from '../theme/Index';

export default function AddTransactionScreen({navigation}: {navigation: any}) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [splitWith, setSplitWith] = useState('');
  const [loading, setLoading] = useState(false);

  async function save() {
    if (!amount || !description) {
      Alert.alert('Error', 'Please fill in amount and description');
      return;
    }

    setLoading(true);
    try {
      await api.post('/transactions', {
        amount: parseFloat(amount),
        description,
        category,
        splitWith:
          splitWith === 'all' ? 'all' : splitWith.split(',').map(x => x.trim()),
      });
      Alert.alert('Success', 'Transaction added successfully!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to save transaction');
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
        contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Add Expense</Text>
          <Text style={styles.subtitle}>Record a new expense to split</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Amount *</Text>
            <StyledInput
              placeholder="0.00"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description *</Text>
            <StyledInput
              placeholder="What was this expense for?"
              value={description}
              onChangeText={setDescription}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Category</Text>
            <StyledInput
              placeholder="e.g., Food, Transport, Entertainment"
              value={category}
              onChangeText={setCategory}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Split With</Text>
            <StyledInput
              placeholder="Enter emails (comma-separated) or 'all'"
              value={splitWith}
              onChangeText={setSplitWith}
              multiline
            />
            <Text style={styles.hint}>
              Tip: Type "all" to split with everyone, or enter specific email
              addresses separated by commas
            </Text>
          </View>

          <StyledButton
            title="Add Transaction"
            onPress={save}
            loading={loading}
          />
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
  header: {
    marginBottom: theme.spacing.xl,
  },
  title: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text.secondary,
  },
  form: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: theme.spacing.lg,
  },
  label: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  hint: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.text.light,
    marginTop: -theme.spacing.sm,
    fontStyle: 'italic',
  },
});
