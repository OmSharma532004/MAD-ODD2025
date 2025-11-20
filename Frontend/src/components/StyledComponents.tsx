// src/components/StyledComponents.tsx
import React from 'react';
import {
  TextInput,
  StyleSheet,
  TextInputProps,
  View,
  ViewProps,
} from 'react-native';
import {theme} from '../theme/Index';

// Styled Input Component
export const StyledInput: React.FC<TextInputProps> = props => {
  return (
    <TextInput
      style={[styles.input, props.style]}
      placeholderTextColor={theme.colors.text.light}
      {...props}
    />
  );
};

// Container Component
export const Container: React.FC<ViewProps> = ({style, ...props}) => {
  return <View style={[styles.container, style]} {...props} />;
};

// Card Component
export const Card: React.FC<ViewProps> = ({style, ...props}) => {
  return <View style={[styles.card, style]} {...props} />;
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    fontSize: theme.fontSize.md,
    color: theme.colors.text.primary,
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
  },
  card: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadow.small,
  },
});
