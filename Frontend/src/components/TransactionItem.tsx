// src/components/TransactionItem.tsx
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Card} from './StyledComponents';
import {theme} from '../theme/Index';

type Transaction = {
  category: string;
  amount: number;
  description?: string;
  paidBy?: {name?: string} | null;
  date: string | number | Date;
};

interface TransactionItemProps {
  txn: Transaction;
}

export default function TransactionItem({txn}: TransactionItemProps) {
  const getCategoryColor = (category: string) => {
    const colors: {[key: string]: string} = {
      food: '#FF6B6B',
      transport: '#4ECDC4',
      entertainment: '#95E1D3',
      utilities: '#F38181',
      shopping: '#AA96DA',
      health: '#FCBAD3',
    };
    return colors[category?.toLowerCase()] || theme.colors.primary;
  };

  const getCategoryEmoji = (category: string) => {
    const emojis: {[key: string]: string} = {
      food: '🍔',
      transport: '🚗',
      entertainment: '🎬',
      utilities: '💡',
      shopping: '🛍️',
      health: '💊',
    };
    return emojis[category?.toLowerCase()] || '💸';
  };

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <View style={styles.leftSection}>
          <View
            style={[
              styles.categoryBadge,
              {backgroundColor: getCategoryColor(txn.category || 'General')},
            ]}>
            <Text style={styles.categoryText}>
              {getCategoryEmoji(txn.category || 'General')}
            </Text>
          </View>
          <View style={styles.info}>
            <Text style={styles.category}>{txn.category}</Text>
            <Text style={styles.description}>{txn.description}</Text>
          </View>
        </View>
        <Text style={styles.amount}>₹{txn.amount.toFixed(2)}</Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.paidBy}>
          Paid by{' '}
          <Text style={styles.paidByName}>{txn.paidBy?.name || 'Unknown'}</Text>
        </Text>
        <Text style={styles.date}>
          {new Date(txn.date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          })}
        </Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: theme.spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryBadge: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  categoryText: {
    color: theme.colors.text.inverse,
    fontSize: 20, // adjusted to better show emoji
    fontWeight: theme.fontWeight.bold,
  },
  info: {
    flex: 1,
  },
  category: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text.primary,
    textTransform: 'capitalize',
    marginBottom: theme.spacing.xs,
  },
  description: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text.secondary,
  },
  amount: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.primary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  paidBy: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.text.light,
  },
  paidByName: {
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text.secondary,
  },
  date: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.text.light,
  },
});
