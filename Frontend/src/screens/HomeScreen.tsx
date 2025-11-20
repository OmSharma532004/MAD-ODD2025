// src/screens/HomeScreen.tsx
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import api from '../api';
import TransactionItem from '../components/TransactionItem';
import {StyledInput, Card} from '../components/StyledComponents';
import {theme} from '../theme/Index';

export default function HomeScreen() {
  type SummaryItem = {id: string; name: string; balance: number};

  const [txns, setTxns] = useState<any[]>([]);
  const [category, setCategory] = useState('');
  const [summary, setSummary] = useState<SummaryItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    await Promise.all([loadTxns(), loadSummary()]);
  }

  async function loadTxns() {
    try {
      const res = await api.get('/transactions', {
        params: {category: category || undefined},
      });
      setTxns(res.data);
    } catch (error) {
      console.error('Failed to load transactions', error);
    }
  }

  async function loadSummary() {
    try {
      const res = await api.get('/transactions/summary');
      setSummary(res.data);
    } catch (error) {
      console.error('Failed to load summary', error);
    }
  }

  async function onRefresh() {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }

  return (
    <View style={styles.container}>
      <View style={styles.filterSection}>
        <StyledInput
          placeholder="Filter by category"
          value={category}
          onChangeText={setCategory}
          style={styles.filterInput}
        />
        <TouchableOpacity style={styles.filterButton} onPress={loadTxns}>
          <Text style={styles.filterButtonText}>Apply</Text>
        </TouchableOpacity>
      </View>

      {summary.length > 0 && (
        <Card style={styles.summaryCard}>
          <Text style={styles.sectionTitle}>Your Balances</Text>
          {summary.map(u => (
            <View key={u.id} style={styles.balanceRow}>
              <Text style={styles.balanceName}>{u.name}</Text>
              <Text
                style={[
                  styles.balanceAmount,
                  u.balance >= 0
                    ? styles.positiveBalance
                    : styles.negativeBalance,
                ]}>
                ₹{Math.abs(u.balance).toFixed(2)}
              </Text>
            </View>
          ))}
        </Card>
      )}

      <Text style={styles.sectionTitle}>Recent Transactions</Text>

      <FlatList
        data={txns}
        keyExtractor={i => i._id}
        renderItem={({item}) => <TransactionItem txn={item} />}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No transactions yet</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
  },
  filterSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  filterInput: {
    flex: 1,
    marginBottom: 0,
    marginRight: theme.spacing.sm,
  },
  filterButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    ...theme.shadow.small,
  },
  filterButtonText: {
    color: theme.colors.text.inverse,
    fontWeight: theme.fontWeight.semibold,
    fontSize: theme.fontSize.md,
  },
  summaryCard: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  balanceName: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text.primary,
  },
  balanceAmount: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
  },
  positiveBalance: {
    color: theme.colors.success,
  },
  negativeBalance: {
    color: theme.colors.error,
  },
  listContent: {
    paddingBottom: theme.spacing.lg,
  },
  emptyContainer: {
    padding: theme.spacing.xxl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text.secondary,
  },
});
