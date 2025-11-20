// src/theme/index.ts
export const theme = {
  colors: {
    primary: '#1CC29F',
    primaryDark: '#16A085',
    primaryLight: '#E8F8F5',

    secondary: '#FF6B6B',
    secondaryLight: '#FFE5E5',

    background: '#F8F9FA',
    surface: '#FFFFFF',

    text: {
      primary: '#2C3E50',
      secondary: '#7F8C8D',
      light: '#95A5A6',
      inverse: '#FFFFFF',
    },

    border: '#E8ECEF',
    borderDark: '#D5DBDF',

    success: '#27AE60',
    error: '#E74C3C',
    warning: '#F39C12',
    info: '#3498DB',

    shadow: 'rgba(0, 0, 0, 0.08)',
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
  },

  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    full: 9999,
  },

  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 24,
    xxl: 32,
  },

  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },

  shadow: {
    small: {
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 1},
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 4,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.12,
      shadowRadius: 8,
      elevation: 8,
    },
  },
};
